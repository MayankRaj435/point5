import dotenv from "dotenv";
import { verifyToken as jwtVerify } from "./jwt.js";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";

const defaultMaxAge = (() => {
  const envMs = process.env.JWT_COOKIE_MAX_AGE_MS;
  if (envMs) {
    const n = Number(envMs);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  // default 7 days in ms
  return 7 * 24 * 60 * 60 * 1000;
})();

export function getCookieOptions({ maxAge = defaultMaxAge, domain } = {}) {
  const opts = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge,
    path: "/",
  };

  if (domain) opts.domain = domain;

  return opts;
}

export function setAuthCookie(res, token, opts = {}) {
  const cookieOpts = getCookieOptions(opts);
  res.cookie(COOKIE_NAME, token, cookieOpts);
}

export function clearAuthCookie(res, opts = {}) {
  const cookieOpts = getCookieOptions(opts);
  // clearCookie may require same options to remove properly on some browsers
  res.clearCookie(COOKIE_NAME, cookieOpts);
}

export function extractToken(req) {
  // Cookie-first primary
  const cookieToken = req.cookies?.[COOKIE_NAME];
  if (cookieToken) return cookieToken;

  // Fallback to Authorization header (optional)
  const header = req.headers?.authorization || "";
  if (header.startsWith("Bearer ")) return header.replace("Bearer ", "");

  return null;
}

export function verifyToken(token) {
  try {
    const payload = jwtVerify(token);
    return { valid: true, expired: false, payload };
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      return { valid: false, expired: true, error: err };
    }
    return { valid: false, expired: false, error: err };
  }
}

export default {
  COOKIE_NAME,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
  extractToken,
  verifyToken,
};
