'use strict';

/**
 * Bundle `sanitize-html` (and its dependency tree) to a single CommonJS file.
 *
 * Why: sanitize-html 2.18.x depends on htmlparser2 12, which is ESM-only
 * (`"type": "module"`). Newer Node versions can `require()` an ES module, but
 * the Vercel function runtime cannot, so importing sanitize-html crashes the
 * whole app at load time with ERR_REQUIRE_ESM - before any CORS middleware runs.
 *
 * Downgrading sanitize-html is not an option: the htmlparser2 10.1 upgrade it
 * carries fixes a security hole (zero-padded numeric character references such
 * as `&#0000001` bypassing `javascript:` URL detection).
 *
 * esbuild converts the ESM dependency into CommonJS at build time, so the
 * deployed require graph stays CommonJS while the sanitizer keeps its fixes.
 */
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const projectRoot = path.join(__dirname, '..');
const outfile = path.join(projectRoot, 'dist', 'vendor', 'sanitize-html.cjs');

async function main() {
  fs.mkdirSync(path.dirname(outfile), { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(projectRoot, 'node_modules', 'sanitize-html', 'index.js')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    // Keep the bundle self-contained: no runtime dependency on node_modules
    // layout, so nothing can re-introduce an ESM require at runtime.
    packages: 'bundle',
    logLevel: 'info',
  });

  const { size } = fs.statSync(outfile);
  console.log(`[build] bundled sanitize-html -> dist/vendor/sanitize-html.cjs (${size} bytes)`);
}

main().catch((error) => {
  console.error('[build] failed to bundle sanitize-html:', error);
  process.exit(1);
});
