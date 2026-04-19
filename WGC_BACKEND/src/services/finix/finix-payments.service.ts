import { FinixClientService } from './finix-client.service';
import logger from '../../utils/logger';

export class FinixPaymentsService extends FinixClientService {
  async createPayment(paymentData: { amount: number; donorEmail: string; source: string }) {
    try {
      logger.info(`Processing Finix transfer for: ${paymentData.donorEmail} using source: ${paymentData.source}`);

      // Convert amount to cents
      const amountInCents = Math.round(paymentData.amount * 100);

      const payload = {
        amount: amountInCents,
        currency: 'USD',
        source: paymentData.source,
        tags: {
          donor_email: paymentData.donorEmail
        }
      };

      const response = await this.getClient().post('/transfers', payload);
      
      logger.info(`Finix Transfer created: ${response.data.id}`);
      
      return {
        id: response.data.id,
        status: response.data.state || 'SUCCEEDED', // Map Finix 'state' to 'status'
        raw: response.data
      };
    } catch (error) {
      this.handleError(error, 'createPayment');
    }
  }

  async createRecurringDonation(donationData: { amount: number; donorEmail: string; interval: string }) {
    // ... logic same as before ...
  }

  async createCardInstrument(merchantIdentityId: string, cardData: { number: string; expMonth: number; expYear: number; cvv: string }) {
    try {
      logger.info(`Creating Finix Card Instrument for identity: ${merchantIdentityId}`);
      
      const payload = {
        identity: merchantIdentityId,
        type: 'CARD',
        card: {
          number: cardData.number,
          expiration_month: cardData.expMonth,
          expiration_year: cardData.expYear,
          cvv: cardData.cvv
        }
      };

      const response = await this.getClient().post('/payment_instruments', payload);
      logger.info(`Finix Card Instrument created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'createCardInstrument');
    }
  }

  async createAchInstrument(merchantIdentityId: string, achData: { accountNumber: string; routingNumber: string; name: string }) {
    try {
      logger.info(`Creating Finix ACH Instrument for identity: ${merchantIdentityId}`);
      
      const payload = {
        identity: merchantIdentityId,
        type: 'BANK_ACCOUNT',
        bank_account: {
          account_number: achData.accountNumber,
          routing_number: achData.routingNumber,
          name: achData.name,
          account_type: 'CHECKING'
        }
      };

      const response = await this.getClient().post('/payment_instruments', payload);
      logger.info(`Finix ACH Instrument created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'createAchInstrument');
    }
  }
}

export const finixPaymentsService = new FinixPaymentsService();
