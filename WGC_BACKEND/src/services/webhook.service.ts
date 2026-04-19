import prisma from '../prisma/client';
import logger from '../utils/logger';
import axios from 'axios';

export class WebhookService {
  async processFinixEvent(payload: any) {
    const { type, data } = payload;
    
    // Store the event
    const event = await prisma.webhookEvent.create({
      data: {
        eventType: type,
        payload: JSON.stringify(payload),
      },
    });

    logger.info(`Processing Webhook Event: ${type} (${event.id})`);

    try {
      let partnerIdToNotify: string | null = null;

      switch (type) {
        case 'payment.succeeded':
          partnerIdToNotify = await this.handlePaymentSuccess(data);
          break;
        case 'payment.failed':
          partnerIdToNotify = await this.handlePaymentFailure(data);
          break;
        case 'merchant.updated':
          partnerIdToNotify = await this.handleMerchantUpdate(data);
          break;
        case 'payout.created':
          partnerIdToNotify = await this.handlePayoutCreated(data);
          break;
        default:
          logger.warn(`Unhandled webhook event type: ${type}`);
      }

      // If we identified a partner, forward the event to them
      if (partnerIdToNotify) {
        await this.forwardToPartner(partnerIdToNotify, payload);
      }

      // Mark as processed
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });

    } catch (error) {
      logger.error(`Error processing webhook event ${event.id}:`, error);
      throw error;
    }
  }

  private async forwardToPartner(partnerId: string, payload: any) {
    try {
      const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
      
      if (!partner || !partner.webhookUrl) {
        return;
      }

      logger.info(`Forwarding event to partner ${partner.name} at ${partner.webhookUrl}`);
      
      await axios.post(partner.webhookUrl, payload, {
        headers: {
          'X-WGC-Signature': 'TODO_SIGNATURE_HERE', // Future enhancement
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

    } catch (error) {
      logger.error(`Failed to forward webhook to partner ${partnerId}:`, error);
    }
  }

  private async handlePaymentSuccess(data: any): Promise<string | null> {
    const { id, amount, tags, identity } = data;
    const paymentId = tags?.internal_payment_id;

    const merchant = await prisma.merchant.findFirst({
      where: { finixMerchantId: identity }
    });

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'success', finixPaymentId: id },
      });
    }

    return merchant?.partnerId || null;
  }

  private async handlePaymentFailure(data: any): Promise<string | null> {
    const { tags, identity } = data;
    const paymentId = tags?.internal_payment_id;

    const merchant = await prisma.merchant.findFirst({
      where: { finixMerchantId: identity }
    });

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'failed' },
      });
    }

    return merchant?.partnerId || null;
  }

  private async handleMerchantUpdate(data: any): Promise<string | null> {
    const { id, status } = data;
    
    const merchant = await prisma.merchant.findFirst({
      where: { finixMerchantId: id }
    });

    if (merchant) {
      await prisma.merchant.update({
        where: { id: merchant.id },
        data: { 
          status: status === 'APPROVED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'pending' 
        },
      });
    }

    return merchant?.partnerId || null;
  }

  private async handlePayoutCreated(data: any): Promise<string | null> {
    const { id, amount, identity } = data;

    const merchant = await prisma.merchant.findFirst({
      where: { finixMerchantId: identity }
    });

    if (merchant) {
      await prisma.payout.create({
        data: {
          amount: amount / 100,
          status: 'pending',
          merchantId: merchant.id
        }
      });
    }

    return merchant?.partnerId || null;
  }
}

export const webhookService = new WebhookService();
