import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma/client';
import { env } from '../config/env';
import { BadRequestError, UnauthorizedError } from '../utils/http-error';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['wgc_admin', 'partner_admin', 'church_admin']),
  merchantId: z.string().uuid().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, role, merchantId } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        merchantId,
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role, merchantId: user.merchantId },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role, merchantId: user.merchantId },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, merchantId: user.merchantId },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: 'Logged in successfully',
      token,
      user: { id: user.id, email: user.email, role: user.role, merchantId: user.merchantId },
    });
  } catch (error) {
    next(error);
  }
};
