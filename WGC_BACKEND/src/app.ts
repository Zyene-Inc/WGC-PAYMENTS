import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { seedDemoData } from './utils/demo-seed';
import { errorMiddleware } from './middleware/error.middleware';
import { env } from './config/env';
import logger from './utils/logger';
import { v4 as uuidv4 } from 'uuid';
import prisma from './prisma/client';
import routes from './routes';

import { apiRateLimiter } from './middleware/rate-limit.middleware';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', apiRateLimiter);

// Request ID Middleware
app.use((req, res, next) => {
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Root route


// Error handling
app.use(errorMiddleware);

// Seed Demo Data
seedDemoData();

export default app;
