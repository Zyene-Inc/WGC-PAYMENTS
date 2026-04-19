import { Router } from 'express';
import { paymentMethodController } from '../controllers/payment-method.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

// Partner API: Payment Instrument Management
router.post('/card', validatePartnerApiKey, paymentMethodController.addCard);
router.post('/ach', validatePartnerApiKey, paymentMethodController.addAch);

export default router;
