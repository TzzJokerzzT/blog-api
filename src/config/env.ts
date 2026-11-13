import { config } from 'dotenv';
config();

const parseOrigins = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  ALLOWED_ORIGINS: parseOrigins(process.env.ALLOWED_ORIGINS),
} as const;

// Fail loudly at startup instead of silently rejecting every browser request.
if (env.ALLOWED_ORIGINS.length === 0) {
  console.warn(
    '[config] ALLOWED_ORIGINS is empty. No cross-origin request will receive ' +
      'an Access-Control-Allow-Origin header. Set it to a comma-separated list ' +
      'of trusted origins.'
  );
}
