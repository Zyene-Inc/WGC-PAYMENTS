import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { NotFoundError, UnauthorizedError } from '../utils/http-error';

export class DonorController {
  /**
   * List donors for a partner (scoped)
   */
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partner = req.partner;
      
      // Step 10: Check permissions
      if (partner?.config && !partner.config.showDonorList) {
        throw new UnauthorizedError('Access to donor list is disabled for this partner');
      }

      const donors = await prisma.donor.findMany({
        where: {
          merchant: {
            partnerId: partner?.id
          }
        },
        include: {
          merchant: {
            select: { name: true }
          }
        }
      });

      res.json(donors);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get donor details (scoped)
   */
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = req.partner;

      const donor = await prisma.donor.findFirst({
        where: {
          id,
          merchant: {
            partnerId: partner?.id
          }
        },
        include: {
          merchant: true,
          payments: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!donor) throw new NotFoundError('Donor not found');

      res.json(donor);
    } catch (error) {
      next(error);
    }
  }
}

export const donorController = new DonorController();
