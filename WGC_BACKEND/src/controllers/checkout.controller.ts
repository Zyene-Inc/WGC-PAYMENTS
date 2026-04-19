import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { NotFoundError, BadRequestError } from '../utils/http-error';

// ──── Get Church Brand for Checkout ────
export const getCheckoutInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const church = await prisma.merchant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        onboardingStatus: true,
        cardEnabled: true,
        achEnabled: true,
        partner: {
          select: {
            name: true,
            config: true
          }
        }
      }
    });

    if (!church) throw new NotFoundError('Church not found');
    if (church.onboardingStatus !== 'complete') {
       throw new BadRequestError('This church is not currently accepting donations');
    }

    res.json(church);
  } catch (error) {
    next(error);
  }
};

// ──── Process Public Donation ────
export const processCheckoutDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const { amount, donorName, donorEmail, method, fund, isRecurring, coverFees } = req.body;

    const church = await prisma.merchant.findUnique({ where: { slug } });
    if (!church) throw new NotFoundError('Church not found');

    // 1. Create or find donor
    let donor = await prisma.donor.findUnique({
      where: { email_merchantId: { email: donorEmail, merchantId: church.id } }
    });

    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          email: donorEmail,
          name: donorName,
          merchantId: church.id
        }
      });
    }

    // 2. Calculate fees (mock logic for demo)
    const feePercent = method === 'ACH' ? 0.0075 : 0.023;
    const flatFee = method === 'ACH' ? 0 : 0.25;
    const processingFee = (amount * feePercent) + flatFee;

    // 3. Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        fee: processingFee,
        net: amount - processingFee,
        method: method || 'CARD',
        fund: fund || 'General',
        isRecurring: isRecurring || false,
        coverFees: coverFees || false,
        status: 'success', // Mocking immediate success
        merchantId: church.id,
        donorId: donor.id
      }
    });

    // 4. If recurring, create recurring plan
    if (isRecurring) {
      await prisma.recurringDonation.create({
        data: {
          amount,
          interval: 'monthly', // default
          donorId: donor.id,
          merchantId: church.id,
          status: 'active'
        }
      });
    }

    res.status(201).json({
      status: 'success',
      paymentId: payment.id,
      message: `Successfully gave $${amount} to ${church.name}`
    });
  } catch (error) {
    next(error);
  }
};
