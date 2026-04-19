import crypto from 'crypto';
import prisma from '../prisma/client';
import logger from '../utils/logger';
import { BadRequestError, NotFoundError } from '../utils/http-error';

export class PartnerService {
  /**
   * Create a new software partner and generate a secure API key
   */
  async createPartner(name: string, webhookUrl?: string) {
    logger.info(`Creating new partner: ${name}`);

    // Check if partner already exists
    const existing = await prisma.partner.findFirst({
      where: { name }
    });

    if (existing) {
      throw new BadRequestError('Partner with this name already exists');
    }

    // Generate a secure API key: wgc_live_...
    const apiKey = `wgc_live_${crypto.randomBytes(24).toString('hex')}`;

    const partner = await prisma.partner.create({
      data: {
        name,
        apiKey,
        config: {
          create: {
            showFeeBreakdown: true,
            showDonorList: true,
            showPayouts: true,
            showRecurring: true
          }
        }
      },
      include: {
        config: true
      }
    });

    return partner;
  }

  /**
   * Get partner details by ID
   */
  async getPartner(id: string) {
    const partner = await prisma.partner.findUnique({
      where: { id },
      include: { config: true }
    });

    if (!partner) {
      throw new NotFoundError('Partner not found');
    }

    return partner;
  }
}

export const partnerService = new PartnerService();
