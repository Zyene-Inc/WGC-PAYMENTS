import { Router } from 'express';
import { 
  getRecurring, 
  getPayouts, 
  getSettings,
  getSummary,
  getDonations,
  getDonors,
  createDonor,
  updateDonor,
  deleteDonor,
  createDonation,
  getCampaignsList,
  createCampaign
} from '../controllers/church.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All church routes require church_admin role
router.use(authenticate, authorize(['church_admin']));

router.get('/summary', getSummary);
router.get('/donations', getDonations);
router.post('/donations', createDonation);

router.get('/donors', getDonors);
router.post('/donors', createDonor);
router.put('/donors/:id', updateDonor);
router.delete('/donors/:id', deleteDonor);

router.get('/recurring', getRecurring);
router.get('/payouts', getPayouts);
router.get('/settings', getSettings);

router.get('/campaigns', getCampaignsList);
router.post('/campaigns', createCampaign);

export default router;
