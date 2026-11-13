/**
 * Vercel serverless entrypoint.
 *
 * Vercel invokes this module as the function handler. It imports the compiled
 * Express app from `dist/` (produced by `npm run build`) and never calls
 * `listen()`: the platform owns the HTTP server for each invocation.
 *
 * Database connection is opened lazily by the app's `/api` middleware and
 * cached per warm process, so importing this module performs no I/O.
 */
'use strict';

const path = require('node:path');

const compiledAppPath = path.join(__dirname, '..', 'dist', 'app.js');

let app;
try {
  const appModule = require(compiledAppPath);
  app = appModule.default || appModule;
} catch (error) {
  // A missing build must surface as a readable error, not a blank 500.
  console.error(`[api] Could not load ${compiledAppPath}. Run "npm run build".`, error);
  module.exports = (_req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        message: 'Server bundle missing. The build step did not produce dist/app.js.',
      })
    );
  };
  return;
}

module.exports = app;
