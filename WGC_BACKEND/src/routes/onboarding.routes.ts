import { Router } from 'express';
import { createMerchant, getMerchantStatus } from '../controllers/onboarding.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/merchant', authenticate, authorize(['partner_admin']), createMerchant);
router.get('/status/:merchantId', authenticate, getMerchantStatus);

export default router;
