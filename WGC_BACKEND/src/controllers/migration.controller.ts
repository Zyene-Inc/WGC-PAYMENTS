import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { migrationService } from '../services/migration.service';
import { BadRequestError } from '../utils/http-error';

const importSchema = z.object({
  merchantId: z.string().uuid(),
  donors: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
  })),
});

export const importDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId, donors } = importSchema.parse(req.body);
    const records = await migrationService.importDonors(merchantId, donors);
    res.status(201).json(records);
  } catch (error) {
    next(error);
  }
};

export const sendLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.body;
    if (!merchantId) throw new BadRequestError('Merchant ID is required');
    const result = await migrationService.sendMigrationLinks(merchantId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId } = req.params;
    const status = await migrationService.getMigrationStatus(merchantId);
    res.json(status);
  } catch (error) {
    next(error);
  }
};

export const resendLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { merchantId, email } = req.body;
    const result = await migrationService.resendMigrationLink(merchantId, email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
