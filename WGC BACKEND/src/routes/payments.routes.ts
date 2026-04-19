import { Router } from 'express';
import { donate, getPayment, charge } from '../controllers/payments.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

// Donations can be made via Partner API Key (external software)
router.post('/donate', validatePartnerApiKey, donate);
router.post('/charge', validatePartnerApiKey, charge);
router.get('/:id', getPayment);

export default router;
