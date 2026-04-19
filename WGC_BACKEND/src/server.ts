import app from './app';
import { env } from './config/env';
import logger from './utils/logger';
import { initScheduler } from './scheduler';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  initScheduler();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
