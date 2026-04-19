import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error';
import logger from '../utils/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof HttpError 
    ? err.statusCode 
    : err instanceof ZodError 
      ? 400 
      : 500;

  const message = err.message || 'Internal Server Error';

  logger.error(`${req.method} ${req.url} - ${statusCode} - ${message}`, { 
    stack: err.stack,
    details: err.details,
    requestId: req.headers['x-request-id']
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { 
      stack: err.stack, 
      details: err instanceof HttpError ? err.details : undefined 
    })
  });
};
