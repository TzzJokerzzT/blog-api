import { config } from 'dotenv';
config();

export const env = {
  PORT: process.env.PORT || '3000',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '').split(','),
} as const;
