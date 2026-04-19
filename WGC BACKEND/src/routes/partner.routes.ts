import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

// Endpoint for WGC Admin to create partners
router.post('/create', partnerController.create);

// Endpoint for Partner to see their own info using their API key
router.get('/me', validatePartnerApiKey, partnerController.me);

export default router;
