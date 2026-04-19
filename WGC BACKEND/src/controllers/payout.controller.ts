import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { UnauthorizedError } from '../utils/http-error';

export class PayoutController {
  /**
   * Get payouts for a partner (Scoped)
   */
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partner = req.partner;

      if (partner?.config && !partner.config.showPayouts) {
        throw new UnauthorizedError('Payout reporting is disabled for this partner');
      }

      const payouts = await prisma.payout.findMany({
        where: {
          merchant: { partnerId: partner?.id }
        },
        include: {
          merchant: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(payouts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payout summary (pending vs available)
   */
  async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partner = req.partner;

      const pending = await prisma.payout.aggregate({
        where: { 
          status: 'pending',
          merchant: { partnerId: partner?.id }
        },
        _sum: { amount: true }
      });

      const successful = await prisma.payout.aggregate({
        where: { 
          status: 'success', // or arrived/paid
          merchant: { partnerId: partner?.id }
        },
        _sum: { amount: true }
      });

      res.json({
        pendingBalance: pending._sum.amount || 0,
        availableBalance: successful._sum.amount || 0,
        currency: 'USD'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const payoutController = new PayoutController();
