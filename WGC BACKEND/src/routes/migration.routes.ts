import { Router } from 'express';
import { importDonors, sendLinks, getStatus, resendLink } from '../controllers/migration.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/import', authenticate, authorize(['partner_admin', 'church_admin']), importDonors);
router.post('/send', authenticate, authorize(['partner_admin', 'church_admin']), sendLinks);
router.get('/status/:merchantId', authenticate, authorize(['partner_admin', 'church_admin']), getStatus);
router.post('/resend', authenticate, authorize(['partner_admin', 'church_admin']), resendLink);

export default router;
