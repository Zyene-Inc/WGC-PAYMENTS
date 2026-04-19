import cron from 'node-cron';
import { recurringService } from './services/recurring.service';
import logger from './utils/logger';

/**
 * Initialize all scheduled background tasks
 */
export const initScheduler = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    logger.info('CRON: Triggering daily recurring donation processing...');
    try {
      await recurringService.processDailyCharges();
      logger.info('CRON: Successfully completed daily processing.');
    } catch (error) {
      logger.error('CRON: Error during daily processing:', error);
    }
  });

  logger.info('Scheduler initialized: Daily Recurring processing at 00:00');
};
