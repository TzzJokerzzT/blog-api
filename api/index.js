/**
 * Vercel serverless entrypoint.
 *
 * Vercel invokes this module as the function handler. The `require` below is
 * intentionally a static string literal: Vercel's file tracing (nft) only
 * follows static requires. A computed path (`path.join(__dirname, ...)`) is not
 * traced, so `dist/` would be missing from the deployed bundle and every
 * request would fail with 500 and no CORS header.
 *
 * The compiled app is produced by `npm run build` (vercel.json buildCommand)
 * and never calls `listen()`: the platform owns the HTTP server.
 */
'use strict';

let app;

try {
  const loaded = require('../dist/app.js');
  app = loaded.default || loaded;
} catch (error) {
  // Last-resort diagnostic. It must still answer with CORS headers, otherwise
  // the browser shows a misleading CORS error instead of this message.
  const details = error instanceof Error ? `${error.name}: ${error.message}` : String(error);

  console.error(
    '[api] Could not load ../dist/app.js. The build step must produce dist/ before ' +
      'the function is bundled.',
    error
  );

  app = (req, res) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        success: false,
        message: 'Server bundle missing (dist/app.js).',
        details,
      })
    );
  };
}

module.exports = app;
