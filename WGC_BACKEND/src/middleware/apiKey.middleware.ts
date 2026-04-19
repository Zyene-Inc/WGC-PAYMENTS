import { Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { UnauthorizedError } from '../utils/http-error';
import { AuthenticatedRequest } from './auth.middleware';

export const validatePartnerApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedError('Unauthorized - API Key missing');
    }

    const partner = await prisma.partner.findUnique({
      where: { apiKey },
    });

    if (!partner) {
      throw new UnauthorizedError('Unauthorized - Invalid API Key');
    }

    // Attach partner info to request for downstream use
    req.partner = partner;
    next();
  } catch (error) {
    next(error);
  }
};
