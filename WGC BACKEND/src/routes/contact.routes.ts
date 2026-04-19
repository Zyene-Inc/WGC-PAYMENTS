import { Router } from 'express';
import { submitInquiry } from '../controllers/contact.controller';

const router = Router();

router.post('/', submitInquiry);

export default router;
