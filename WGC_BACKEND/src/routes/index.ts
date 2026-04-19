import { Router } from 'express';
import authRoutes from './auth.routes';
import onboardingRoutes from './onboarding.routes';
import paymentsRoutes from './payments.routes';
import recurringRoutes from './recurring.routes';
import dashboardRoutes from './dashboard.routes';
import migrationRoutes from './migration.routes';
import migrationCenterRoutes from './migration-center.routes';
import churchRoutes from './church.routes';
import checkoutRoutes from './checkout.routes';
import webhookRoutes from './webhook.routes';
import contactRoutes from './contact.routes';
import partnerApiRoutes from './partner-api.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/payments', paymentsRoutes);
router.use('/recurring', recurringRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/migration', migrationRoutes);
router.use('/migration-center', migrationCenterRoutes);
router.use('/church', churchRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/contact', contactRoutes);
router.use('/api', partnerApiRoutes);

export default router;
