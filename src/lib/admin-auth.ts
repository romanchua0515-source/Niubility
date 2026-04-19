/**
 * Single source of truth for the admin session cookie.
 * Imported by middleware.ts, /admin/login, /admin/logout, and the
 * /api/import-tool route so the name, path, and options can't drift.
 */

export const ADMIN_COOKIE = "admin_auth";
export const ADMIN_COOKIE_VALUE = "true";

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
} as const;

/**
 * Same options with maxAge: 0 — used at logout so the browser drops the
 * cookie. `path` MUST match what was used when the cookie was set,
 * otherwise the Set-Cookie header is a no-op.
 */
export const ADMIN_COOKIE_CLEAR_OPTIONS = {
  ...ADMIN_COOKIE_OPTIONS,
  maxAge: 0,
} as const;
