import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // Server Configuration
    NODE_ENV: z
      .enum(['development', 'staging', 'production'])
      .default('development'),
    PORT: z.string().default('5000').transform(Number),
    CORS_ORIGIN: z.string().default('*'),

    // Database
    MONGODB_URI: z.string().url().min(1, 'MongoDB URI is required'),

    // JWT
    JWT_SECRET: z.string().min(1, 'JWT secret is required'),

    // Firebase Admin SDK (optional — for Firebase auth support)
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),

    // AWS S3 (Optional - for file uploads)
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default('us-east-1'),
    S3_BUCKET_NAME: z.string().optional(),

    // Logging
    LOG_LEVEL: z
      .enum(['debug', 'info', 'warn', 'error'])
      .optional()
      .transform((val) => {
        if (val) return val;
        return process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
      }),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: false,
});

export type Env = typeof env;
