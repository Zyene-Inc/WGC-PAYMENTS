import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service';
import logger from '../utils/logger';

export const handleFinixWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    
    // In production, verify the signature here using WEBHOOK_SECRET
    logger.info('Received Finix Webhook');

    // We don't await here to return 200 quickly to Finix
    webhookService.processFinixEvent(payload).catch(err => {
      logger.error('Error processing background webhook:', err);
    });

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
