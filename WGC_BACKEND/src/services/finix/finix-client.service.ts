import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '../../config/env';
import logger from '../../utils/logger';
import { InternalServerError } from '../../utils/http-error';

export class FinixClientService {
  private client: AxiosInstance;

  constructor() {
    const auth = Buffer.from(`${env.FINIX_USERNAME}:${env.FINIX_PASSWORD}`).toString('base64');
    
    this.client = axios.create({
      baseURL: env.FINIX_BASE_URL,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Finix-Version': env.FINIX_VERSION,
        'Content-Type': 'application/json',
      },
    });
  }

  protected getClient(): AxiosInstance {
    return this.client;
  }

  protected handleError(error: any, context: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data;

      logger.error(`Finix API Error [${context}]:`, {
        status,
        data,
        message: axiosError.message
      });

      // Map to internal errors or throw a generic one with Finix details
      throw new InternalServerError(`Finix API Error: ${data?.message || axiosError.message}`);
    }

    logger.error(`Unexpected Error [${context}]:`, error);
    throw error;
  }
}
