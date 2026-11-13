import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { connectDB, isDatabaseConnected } from './config/db';
import { env } from './config/env';
import { corsOrigin } from './config/cors';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './interfaces/auth/auth.routes';
import postRoutes from './interfaces/posts/post.routes';

const app = express();

// Behind Vercel (and any reverse proxy) the client IP arrives in
// X-Forwarded-For. Without this, express-rate-limit buckets every client under
// the proxy address and rejects traffic globally.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ── HTTP Security ─────────────────────────────────────────────────────────────
app.use(helmet());

// CORS is mounted before anything that can fail, so error responses still carry
// Access-Control-Allow-Origin and the browser reports the real failure instead
// of a misleading CORS error.
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes. Intenta mas tarde.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos. Intenta mas tarde.' },
});

app.use(limiter);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Database ──────────────────────────────────────────────────────────────────
// Connect lazily per request so the app can be imported by a serverless
// function (no top-level listen/connect) and reused across warm invocations.
const ensureDatabase = async (_req: Request, _res: Response, next: NextFunction) => {
  if (isDatabaseConnected()) {
    next();
    return;
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

// ── Routes ────────────────────────────────────────────────────────────────────
// The auth limiter stays ahead of the database so brute-force protection is not
// skipped when the database is unavailable, matching the original order.
app.use('/api/auth', authLimiter, ensureDatabase, authRoutes);
app.use('/api/posts', ensureDatabase, postRoutes);

// Health check stays independent from the database so platform liveness probes
// do not depend on Mongo availability.
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ── Error Handler (must be last) ──────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
