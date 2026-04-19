import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { finixOnboardingService } from '../services/finix/finix-onboarding.service';
import { BadRequestError, NotFoundError } from '../utils/http-error';
import logger from '../utils/logger';

export class MerchantController {
  /**
   * Create a new merchant/church (Partner API)
   * POST /api/merchant/create
   */
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.body;
      const partner = req.partner; // Attached by validatePartnerApiKey

      if (!partner) {
        throw new BadRequestError('Partner context missing');
      }

      logger.info(`Partner ${partner.id} is onboarding merchant: ${name}`);

      // 1. Create Finix Identity
      const finixIdentity = await finixOnboardingService.createMerchant({ name, email });

      // 2. Store in local DB
      const merchant = await prisma.merchant.create({
        data: {
          name,
          email,
          partnerId: partner.id,
          finixMerchantId: finixIdentity.id, // Storing identity ID in merchant ID field for now
          status: 'onboarding',
          onboardingStatus: 'identity_created',
          slug: name.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000)
        }
      });

      res.status(201).json({
        merchantId: merchant.id,
        gatewayId: finixIdentity.id,
        status: merchant.status
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get merchant onboarding status
   * GET /api/merchant/status/:id
   */
  async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const partner = req.partner;

      const merchant = await prisma.merchant.findFirst({
        where: { 
          id,
          partnerId: partner?.id
        }
      });

      if (!merchant) {
        throw new NotFoundError('Merchant not found or not owned by partner');
      }

      // Sync status with Finix if Identity was created
      let finixStatus = null;
      if (merchant.finixMerchantId) {
        finixStatus = await finixOnboardingService.getMerchantStatus(merchant.finixMerchantId);
      }

      res.json({
        merchantId: merchant.id,
        internalStatus: merchant.status,
        onboardingStatus: merchant.onboardingStatus,
        status: finixStatus
      });
    } catch (error) {
      next(error);
    }
  }
}

export const merchantController = new MerchantController();
