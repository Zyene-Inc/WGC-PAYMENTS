import { Router } from 'express';
import { getCheckoutInfo, processCheckoutDonation } from '../controllers/checkout.controller';

const router = Router();

// Public routes for donor checkout
router.get('/:slug', getCheckoutInfo);
router.post('/:slug/donate', processCheckoutDonation);

export default router;
