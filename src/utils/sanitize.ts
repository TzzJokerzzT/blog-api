/**
 * The sanitizer is loaded from a CommonJS bundle produced at build time by
 * `scripts/bundle-sanitize-html.cjs`.
 *
 * `sanitize-html` pulls in htmlparser2 12, which is ESM-only. Requiring it
 * directly crashes the app on the Vercel function runtime with
 * ERR_REQUIRE_ESM, taking down every route (including CORS headers). The
 * bundle keeps the same version - and therefore the same security fixes -
 * while presenting a CommonJS surface.
 *
 * The require path is a static string literal on purpose: Vercel's file
 * tracing only follows static requires.
 */
type SanitizeHtml = typeof import('sanitize-html');
type SanitizeHtmlOptions = NonNullable<Parameters<SanitizeHtml>[1]>;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sanitizeHtml = require('../vendor/sanitize-html.cjs') as SanitizeHtml;

const allowedOptions: SanitizeHtmlOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'ul', 'ol', 'li',
    'strong', 'em', 'code', 'pre', 'blockquote',
    'a', 'img',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https'],
};

export const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, allowedOptions);
};

export const sanitizeText = (dirty: string): string => {
  return sanitizeHtml(dirty, { allowedTags: [], allowedAttributes: {} });
};
