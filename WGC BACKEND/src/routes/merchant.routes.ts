import { Router } from 'express';
import { merchantController } from '../controllers/merchant.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

// Partner API: Merchant Management
router.post('/create', validatePartnerApiKey, merchantController.create);
router.get('/status/:id', validatePartnerApiKey, merchantController.getStatus);

export default router;
