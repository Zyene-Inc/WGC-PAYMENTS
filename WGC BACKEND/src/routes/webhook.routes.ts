import { Router } from 'express';
import { handleFinixWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/finix', handleFinixWebhook);
router.post('/gateway', handleFinixWebhook);

export default router;
