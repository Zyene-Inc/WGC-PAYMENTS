import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  FINIX_BASE_URL: z.string().url(),
  FINIX_USERNAME: z.string(),
  FINIX_PASSWORD: z.string(),
  FINIX_VERSION: z.string().default('2022-02-01'),
  
  FRONTEND_URL: z.string().url().default('http://localhost:4200'),
  WEBHOOK_SECRET: z.string().optional(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
