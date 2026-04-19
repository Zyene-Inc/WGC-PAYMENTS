import { Router } from 'express';
import { 
  getSummary, 
  getPayments, 
  getMerchants, 
  getMerchantDetail, 
  getRecurringDonations, 
  getPayouts,
  createMerchant,
  updateMerchantStatus
} from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Only partner admins can see the full dashboard
router.get('/summary', authenticate, authorize(['partner_admin']), getSummary);
router.get('/payments', authenticate, authorize(['partner_admin']), getPayments);
router.get('/merchants', authenticate, authorize(['partner_admin']), getMerchants);
router.post('/merchants', authenticate, authorize(['partner_admin']), createMerchant);
router.get('/merchants/:id', authenticate, authorize(['partner_admin']), getMerchantDetail);
router.patch('/merchants/:id/status', authenticate, authorize(['partner_admin']), updateMerchantStatus);

router.get('/recurring', authenticate, authorize(['partner_admin']), getRecurringDonations);
router.get('/payouts', authenticate, authorize(['partner_admin']), getPayouts);

export default router;
