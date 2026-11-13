import mongoose from 'mongoose';
import { env } from './env';

/**
 * Serverless runtimes reuse a warm process across invocations and run many
 * processes in parallel. Keep one connection promise per process and share it,
 * so concurrent invocations do not open a connection each.
 *
 * Never calls process.exit: a fatal exit inside a function invocation becomes
 * an opaque FUNCTION_INVOCATION_FAILED response with no CORS headers, and the
 * browser reports it as a CORS error instead of the real failure.
 */
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  const readyState = mongoose.connection.readyState;
  if (readyState === mongoose.ConnectionStates.connected) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      // Fail fast instead of hanging the invocation until the platform timeout.
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 5,
    })
    .catch((error: unknown) => {
      // Drop the cached promise so a later invocation can retry.
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

export const isDatabaseConnected = (): boolean =>
  mongoose.connection.readyState === mongoose.ConnectionStates.connected;
