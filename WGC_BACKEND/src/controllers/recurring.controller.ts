import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { finixPaymentsService } from '../services/finix/finix-payments.service';
import { BadRequestError, NotFoundError } from '../utils/http-error';

const recurringSchema = z.object({
  amount: z.number().positive(),
  interval: z.enum(['monthly']).default('monthly'),
  donorId: z.string().uuid(),
  merchantId: z.string().uuid(),
  paymentMethodId: z.string(),
});

import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Partner API: Create a recurring donation subscription
 */
export const createRecurring = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = recurringSchema.parse(req.body);
    const partner = req.partner;

    // Verify merchant and ownership
    const merchant = await prisma.merchant.findFirst({
      where: { id: data.merchantId, partnerId: partner?.id }
    });

    if (!merchant) {
      throw new NotFoundError('Merchant not found or access denied');
    }

    const donor = await prisma.donor.findUnique({ where: { id: data.donorId } });
    if (!donor) throw new BadRequestError('Donor not found');

    // Calculate next billing date (30 days from today)
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);

    const recurring = await prisma.recurringDonation.create({
      data: {
        amount: data.amount,
        interval: data.interval,
        donorId: data.donorId,
        merchantId: data.merchantId,
        paymentMethodId: data.paymentMethodId,
        nextBillingDate: nextDate,
        status: 'active',
      },
    });

    res.status(201).json(recurring);
  } catch (error) {
    next(error);
  }
};

export const pauseRecurring = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const partner = req.partner;

    const recurring = await prisma.recurringDonation.findFirst({
      where: { 
        id, 
        merchant: { partnerId: partner?.id } 
      }
    });

    if (!recurring) throw new NotFoundError('Recurring donation not found');

    const updated = await prisma.recurringDonation.update({
      where: { id },
      data: { status: 'paused' },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const cancelRecurring = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const partner = req.partner;

    const recurring = await prisma.recurringDonation.findFirst({
      where: { 
        id, 
        merchant: { partnerId: partner?.id } 
      }
    });

    if (!recurring) throw new NotFoundError('Recurring donation not found');

    const updated = await prisma.recurringDonation.update({
      where: { id },
      data: { status: 'cancelled' },
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const getMerchantRecurring = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.params;
    const partner = req.partner;

    const recurring = await prisma.recurringDonation.findMany({
      where: { 
        merchantId,
        merchant: { partnerId: partner?.id }
      },
      include: { donor: true },
    });
    res.json(recurring);
  } catch (error) {
    next(error);
  }
};
