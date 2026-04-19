import { Request, Response, NextFunction } from 'express';
import { partnerService } from '../services/partner.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class PartnerController {
  /**
   * Admin only: Create a new partner
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, webhookUrl } = req.body;
      const partner = await partnerService.createPartner(name, webhookUrl);
      res.status(201).json(partner);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Partner only: Get current partner details (protected by API Key)
   */
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // req.partner is attached by validatePartnerApiKey middleware
      res.json(req.partner);
    } catch (error) {
      next(error);
    }
  }
}

export const partnerController = new PartnerController();
