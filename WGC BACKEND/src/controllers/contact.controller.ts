import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import logger from '../utils/logger';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export const submitInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = contactSchema.parse(req.body);

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });

    logger.info(`New contact form inquiry from: ${data.email}`);
    // Here you would typically send an email

    res.status(201).json({
      message: 'Inquiry received successfully',
      id: inquiry.id,
    });
  } catch (error) {
    next(error);
  }
};
