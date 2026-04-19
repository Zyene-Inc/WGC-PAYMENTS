import { Router } from 'express';
import { createRecurring, pauseRecurring, cancelRecurring, getMerchantRecurring } from '../controllers/recurring.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

router.post('/create', validatePartnerApiKey, createRecurring);
router.post('/pause/:id', validatePartnerApiKey, pauseRecurring);
router.post('/cancel/:id', validatePartnerApiKey, cancelRecurring);
router.get('/:merchantId', validatePartnerApiKey, getMerchantRecurring);

export default router;
