# Authentication & Security Guide

This project now uses cookie-first JWT authentication with production-grade cookie options, CORS, Helmet, and signin rate-limiting.

Files changed
- `src/helper/authCookies.js` — centralized cookie options and helpers: `setAuthCookie`, `clearAuthCookie`, `extractToken`, `verifyToken`.
- `src/middlewares/authenticate.js` — cookie-first token extraction and robust verification; attaches `req.user`.
- `src/middlewares/rateLimiter.js` — signin rate limiter middleware.
- `src/controllers/admin.controller.js` — uses `setAuthCookie` / `clearAuthCookie`.
- `src/index.js` — added `helmet()` and improved CORS handling.

Environment variables (examples)
- `NODE_ENV` — `development` or `production`
- `PORT` — server port (default `4000`)
- `JWT_SECRET` — required secret for signing tokens
- `JWT_EXPIRES_IN` — passed to `jsonwebtoken` (e.g. `7d`, `24h`)
- `AUTH_COOKIE_NAME` — cookie name (default `token`)
- `JWT_COOKIE_MAX_AGE_MS` — optional cookie maxAge in milliseconds (default 7 days)
- `CORS_ORIGINS` — comma-separated allowed origins for CORS (e.g. `https://app.example.com,https://admin.example.com`)
- `ADMIN_REGISTRATION_KEY` — optional admin signup key

Frontend (fetch / axios) config
- Always send credentials to include cookies:

Fetch example:

```javascript
fetch("https://api.example.com/api/admin/signin", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

Axios example:

```javascript
axios.defaults.withCredentials = true;
axios.post("/api/admin/signin", { email, password });
```

Testing with Supertest
- Supertest will receive `Set-Cookie` headers on signin. Use them for subsequent requests.

Example snippet (Jest + Supertest):

```javascript
const res = await request(app).post('/api/admin/signin').send({ email, password });
expect(res.headers['set-cookie']).toBeDefined();
const cookie = res.headers['set-cookie'];
await request(app).get('/api/admin/me').set('Cookie', cookie);
```

Security notes & recommendations
- Cookies are `httpOnly` and `secure` in production; `sameSite` is `None` in production to allow cross-site cookies when needed.
- Ensure `CORS_ORIGINS` lists only trusted frontends when deploying to production.
- Consider enabling CSRF protection (double-submit cookie / CSRF tokens) if frontend is a cross-site app and cookies are used with `sameSite=None`.
- Keep `JWT_SECRET` rotated periodically and stored in a secrets manager.
- Consider short-lived access tokens with refresh tokens stored in httpOnly cookies for stronger security posture.

Deployment notes
- Ensure TLS termination (HTTPS) is enabled; secure cookies require HTTPS.
- Configure domain and cookie options if using subdomains (set `AUTH_COOKIE_NAME` and `JWT_COOKIE_MAX_AGE_MS` as needed).
- Use a rate-limiting reverse proxy and WAF in front of the API for additional protection.
