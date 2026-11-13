import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

/**
 * Long-lived process entrypoint (local development, Render, Railway, Fly).
 * Serverless platforms use `api/index.js` instead and never call this file.
 */
const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(Number(env.PORT), () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void start();
