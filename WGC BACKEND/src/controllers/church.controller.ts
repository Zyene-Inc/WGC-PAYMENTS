import { Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BadRequestError, NotFoundError } from '../utils/http-error';

/**
 * Helper to get merchantId from authenticated request
 */
const getMerchantId = (req: AuthenticatedRequest) => {
  if (!req.user?.merchantId) {
    throw new BadRequestError('User is not linked to a church account');
  }
  return req.user.merchantId;
};

// ──── Church Summary ────
export const getSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);

    const [merchant, payments, donorsCount, recurringCount, payouts] = await Promise.all([
      prisma.merchant.findUnique({ where: { id: merchantId } }),
      prisma.payment.findMany({ where: { merchantId, status: 'success' } }),
      prisma.donor.count({ where: { merchantId } }),
      prisma.recurringDonation.count({ where: { merchantId, status: 'active' } }),
      prisma.payout.findMany({ where: { merchantId, status: 'pending' } })
    ]);

    if (!merchant) throw new NotFoundError('Church profile not found');

    const totalVolume = payments.reduce((sum, p) => sum + p.amount, 0);
    const cardVolume = payments.filter(p => p.method === 'CARD').reduce((sum, p) => sum + p.amount, 0);
    const achVolume = payments.filter(p => p.method === 'ACH').reduce((sum, p) => sum + p.amount, 0);
    const pendingPayoutBalance = payouts.reduce((sum, p) => sum + p.amount, 0);

    res.json({
      church: {
        name: merchant.name,
        status: merchant.status,
        onboardingStatus: merchant.onboardingStatus
      },
      stats: {
        totalVolume,
        cardVolume,
        achVolume,
        donorsCount,
        recurringCount,
        pendingPayoutBalance
      },
      alerts: [
        merchant.onboardingStatus !== 'complete' ? { type: 'onboarding', message: 'Action required: Complete your onboarding' } : null,
        // Mocking some alerts for the demo
        { type: 'payment', message: '1 recent payment failed' }
      ].filter(Boolean)
    });
  } catch (error) {
    next(error);
  }
};

// ──── Donations List ────
export const getDonations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { status, method, donorSearch } = req.query;

    const donations = await prisma.payment.findMany({
      where: {
        merchantId,
        ...(status ? { status: String(status) } : {}),
        ...(method ? { method: String(method) } : {}),
        ...(donorSearch ? {
          donor: {
            OR: [
              { name: { contains: String(donorSearch) } },
              { email: { contains: String(donorSearch) } }
            ]
          }
        } : {})
      },
      include: { donor: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(donations);
  } catch (error) {
    next(error);
  }
};

// ──── Donors List ────
export const getDonors = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);

    const donors = await prisma.donor.findMany({
      where: { merchantId },
      include: {
        _count: { select: { payments: true } },
        payments: { where: { status: 'success' }, select: { amount: true } }
      }
    });

    const transformed = donors.map(d => ({
      id: d.id,
      name: d.name,
      email: d.email,
      totalGiving: d.payments.reduce((sum, p) => sum + p.amount, 0),
      donationCount: d._count.payments,
      createdAt: d.createdAt
    }));

    res.json(transformed);
  } catch (error) {
    next(error);
  }
};

// ──── Recurring Gifts ────
export const getRecurring = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);

    const recurring = await prisma.recurringDonation.findMany({
      where: { merchantId },
      include: { donor: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(recurring);
  } catch (error) {
    next(error);
  }
};

// ──── Payouts ────
export const getPayouts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);

    const payouts = await prisma.payout.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payouts);
  } catch (error) {
    next(error);
  }
};

// ──── Settings ────
export const getSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { partner: { include: { config: true } } }
    });

    if (!merchant) throw new NotFoundError('Church not found');

    res.json({
      merchant,
      config: merchant.partner.config
    });
  } catch (error) {
    next(error);
  }
};

// ──── Donor CRUD (NEW) ────
export const createDonor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { name, email } = req.body;

    if (!name || !email) throw new BadRequestError('Name and email are required');

    const donor = await prisma.donor.create({
      data: { name, email, merchantId }
    });

    res.status(201).json(donor);
  } catch (error) {
    next(error);
  }
};

export const updateDonor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { id } = req.params;
    const { name, email } = req.body;

    const donor = await prisma.donor.update({
      where: { id, merchantId },
      data: { name, email }
    });

    res.json(donor);
  } catch (error) {
    next(error);
  }
};

export const deleteDonor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { id } = req.params;

    await prisma.donor.delete({
      where: { id, merchantId }
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// ──── Donation Create (NEW) ────
export const createDonation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { donorId, amount, fund, method, campaignId } = req.body;

    if (!donorId || !amount) throw new BadRequestError('Donor and amount are required');

    const donation = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        fund: fund || 'General',
        method: method || 'CASH',
        status: 'success',
        merchantId,
        donorId,
        campaignId
      }
    });

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
};

// ──── Campaign CRUD (NEW) ────
export const getCampaignsList = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const campaigns = await prisma.campaign.findMany({
      where: { merchantId },
      include: { _count: { select: { payments: true } } }
    });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = getMerchantId(req);
    const { name, description, goalAmount } = req.body;

    const campaign = await prisma.campaign.create({
      data: { name, description, goalAmount: goalAmount ? parseFloat(goalAmount) : null, merchantId }
    });

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
};
