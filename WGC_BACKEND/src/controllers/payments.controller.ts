import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { finixPaymentsService } from '../services/finix/finix-payments.service';
import { BadRequestError, NotFoundError } from '../utils/http-error';
import logger from '../utils/logger';

const paymentSchema = z.object({
  amount: z.number().positive(),
  merchantId: z.string().uuid(),
  donorName: z.string(),
  donorEmail: z.string().email(),
  coverFee: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  fund: z.string().optional(),
});

const chargeSchema = z.object({
  amount: z.number().positive(),
  merchantId: z.string().uuid(),
  paymentMethodId: z.string(),
  donorName: z.string(),
  donorEmail: z.string().email(),
  coverFee: z.boolean().default(false),
  fund: z.string().optional(),
});

import { FeeUtility } from '../utils/fee.utils';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * Partner API: Process a one-time charge
 */
export const charge = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = chargeSchema.parse(req.body);
    const partner = req.partner;

    // Verify merchant and ownership
    const merchant = await prisma.merchant.findFirst({
      where: { id: data.merchantId, partnerId: partner?.id }
    });

    if (!merchant) {
      throw new NotFoundError('Merchant not found or access denied');
    }

    // Determine method (hacky way for now, usually you'd check instrument type from Finix)
    // For this implementation, we assume paymentMethodId starting with 'PI' is for Card (just an example pattern)
    const method: 'CARD' | 'ACH' = data.paymentMethodId.toLowerCase().includes('card') ? 'CARD' : 'ACH';

    // Calculate Fees
    const feeDetails = FeeUtility.calculate(data.amount, method);

    // Ensure donor exists
    let donor = await prisma.donor.findUnique({
      where: { email_merchantId: { email: data.donorEmail, merchantId: data.merchantId } }
    });

    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          name: data.donorName,
          email: data.donorEmail,
          merchantId: data.merchantId,
        },
      });
    }

    // Call Finix
    const finixPayment = await finixPaymentsService.createPayment({
      amount: data.amount,
      donorEmail: data.donorEmail,
      source: data.paymentMethodId
    });

    // Store payment in DB
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        fee: feeDetails.fee,
        net: feeDetails.net,
        method: method,
        coverFees: data.coverFee,
        fund: data.fund || 'General',
        merchantId: data.merchantId,
        donorId: donor.id,
        status: finixPayment.status.toLowerCase(),
        finixPaymentId: finixPayment.id,
      },
    });

    res.status(201).json({
      paymentId: payment.id,
      status: payment.status,
      gross: payment.amount,
      fee: payment.fee,
      net: payment.net,
      gatewayId: payment.finixPaymentId
    });
  } catch (error) {
    next(error);
  }
};

export const donate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = paymentSchema.parse(req.body);

    const merchant = await prisma.merchant.findUnique({ where: { id: data.merchantId } });
    if (!merchant) {
      throw new BadRequestError('Merchant not found');
    }

    // Ensure donor exists
    let donor = await prisma.donor.findUnique({
      where: { email_merchantId: { email: data.donorEmail, merchantId: data.merchantId } }
    });

    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          name: data.donorName,
          email: data.donorEmail,
          merchantId: data.merchantId,
        },
      });
    }

    // Call Finix
    const finixPayment = await finixPaymentsService.createPayment({
      amount: data.amount,
      donorEmail: data.donorEmail,
      source: 'MOCK_SOURCE_ID', // Rebuilding requires valid source, using placeholder till session logic
    });

    // Store payment in DB
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        merchantId: data.merchantId,
        donorId: donor.id,
        status: finixPayment.status === 'SUCCEEDED' ? 'success' : 'pending',
        finixPaymentId: finixPayment.id,
      },
    });

    // Abstract vendor name
    const { finixPaymentId, ...rest } = payment;
    res.status(201).json({ ...rest, gatewayId: finixPaymentId });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { donor: true, merchant: true },
    });

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    // Abstract vendor name
    const { finixPaymentId, ...rest } = payment;
    res.json({ ...rest, gatewayId: finixPaymentId });
  } catch (error) {
    next(error);
  }
};

// Compatibility for previous structure if needed
export const processDonation = donate;
