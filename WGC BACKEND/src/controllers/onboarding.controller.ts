import { Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { finixOnboardingService } from '../services/finix/finix-onboarding.service';
import { BadRequestError, NotFoundError } from '../utils/http-error';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const merchantSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  partnerId: z.string().uuid().optional(),
  businessType: z.enum(['NON_PROFIT', 'RELIGIOUS_ORGANIZATION']).default('RELIGIOUS_ORGANIZATION'),
});

export const createMerchant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = merchantSchema.parse(req.body);
    const partnerId = data.partnerId || req.user?.userId;

    if (!partnerId) {
      throw new BadRequestError('Partner ID is required');
    }

    // Ensure partner exists
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
      throw new BadRequestError('Partner not found');
    }

    // Call Finix
    const finixMerchant = await finixOnboardingService.createMerchant(data);

    // Store in DB
    const merchant = await prisma.merchant.create({
      data: {
        name: data.name,
        email: data.email,
        partnerId: partnerId,
        finixMerchantId: finixMerchant.id,
        status: 'approved',
      },
    });

    // Abstract vendor name
    const { finixMerchantId, ...rest } = merchant;
    res.status(201).json({ ...rest, gatewayId: finixMerchantId });
  } catch (error) {
    next(error);
  }
};

export const getMerchantStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.params;

    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant) {
      throw new NotFoundError('Merchant not found');
    }

    res.json({
      id: merchant.id,
      status: merchant.status,
      gatewayId: merchant.finixMerchantId,
    });
  } catch (error) {
    next(error);
  }
};

export const requestOnboarding = createMerchant;
