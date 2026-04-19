import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import prisma from '../prisma/client';
import { finixPaymentsService } from '../services/finix/finix-payments.service';
import { BadRequestError, NotFoundError } from '../utils/http-error';

export class PaymentMethodController {
  /**
   * Add a Card to a Merchant
   * POST /api/payment-method/card
   */
  async addCard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { merchantId, cardNumber, expMonth, expYear, cvv } = req.body;
      const partner = req.partner;

      const merchant = await prisma.merchant.findFirst({
        where: { id: merchantId, partnerId: partner?.id }
      });

      if (!merchant || !merchant.finixMerchantId) {
        throw new NotFoundError('Merchant not found or not onboarded properly');
      }

      const instrument = await finixPaymentsService.createCardInstrument(
        merchant.finixMerchantId,
        { number: cardNumber, expMonth, expYear, cvv }
      );

      res.status(201).json({
        paymentMethodId: instrument.id,
        type: 'CARD',
        last4: instrument.card.last4
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add ACH to a Merchant
   * POST /api/payment-method/ach
   */
  async addAch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { merchantId, accountNumber, routingNumber, name } = req.body;
      const partner = req.partner;

      const merchant = await prisma.merchant.findFirst({
        where: { id: merchantId, partnerId: partner?.id }
      });

      if (!merchant || !merchant.finixMerchantId) {
        throw new NotFoundError('Merchant not found or not onboarded properly');
      }

      const instrument = await finixPaymentsService.createAchInstrument(
        merchant.finixMerchantId,
        { accountNumber, routingNumber, name }
      );

      res.status(201).json({
        paymentMethodId: instrument.id,
        type: 'ACH',
        last4: instrument.bank_account.last4
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentMethodController = new PaymentMethodController();
