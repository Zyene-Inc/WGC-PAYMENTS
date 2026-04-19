import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError, ForbiddenError } from '../utils/http-error';

export interface TokenPayload {
  userId: string;
  role: 'wgc_admin' | 'partner_admin' | 'church_admin';
  merchantId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  partner?: any;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Unauthorized - No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError('Unauthorized - Invalid or expired token'));
    }
    next(error);
  }
};

export const authorize = (roles: Array<'wgc_admin' | 'partner_admin' | 'church_admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !roles.includes(user.role)) {
        throw new ForbiddenError('Forbidden - Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
