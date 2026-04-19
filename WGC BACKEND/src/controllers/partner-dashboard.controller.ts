import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { UnauthorizedError } from '../utils/http-error';

export class PartnerDashboardController {
  /**
   * Get dashboard summary for a partner (Scoped)
   */
  async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partner = req.partner;

      if (!partner) throw new UnauthorizedError('Unauthorized');

      // Scoped stats
      const totalVolume = await prisma.payment.aggregate({
        where: { 
          status: 'success',
          merchant: { partnerId: partner.id }
        },
        _sum: { amount: true },
      });

      const totalDonors = await prisma.donor.count({
        where: { merchant: { partnerId: partner.id } }
      });

      const totalMerchants = await prisma.merchant.count({
        where: { partnerId: partner.id }
      });

      const activeRecurring = await prisma.recurringDonation.count({
        where: { 
          status: 'active',
          merchant: { partnerId: partner.id }
        }
      });

      const recentPayments = await prisma.payment.findMany({
        where: { merchant: { partnerId: partner.id } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { donor: true, merchant: { select: { name: true } } },
      });

      // Permission check: Fee Breakdown
      const response: any = {
        totalVolume: totalVolume._sum.amount || 0,
        totalDonors,
        totalMerchants,
        activeRecurring,
        recentPayments: recentPayments.map(p => ({
          ...p,
          fee: partner.config?.showFeeBreakdown ? p.fee : undefined,
          net: partner.config?.showFeeBreakdown ? p.net : undefined
        }))
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all payments for a partner (Scoped)
   */
  async getPayments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partner = req.partner;
      const { merchantId } = req.query;

      const where: any = {
        merchant: { partnerId: partner?.id }
      };

      if (merchantId) {
        where.merchantId = merchantId as string;
      }

      const payments = await prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { donor: true, merchant: { select: { name: true } } },
      });

      // Apply permissions
      const formatted = payments.map(p => ({
        ...p,
        fee: partner?.config?.showFeeBreakdown ? p.fee : undefined,
        net: partner?.config?.showFeeBreakdown ? p.net : undefined
      }));

      res.json(formatted);
    } catch (error) {
      next(error);
    }
  }
}

export const partnerDashboardController = new PartnerDashboardController();
