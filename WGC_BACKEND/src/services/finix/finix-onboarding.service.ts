import { FinixClientService } from './finix-client.service';
import logger from '../../utils/logger';

export class FinixOnboardingService extends FinixClientService {
  async createMerchant(merchantData: { name: string; email: string }) {
    try {
      logger.info(`Creating Finix identity for: ${merchantData.name}`);

      // Basic name splitting logic
      const nameParts = merchantData.name.trim().split(' ');
      const firstName = nameParts[0] || 'N/A';
      const lastName = nameParts.slice(1).join(' ') || 'N/A';

      const payload = {
        entity: {
          first_name: firstName,
          last_name: lastName,
          email: merchantData.email,
        },
      };

      const response = await this.getClient().post('/identities', payload);
      
      logger.info(`Finix Identity created: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'createMerchant');
    }
  }

  async getMerchantStatus(finixMerchantId: string) {
    try {
      logger.info(`Fetching Finix status for identity: ${finixMerchantId}`);
      const response = await this.getClient().get(`/identities/${finixMerchantId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'getMerchantStatus');
    }
  }
}

export const finixOnboardingService = new FinixOnboardingService();
