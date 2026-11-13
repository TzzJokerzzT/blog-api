import { env } from './env';

/**
 * CORS origin resolution.
 *
 * Vercel gives every preview deployment its own hostname
 * (e.g. `front-git-main-team.vercel.app`), so an exact-match whitelist silently
 * rejects the browser origin and the response carries no
 * Access-Control-Allow-Origin header. The browser then reports a CORS error
 * even though the request reached the API.
 *
 * Entries may contain `*` to match one or more subdomain labels:
 *   https://*.vercel.app  ->  https://blog-front-git-main-team.vercel.app
 */
const escapeRegExp = (value: string): string =>
  value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

const toPattern = (entry: string): RegExp =>
  new RegExp(`^${escapeRegExp(entry).replace(/\*/g, '[^.]*(?:\\.[^.]*)*')}$`);

const wildcardPatterns = env.ALLOWED_ORIGINS.filter((entry) => entry.includes('*')).map(
  toPattern
);

export const isOriginAllowed = (origin: string): boolean =>
  env.ALLOWED_ORIGINS.includes(origin) || wildcardPatterns.some((pattern) => pattern.test(origin));

export const corsOrigin = (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean | string) => void
): void => {
  // Same-origin, curl, health probes and server-to-server calls send no Origin.
  if (!origin) {
    callback(null, true);
    return;
  }

  if (isOriginAllowed(origin)) {
    // Reflect the exact origin so `credentials: true` keeps working.
    callback(null, origin);
    return;
  }

  // Visible in the Vercel function logs; without it a rejected origin is
  // indistinguishable from a crash in the browser.
  console.warn(
    `[cors] rejected origin "${origin}". Allowed: ${
      env.ALLOWED_ORIGINS.join(', ') || '(nothing configured)'
    }`
  );
  callback(null, false);
};
