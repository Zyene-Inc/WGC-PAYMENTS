import prisma from '../prisma/client';
import { finixPaymentsService } from './finix/finix-payments.service';
import { FeeUtility } from '../utils/fee.utils';
import logger from '../utils/logger';

export class RecurringService {
  /**
   * Run daily processing for recurring donations
   * Scheduled to run at midnight
   */
  async processDailyCharges() {
    const today = new Date();
    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);

    logger.info(`Starting daily recurring donation processing for: ${today.toDateString()}`);

    // 1. Fetch all active recurring donations due today or earlier
    const dueDonations = await prisma.recurringDonation.findMany({
      where: {
        status: 'active',
        nextBillingDate: {
          lte: today
        }
      },
      include: {
        donor: true,
        merchant: true
      }
    });

    logger.info(`Found ${dueDonations.length} donations to process.`);

    for (const donation of dueDonations) {
      try {
        await this.processSingleCharge(donation);
      } catch (error) {
        logger.error(`Failed to process recurring donation ${donation.id}:`, error);
        // Continue to next donation
      }
    }

    logger.info(`Finished daily processing.`);
  }

  /**
   * Process a single recurring charge
   */
  private async processSingleCharge(donation: any) {
    logger.info(`Processing recurring donation ${donation.id} for merchant ${donation.merchant.id}`);

    // Calculate Fees (assume CARD logic for now, or detect from paymentMethodId)
    const method: 'CARD' | 'ACH' = donation.paymentMethodId.toLowerCase().includes('card') ? 'CARD' : 'ACH';
    const feeDetails = FeeUtility.calculate(donation.amount, method);

    // 1. Call Finix
    const finixPayment = await finixPaymentsService.createPayment({
      amount: donation.amount,
      donorEmail: donation.donor.email,
      source: donation.paymentMethodId
    });

    // 2. Create Payment Record
    await prisma.payment.create({
      data: {
        amount: donation.amount,
        fee: feeDetails.fee,
        net: feeDetails.net,
        method: method,
        isRecurring: true,
        fund: 'General',
        status: finixPayment.status.toLowerCase(),
        merchantId: donation.merchantId,
        donorId: donation.donorId,
        finixPaymentId: finixPayment.id,
      }
    });

    // 3. Update Recurring Donation with next billing date
    const nextDate = new Date(donation.nextBillingDate || new Date());
    if (donation.interval === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setDate(nextDate.getDate() + 1); // fallback
    }

    await prisma.recurringDonation.update({
      where: { id: donation.id },
      data: {
        nextBillingDate: nextDate
      }
    });

    logger.info(`Successfully processed and advanced donation ${donation.id} to ${nextDate.toDateString()}`);
  }
}

export const recurringService = new RecurringService();
