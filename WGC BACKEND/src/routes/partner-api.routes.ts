import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { merchantController } from '../controllers/merchant.controller';
import { paymentMethodController } from '../controllers/payment-method.controller';
import { charge } from '../controllers/payments.controller';
import { partnerDashboardController } from '../controllers/partner-dashboard.controller';
import { donorController } from '../controllers/donor.controller';
import { payoutController } from '../controllers/payout.controller';
import { 
  createRecurring, 
  pauseRecurring, 
  cancelRecurring, 
  getMerchantRecurring 
} from '../controllers/recurring.controller';
import { validatePartnerApiKey } from '../middleware/apiKey.middleware';

const router = Router();

// ALL ROUTES BELOW ARE PROTECTED BY API KEY
router.use(validatePartnerApiKey);

// Partner Identity
router.get('/me', partnerController.me);

// Merchant Onboarding
router.post('/merchants/create', merchantController.create);
router.get('/merchants/:id/status', merchantController.getStatus);

// Payment Instruments (Tokenization)
router.post('/payment-methods/card', paymentMethodController.addCard);
router.post('/payment-methods/ach', paymentMethodController.addAch);

// Payments (Charging)
router.post('/payments/charge', charge);

// Recurring (Subscriptions)
router.post('/recurring/create', createRecurring);
router.post('/recurring/:id/pause', pauseRecurring);
router.post('/recurring/:id/cancel', cancelRecurring);
router.get('/merchants/:merchantId/recurring', getMerchantRecurring);

// Reporting & Scoped Data
router.get('/dashboard/summary', partnerDashboardController.getSummary);
router.get('/payments', partnerDashboardController.getPayments);
router.get('/donors', donorController.list);
router.get('/donors/:id', donorController.get);
router.get('/payouts', payoutController.list);
router.get('/payouts/summary', payoutController.getSummary);

export default router;
