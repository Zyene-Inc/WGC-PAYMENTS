import { Router } from 'express';
import { 
  createJob, 
  validateJob, 
  updateMapping,
  getJobPreview, 
  confirmImport, 
  listJobs, 
  getJobDetail,
  getMigrationSummary 
} from '../controllers/migration-center.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

const auth = [authenticate, authorize(['partner_admin'])];

router.get('/summary',       ...auth, getMigrationSummary);
router.get('/jobs',           ...auth, listJobs);
router.post('/jobs',          ...auth, createJob);
router.get('/jobs/:id',       ...auth, getJobDetail);
router.post('/jobs/:id/validate', ...auth, validateJob);
router.put('/jobs/:id/mapping',   ...auth, updateMapping);
router.get('/jobs/:id/preview',   ...auth, getJobPreview);
router.post('/jobs/:id/confirm',  ...auth, confirmImport);

export default router;
