import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalVolume = await prisma.payment.aggregate({
      where: { status: 'success' },
      _sum: { amount: true },
    });

    const cardVolume = await prisma.payment.aggregate({
      where: { status: 'success', method: 'CARD' },
      _sum: { amount: true },
    });

    const achVolume = await prisma.payment.aggregate({
      where: { status: 'success', method: 'ACH' },
      _sum: { amount: true },
    });

    const totalDonors = await prisma.donor.count();
    const totalMerchants = await prisma.merchant.count();
    const activeRecurring = await prisma.recurringDonation.count({
      where: { status: 'active' }
    });

    const merchantsPendingOnboarding = await prisma.merchant.count({
      where: { onboardingStatus: 'pending' }
    });

    const pendingPayoutsTotal = await prisma.payout.aggregate({
      where: { status: 'pending' },
      _sum: { amount: true },
    });

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { donor: true, merchant: true },
    });

    const actionItems = [];
    
    // Failed payments in last 24h
    const failedPayments = await prisma.payment.count({
      where: { status: 'failed', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });
    if (failedPayments > 0) {
      actionItems.push({ type: 'failed_payments', count: failedPayments, severity: 'high', label: 'Failed Payments (24h)' });
    }

    // Pending onboarding
    if (merchantsPendingOnboarding > 0) {
      actionItems.push({ type: 'onboarding_needed', count: merchantsPendingOnboarding, severity: 'medium', label: 'Merchants Pending Onboarding' });
    }

    res.json({
      totalVolume: totalVolume._sum.amount || 0,
      cardVolume: cardVolume._sum.amount || 0,
      achVolume: achVolume._sum.amount || 0,
      totalDonors,
      totalMerchants,
      activeRecurring,
      merchantsPendingOnboarding,
      pendingPayoutsTotal: pendingPayoutsTotal._sum.amount || 0,
      recentPayments,
      actionItems
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, type, isRecurring } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (type) where.method = type;
    if (isRecurring !== undefined) where.isRecurring = isRecurring === 'true';

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { donor: true, merchant: true },
    });
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const getMerchants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchants = await prisma.merchant.findMany({
      include: { partner: true, _count: { select: { donors: true, payments: true } } },
    });
    
    // Abstract the vendor name from the response
    const sanitizedMerchants = merchants.map(m => {
      const { finixMerchantId, ...rest } = m;
      return { ...rest, gatewayId: finixMerchantId };
    });

    res.json(sanitizedMerchants);
  } catch (error) {
    next(error);
  }
};

export const getMerchantDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: { 
        partner: true, 
        _count: { select: { donors: true, payments: true, recurring: true } },
        payments: { take: 10, orderBy: { createdAt: 'desc' }, include: { donor: true } },
        recurring: { include: { donor: true } },
        payouts: { take: 10, orderBy: { createdAt: 'desc' } }
      },
    });
    
    if (!merchant) {
      res.status(404).json({ message: 'Merchant not found' });
      return;
    }

    // Aggregate totals for the merchant
    const merchantVolume = await prisma.payment.aggregate({
      where: { merchantId: id, status: 'success' },
      _sum: { amount: true }
    });

    // Abstract the vendor name from the response
    const { finixMerchantId, ...rest } = merchant;
    
    res.json({
      ...rest,
      gatewayId: finixMerchantId,
      totalVolume: merchantVolume._sum.amount || 0
    });
  } catch (error) {
    next(error);
  }
};

export const getRecurringDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recurring = await prisma.recurringDonation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { donor: true, merchant: true },
    });
    res.json(recurring);
  } catch (error) {
    next(error);
  }
};

export const getPayouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payouts = await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
      include: { merchant: true },
    });
    res.json(payouts);
  } catch (error) {
    next(error);
  }
};

// ──── Merchant CRUD (NEW) ────
export const createMerchant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, slug, partnerId } = req.body;

    if (!name || !email || !partnerId) {
      throw new Error('Name, email, and partnerId are required');
    }

    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        partnerId,
        status: 'pending',
        onboardingStatus: 'pending'
      }
    });

    res.status(201).json(merchant);
  } catch (error) {
    next(error);
  }
};

export const updateMerchantStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const merchant = await prisma.merchant.update({
      where: { id },
      data: { onboardingStatus: status }
    });

    res.json(merchant);
  } catch (error) {
    next(error);
  }
};
