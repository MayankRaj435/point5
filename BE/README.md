# Point5 Backend

Express 5 + Prisma backend for a content site with cookie-first JWT authentication, admin-only CRUD, public blogs and portfolio endpoints, contact form submissions, and multipart uploads.

This README is written as a practical API reference and project guide. It reflects the current implementation in `src/`, the real request/response shapes from the controllers, and the current test setup.

## Table of Contents

- Project overview
- Architecture
- Setup
- Environment variables
- Prisma workflow
- Testing and Jest ESM setup
- Authentication model
- API conventions
- Endpoint reference
- Frontend integration examples
- Common mistakes and troubleshooting
- Deployment notes

## Project Overview

This backend exposes a REST API for:

- Admin authentication using JWT stored in httpOnly cookies
- Public blog listing and single-blog lookup
- Admin-only blog creation, editing, deletion, and editor image upload
- Public portfolio listing and single-card lookup
- Admin-only portfolio CRUD
- Public contact form submission and admin contact management
- Static file hosting for uploaded assets

The API is designed for a browser frontend that sends cookies using `credentials: "include"` or `withCredentials: true`.

## Architecture

### Application Layers

- `src/index.js` configures the Express app, security middleware, CORS, static uploads, and route mounting.
- `src/routes/*.routes.js` wires endpoints to controllers and middleware.
- `src/controllers/*.controller.js` contains validation, Prisma access, and response logic.
- `src/middlewares/authenticate.js` enforces auth and admin role checks.
- `src/helper/authCookies.js` centralizes auth cookie and token helpers.
- `src/helper/jwt.js` signs and verifies JWTs.
- `src/helper/pooler.js` exposes the Prisma client.

### Prisma Models Used by the API

Based on the controllers, the app interacts with these Prisma models:

- `user` for admin authentication
- `blog` for blog content
- `portfolioCard` for portfolio entries
- `contact` for contact submissions

The controllers use these model methods:

- `findUnique`
- `findFirst`
- `findMany`
- `create`
- `update`
- `delete`

## Setup Instructions

### Install dependencies

```bash
npm install
```

If you need to reinstall the packages used by this project:

```bash
npm install bcryptjs joi helmet express-rate-limit
npm install -D jest babel-jest @babel/core @babel/preset-env @jest/globals supertest
```

### Environment variables

Create a `.env` file in the project root:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
AUTH_COOKIE_NAME=token
JWT_COOKIE_MAX_AGE_MS=604800000
CORS_ORIGINS=http://localhost:3000
ADMIN_REGISTRATION_KEY=test-registration-key
```

### Prisma workflow

Generate the client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Reset local development data:

```bash
npx prisma migrate reset
```

### Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Development Scripts

Current scripts in `package.json`:

- `npm start` - start the API
- `npm run dev` - start the API with Nodemon
- `npm test` - run Jest in ESM mode on Windows and other platforms
- `npm run test:watch` - watch mode
- `npm run test:ci` - CI-friendly test run

## Testing and Jest ESM Setup

This project is configured for ES Modules using Jest + Babel.

### Why the earlier setup failed

The original failure came from a few separate issues:

- Jest was not installed locally, so Windows PowerShell could not resolve the `jest` command.
- The script depended on a global-style binary lookup instead of calling the local Jest binary in `node_modules`.
- ESM setup files need `import { jest } from "@jest/globals"` when using Jest APIs such as `jest.setTimeout()`.

### How Jest works with ES Modules here

This repo uses:

- `"type": "module"` in `package.json`
- `node --experimental-vm-modules` when launching Jest
- `babel-jest` and `@babel/preset-env` for clean transformation
- `modules: false` in Babel so native ESM syntax is preserved

### Working test command

```bash
npm test
```

### Test environment files

- `tests/env.setup.js` sets safe defaults for test env vars
- `tests/setup.js` sets test timeout and disconnects Prisma after all suites
- `tests/admin.test.js`, `tests/blog.test.js`, `tests/contact.test.js`, `tests/portfolio.test.js`, and `tests/health.test.js` use Supertest against the Express app

### Supertest integration pattern

The tests use `request(app)` and reuse cookies between requests:

1. Sign in or sign up
2. Capture `set-cookie` from the response
3. Send the cookie in a later request using the `Cookie` header

## Authentication Model

Authentication is cookie-first.

### Login flow

1. `POST /api/admin/signup` or `POST /api/admin/signin` validates credentials.
2. The controller generates a signed JWT.
3. The JWT is stored in an httpOnly cookie named `token` by default.
4. Protected routes call `authenticate`.
5. `authenticate` reads the cookie first, then falls back to `Authorization: Bearer <token>` for compatibility.
6. `requireAdmin` checks that the authenticated user role is `ADMIN`.

### Cookie behavior

Auth cookies are configured centrally in `src/helper/authCookies.js`.

- `setAuthCookie()` sets the cookie
- `clearAuthCookie()` clears it on logout
- `extractToken()` checks cookie first, then bearer header fallback
- `verifyToken()` wraps JWT verification and returns expired vs invalid state

Production cookie defaults:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "None"` in production for cross-site cookie usage
- configurable name via `AUTH_COOKIE_NAME`
- configurable lifetime via `JWT_COOKIE_MAX_AGE_MS`
- optional domain support

### Frontend session rules

Frontend requests must include cookies:

- `fetch(..., { credentials: "include" })`
- `axios.defaults.withCredentials = true`

## API Conventions

### Common response shape

Success responses usually look like:

```json
{
  "success": true
}
```

Errors usually look like:

```json
{
  "success": false,
  "error": "Message here"
}
```

Some auth handlers return `message` instead of `error`. That behavior is preserved for compatibility.

### Common status codes

- `200` - successful read, update, or logout
- `201` - successful create or signup
- `400` - validation failure or bad input
- `401` - missing/invalid/expired authentication
- `403` - authenticated but not allowed, or invalid admin registration key
- `404` - resource not found
- `500` - unexpected server or database error

## Endpoint Reference

Each endpoint below documents what it expects, what it returns, failure behavior, cookies, upload behavior, Prisma interaction, and frontend usage.

---

## `GET /health`

### Summary

Health check endpoint used by uptime monitors and deployments.

### Authentication

- None

### Required headers

- None

### Required cookies

- None

### Query parameters

- None

### Path parameters

- None

### Request body

- None

### Validation rules

- No validation

### Prisma interaction

- None

### Returns

- `200 OK`
- Body:

```json
{
  "success": true,
  "ok": true
}
```

### Failure behavior

- This route has no explicit failure branch in the current implementation.

### Example request

```bash
curl http://localhost:4000/health
```

### Example fetch

```javascript
const response = await fetch("http://localhost:4000/health");
const data = await response.json();
```

### Example axios

```javascript
const { data } = await axios.get("/health");
```

### Notes

- Useful for load balancers, readiness checks, and deployment smoke tests.

---

## `POST /api/admin/signup`

### Summary

Creates an admin account, signs a JWT, and stores it in an httpOnly cookie.

### Authentication

- None

### Role requirements

- None to call the route
- The created user is assigned `ADMIN`

### Required headers

- `Content-Type: application/json`

### Required cookies

- None on request
- Sets auth cookie on success

### Request body schema

```json
{
  "name": "string | optional",
  "email": "string | required",
  "password": "string | required",
  "registrationKey": "string | optional"
}
```

### Validation rules

- `email` must be a valid email address
- `password` must be at least 6 characters
- `name` is optional
- `registrationKey` is optional in schema but may be required by environment policy

### Prisma interaction

- `prisma.user.findUnique({ where: { email } })`
- `prisma.user.findFirst({ where: { role: "ADMIN" } })` when no registration key is configured
- `prisma.user.create({ data: { name, email, password: hashedPassword, role: "ADMIN" } })`

### Behavior

- If `ADMIN_REGISTRATION_KEY` exists, the request must include the matching `registrationKey`.
- If `ADMIN_REGISTRATION_KEY` is not set, only the initial admin may be created. Once an admin exists, further signups are blocked.
- Passwords are hashed with bcrypt before storage.
- The response excludes the password.

### Status codes

- `201` - admin created successfully
- `400` - validation failure or duplicate email
- `403` - invalid admin registration key or signup disabled after initial setup
- `500` - unexpected server error

### Example request

```bash
curl -X POST http://localhost:4000/api/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "admin@example.com",
    "password": "password123",
    "registrationKey": "test-registration-key"
  }' -i
```

### Example success response

```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": 1,
    "name": "Test Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "message": "\"email\" is required"
}
```

```json
{
  "success": false,
  "message": "User already exists"
}
```

```json
{
  "success": false,
  "message": "Invalid admin registration key"
}
```

### Cookie behavior

- Sets a JWT cookie named `token` by default
- Cookie is httpOnly
- Cookie is secure in production
- Cookie lifetime follows the auth helper configuration

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/admin/signup", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Admin",
    email: "admin@example.com",
    password: "password123",
    registrationKey: "test-registration-key",
  }),
});
```

Axios:

```javascript
await axios.post(
  "/api/admin/signup",
  {
    name: "Test Admin",
    email: "admin@example.com",
    password: "password123",
    registrationKey: "test-registration-key",
  },
  { withCredentials: true }
);
```

### Common failure notes

- Missing email or password triggers `400` from Joi
- Wrong registration key triggers `403`
- Duplicate email triggers `400`

---

## `POST /api/admin/signin`

### Summary

Authenticates an admin user, signs a JWT, and stores it in the auth cookie.

### Authentication

- None

### Role requirements

- User must already exist and have role `ADMIN`

### Required headers

- `Content-Type: application/json`

### Required cookies

- None on request
- Sets auth cookie on success

### Request body schema

```json
{
  "email": "string | required",
  "password": "string | required"
}
```

### Validation rules

- `email` must be valid
- `password` must be at least 6 characters

### Prisma interaction

- `prisma.user.findUnique({ where: { email } })`
- No user record is modified

### Behavior

- Rejects non-admin users
- Compares password with bcrypt
- On success, returns the admin profile and sets the cookie

### Status codes

- `200` - authenticated successfully
- `400` - validation failure
- `401` - invalid credentials or non-admin account
- `500` - internal error

### Example request

```bash
curl -X POST http://localhost:4000/api/admin/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' -i
```

### Example success response

```json
{
  "success": true,
  "admin": {
    "id": 1,
    "name": "Test Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

```json
{
  "success": false,
  "message": "\"password\" length must be at least 6 characters long"
}
```

### Cookie behavior

- Sets the auth cookie on success
- Cookie name defaults to `token`
- Cookie is httpOnly and secure in production
- Frontend must send credentials for later authenticated requests

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/admin/signin", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "password123",
  }),
});
```

Axios:

```javascript
await axios.post(
  "/api/admin/signin",
  { email: "admin@example.com", password: "password123" },
  { withCredentials: true }
);
```

### Common failure notes

- Wrong password or non-admin account returns `401`
- Missing credentials returns `400`

---

## `POST /api/admin/logout`

### Summary

Clears the auth cookie and ends the browser session.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: application/json` is optional
- `Authorization: Bearer <token>` is accepted as fallback if no cookie is present

### Required cookies

- Auth cookie `token` recommended for browser sessions

### Request body schema

- None

### Validation rules

- Auth middleware must successfully identify an admin

### Prisma interaction

- Reads the `user` table indirectly through auth middleware

### Behavior

- The route does not invalidate the JWT in the database; it clears the cookie in the browser.
- If the token is still present elsewhere, it could still be used until it expires.

### Status codes

- `200` - logged out successfully
- `401` - authentication required
- `403` - admin role required
- `500` - internal error

### Example request

```bash
curl -X POST http://localhost:4000/api/admin/logout \
  -H "Cookie: token=YOUR_COOKIE_VALUE" -i
```

### Example success response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Authentication required"
}
```

```json
{
  "success": false,
  "error": "Admin role required"
}
```

### Cookie behavior

- Clears the auth cookie on response
- The clear operation uses the same auth cookie settings as login

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/admin/logout", {
  method: "POST",
  credentials: "include",
});
```

Axios:

```javascript
await axios.post("/api/admin/logout", {}, { withCredentials: true });
```

### Common failure notes

- You must send credentials so the browser can clear the cookie correctly.

---

## `GET /api/admin/me`

### Summary

Returns the currently authenticated admin profile.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond normal cookie/header auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Request body schema

- None

### Query parameters

- None

### Path parameters

- None

### Prisma interaction

- `prisma.user.findUnique({ where: { id: adminId }, select: { id, name, email, role } })`

### Behavior

- Returns a sanitized admin object with no password field
- If the user no longer exists, returns `404`

### Status codes

- `200` - current admin returned
- `401` - authentication required or invalid token
- `403` - admin role required
- `404` - user not found
- `500` - internal error

### Example request

```bash
curl http://localhost:4000/api/admin/me \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "admin": {
    "id": 1,
    "name": "Test Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Authentication required"
}
```

```json
{
  "success": false,
  "error": "Admin role required"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/admin/me", {
  credentials: "include",
});
```

Axios:

```javascript
await axios.get("/api/admin/me", { withCredentials: true });
```

### Common failure notes

- Missing cookie or bearer token returns `401`
- Non-admin users are blocked by `requireAdmin`

---

## `GET /api/blogs`

### Summary

Returns all published blogs sorted by newest first.

### Authentication

- None

### Required headers

- None

### Required cookies

- None

### Query parameters

- None

### Path parameters

- None

### Request body schema

- None

### Validation rules

- No request validation

### Prisma interaction

- `prisma.blog.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } })`

### Returns

- `200 OK`
- Body:

```json
{
  "success": true,
  "blogs": []
}
```

### Status codes

- `200` - success
- `500` - failed to fetch blogs

### Example request

```bash
curl http://localhost:4000/api/blogs
```

### Example success response

```json
{
  "success": true,
  "blogs": [
    {
      "id": 7,
      "title": "Launching a New Site",
      "content": "Long-form content...",
      "published": true,
      "thumbnail": "/uploads/blogs/thumbnail-7.png",
      "cover": "/uploads/blogs/cover-7.png",
      "createdAt": "2026-05-25T12:00:00.000Z",
      "updatedAt": "2026-05-25T12:00:00.000Z"
    }
  ]
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to fetch blogs"
}
```

### Frontend usage examples

Fetch:

```javascript
const { blogs } = await fetch("/api/blogs").then((r) => r.json());
```

Axios:

```javascript
const { data } = await axios.get("/api/blogs");
```

### Notes

- Only published blogs are returned.
- Draft blogs remain hidden from this endpoint.

---

## `GET /api/blogs/:id`

### Summary

Returns a single blog by numeric ID.

### Authentication

- None

### Required headers

- None

### Required cookies

- None

### Query parameters

- None

### Path parameters

- `id` - numeric blog ID

### Request body schema

- None

### Validation rules

- `id` must be numeric

### Prisma interaction

- `prisma.blog.findUnique({ where: { id: Number(req.params.id) } })`

### Status codes

- `200` - blog returned
- `400` - invalid blog id
- `404` - blog not found
- `500` - failed to fetch blog

### Example request

```bash
curl http://localhost:4000/api/blogs/7
```

### Example success response

```json
{
  "success": true,
  "blog": {
    "id": 7,
    "title": "Launching a New Site",
    "content": "Long-form content...",
    "published": true,
    "thumbnail": "/uploads/blogs/thumbnail-7.png",
    "cover": "/uploads/blogs/cover-7.png"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Invalid blog id"
}
```

```json
{
  "success": false,
  "error": "Blog not found"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/blogs/7");
```

Axios:

```javascript
await axios.get("/api/blogs/7");
```

### Notes

- This endpoint does not require authentication.

---

## `POST /api/blogs`

### Summary

Creates a blog post with thumbnail and cover uploads.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: multipart/form-data`

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- None

### Query parameters

- None

### Multipart/form-data fields

- `thumbnail` - required file field, exactly one file
- `cover` - required file field, exactly one file
- `title` - required text field
- `content` - optional text field
- `published` - optional boolean-like text or boolean field

### Request body schema

In multipart form notation:

```txt
title: string (required)
content: string (optional)
published: boolean | "true" | "false" | "1" (optional)
thumbnail: file (required)
cover: file (required)
```

### Validation rules

- `title` must be present and non-empty after trimming
- `thumbnail` must be uploaded
- `cover` must be uploaded
- `published` is treated as true when set to `true`, `"true"`, or `"1"`

### Prisma interaction

- `prisma.blog.create({ data: { title, content, published, thumbnail, cover } })`

### Upload expectations

- Thumbnail and cover images are stored in `data/uploads/blogs`
- Allowed file types come from the Multer uploader configuration:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/svg+xml`

### Status codes

- `201` - blog created
- `400` - missing title or missing upload fields
- `401` - authentication required
- `403` - admin role required
- `500` - failed to create blog

### Example request

```bash
curl -X POST http://localhost:4000/api/blogs \
  -H "Cookie: token=YOUR_COOKIE_VALUE" \
  -F "title=Launching a New Site" \
  -F "content=This is the content body." \
  -F "published=true" \
  -F "thumbnail=@./thumbnail.png" \
  -F "cover=@./cover.png"
```

### Example success response

```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "id": 8,
    "title": "Launching a New Site",
    "content": "This is the content body.",
    "published": true,
    "thumbnail": "/uploads/blogs/thumbnail-8.png",
    "cover": "/uploads/blogs/cover-8.png"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Title is required"
}
```

```json
{
  "success": false,
  "error": "Thumbnail and cover images are required"
}
```

### Frontend usage examples

Fetch:

```javascript
const formData = new FormData();
formData.append("title", "Launching a New Site");
formData.append("content", "This is the content body.");
formData.append("published", "true");
formData.append("thumbnail", thumbnailFile);
formData.append("cover", coverFile);

await fetch("/api/blogs", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

Axios:

```javascript
const formData = new FormData();
formData.append("title", "Launching a New Site");
formData.append("thumbnail", thumbnailFile);
formData.append("cover", coverFile);

await axios.post("/api/blogs", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Notes

- The blog is always created as a DB record first-class through Prisma.
- The generated file paths are public under `/uploads/blogs`.

---

## `PUT /api/blogs/:id`

### Summary

Updates a blog and optionally replaces the thumbnail and/or cover image.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: multipart/form-data`

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - blog ID

### Query parameters

- None

### Multipart/form-data fields

- `thumbnail` - optional file field
- `cover` - optional file field
- `title` - optional text field
- `content` - optional text field
- `published` - optional boolean-like field

### Validation rules

- No explicit Joi schema is applied in the current controller
- `published` uses the same boolean coercion as create
- `id` is converted with `Number(id)`

### Prisma interaction

- `prisma.blog.update({ where: { id: Number(id) }, data: updateData })`

### Behavior

- Only supplied fields are updated
- `title` and `content` are updated as-is when provided
- Image fields are replaced only if new files are uploaded

### Status codes

- `200` - update successful
- `401` - authentication required
- `403` - admin role required
- `500` - update failed or record not found or invalid id

### Example request

```bash
curl -X PUT http://localhost:4000/api/blogs/8 \
  -H "Cookie: token=YOUR_COOKIE_VALUE" \
  -F "title=Updated Blog Title" \
  -F "published=false"
```

### Example success response

```json
{
  "success": true,
  "message": "Blog updated successfully",
  "blog": {
    "id": 8,
    "title": "Updated Blog Title",
    "published": false
  }
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to update blog"
}
```

### Frontend usage examples

Fetch:

```javascript
const formData = new FormData();
formData.append("title", "Updated Blog Title");
formData.append("published", "false");

await fetch("/api/blogs/8", {
  method: "PUT",
  credentials: "include",
  body: formData,
});
```

Axios:

```javascript
await axios.put("/api/blogs/8", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Notes

- If a blog ID does not exist, Prisma throws and the controller returns `500`.
- This route is intentionally flexible and accepts partial updates.

---

## `DELETE /api/blogs/:id`

### Summary

Deletes a blog by numeric ID.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond normal auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - blog ID

### Request body

- None

### Validation rules

- `id` must be numeric

### Prisma interaction

- `prisma.blog.delete({ where: { id: blogId } })`

### Status codes

- `200` - deleted successfully
- `400` - invalid blog id
- `401` - authentication required
- `403` - admin role required
- `500` - failed to delete blog

### Example request

```bash
curl -X DELETE http://localhost:4000/api/blogs/8 \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

### Example error response

```json
{
  "success": false,
  "error": "Invalid blog id"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/blogs/8", {
  method: "DELETE",
  credentials: "include",
});
```

Axios:

```javascript
await axios.delete("/api/blogs/8", { withCredentials: true });
```

### Notes

- This route performs hard deletion in the database.

---

## `POST /api/blogs/editor-image`

### Summary

Uploads a single image for use inside a rich-text editor.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: multipart/form-data`

### Required cookies

- Auth cookie `token` or bearer fallback token

### Multipart/form-data fields

- `file` - required single image file

### Request body schema

- No JSON body; upload only

### Validation rules

- File must be present

### Prisma interaction

- None directly; the file is stored on disk

### Upload expectations

- Files are stored under `data/uploads/editor`
- Allowed file types:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/svg+xml`

### Status codes

- `200` - upload successful
- `400` - no file uploaded
- `401` - authentication required
- `403` - admin role required
- `500` - image upload failed

### Example request

```bash
curl -X POST http://localhost:4000/api/blogs/editor-image \
  -H "Cookie: token=YOUR_COOKIE_VALUE" \
  -F "file=@./editor-image.png"
```

### Example success response

```json
{
  "success": true,
  "result": [
    {
      "url": "/uploads/editor/editor-image-1.png",
      "name": "editor-image-1.png",
      "size": 18342
    }
  ]
}
```

### Example error response

```json
{
  "success": false,
  "error": "No file uploaded"
}
```

### Frontend usage examples

Fetch:

```javascript
const formData = new FormData();
formData.append("file", editorImageFile);

const response = await fetch("/api/blogs/editor-image", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

Axios:

```javascript
const formData = new FormData();
formData.append("file", editorImageFile);

await axios.post("/api/blogs/editor-image", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Notes

- The returned `result` array is shaped for editor integrations that expect upload metadata.

---

## `GET /api/portfolio`

### Summary

Returns published portfolio cards ordered by `displayOrder`.

### Authentication

- None

### Required headers

- None

### Required cookies

- None

### Query parameters

- `serviceType` - optional string filter
- `featured` - optional string; only the exact value `"true"` filters to featured cards
- `slug` - optional slug filter

### Path parameters

- None

### Request body

- None

### Validation rules

- No explicit validation on query params

### Prisma interaction

- `prisma.portfolioCard.findMany({ where, orderBy: { displayOrder: "asc" } })`

### Behavior

- Always filters to `published: true`
- Adds `serviceType`, `slug`, and `featured` filters when provided

### Status codes

- `200` - success
- `500` - failed to fetch portfolio cards

### Example request

```bash
curl "http://localhost:4000/api/portfolio?serviceType=branding&featured=true"
```

### Example success response

```json
{
  "success": true,
  "cards": [
    {
      "id": "card_1",
      "slug": "brand-redesign",
      "name": "Brand Redesign",
      "serviceType": "branding",
      "featured": true,
      "published": true,
      "displayOrder": 1,
      "logo": "/uploads/portfolio/logo-1.png"
    }
  ]
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to fetch portfolio cards"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/portfolio?serviceType=branding&featured=true");
```

Axios:

```javascript
await axios.get("/api/portfolio", {
  params: { serviceType: "branding", featured: "true" },
});
```

### Notes

- The controller treats `featured=true` as the only truthy filter value.

---

## `GET /api/portfolio/:id`

### Summary

Returns a single portfolio card by ID.

### Authentication

- None

### Required headers

- None

### Required cookies

- None

### Path parameters

- `id` - portfolio card ID

### Request body

- None

### Validation rules

- No explicit validation before lookup

### Prisma interaction

- `prisma.portfolioCard.findUnique({ where: { id } })`

### Status codes

- `200` - card returned
- `404` - portfolio card not found
- `500` - failed to fetch portfolio card

### Example request

```bash
curl http://localhost:4000/api/portfolio/card_1
```

### Example success response

```json
{
  "success": true,
  "card": {
    "id": "card_1",
    "slug": "brand-redesign",
    "name": "Brand Redesign",
    "serviceType": "branding",
    "published": true
  }
}
```

### Example error response

```json
{
  "success": false,
  "error": "Portfolio card not found"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/portfolio/card_1");
```

Axios:

```javascript
await axios.get("/api/portfolio/card_1");
```

### Notes

- The controller uses the raw `id` parameter directly, so the route accepts the model's ID format as stored in Prisma.

---

## `POST /api/portfolio`

### Summary

Creates a portfolio card with a required logo upload.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: multipart/form-data`

### Required cookies

- Auth cookie `token` or bearer fallback token

### Multipart/form-data fields

- `logo` - required single file
- `slug` - required text
- `name` - required text
- `category` - required text
- `tagline` - required text
- `description` - required text
- `serviceType` - required text
- `accent` - optional text
- `bg` - optional text
- `tags` - optional array, JSON string, or comma-separated string
- `deliverables` - optional array, JSON string, or comma-separated string
- `featured` - optional boolean-like text/boolean
- `published` - optional boolean-like text/boolean
- `displayOrder` - optional number-like text

### Request body schema

```txt
slug: string (required)
name: string (required)
category: string (required)
tagline: string (required)
description: string (required)
serviceType: string (required)
accent: string | optional
bg: string | optional
tags: array | JSON string | comma-separated string | optional
deliverables: array | JSON string | comma-separated string | optional
featured: boolean-like | optional
published: boolean-like | optional
displayOrder: number-like | optional
logo: file (required)
```

### Validation rules

- Required text fields must be present
- `logo` must be uploaded
- `tags` and `deliverables` are normalized using JSON parsing or comma splitting
- `displayOrder` is coerced with `Number(displayOrder) || 0`
- `published` defaults to `true` when omitted

### Prisma interaction

- `prisma.portfolioCard.create({ data: { ... } })`

### Upload expectations

- The logo is stored in `data/uploads/portfolio`
- Allowed file types:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/jpg`
  - `image/svg+xml`

### Status codes

- `201` - portfolio card created
- `400` - missing required fields or missing logo
- `401` - authentication required
- `403` - admin role required
- `500` - failed to create portfolio card

### Example request

```bash
curl -X POST http://localhost:4000/api/portfolio \
  -H "Cookie: token=YOUR_COOKIE_VALUE" \
  -F "slug=brand-redesign" \
  -F "name=Brand Redesign" \
  -F "category=Branding" \
  -F "tagline=A complete visual refresh" \
  -F "description=We redesigned the brand identity from the ground up." \
  -F "serviceType=branding" \
  -F "tags=[\"branding\",\"design\"]" \
  -F "deliverables=Logo,Style Guide,Social Kit" \
  -F "featured=true" \
  -F "published=true" \
  -F "displayOrder=1" \
  -F "logo=@./logo.png"
```

### Example success response

```json
{
  "success": true,
  "card": {
    "id": "card_1",
    "slug": "brand-redesign",
    "name": "Brand Redesign",
    "category": "Branding",
    "tagline": "A complete visual refresh",
    "description": "We redesigned the brand identity from the ground up.",
    "serviceType": "branding",
    "featured": true,
    "published": true,
    "displayOrder": 1,
    "logo": "/uploads/portfolio/logo-1.png"
  }
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Please fill all required fields"
}
```

```json
{
  "success": false,
  "error": "Logo image is required"
}
```

### Frontend usage examples

Fetch:

```javascript
const formData = new FormData();
formData.append("slug", "brand-redesign");
formData.append("name", "Brand Redesign");
formData.append("category", "Branding");
formData.append("tagline", "A complete visual refresh");
formData.append("description", "We redesigned the brand identity from the ground up.");
formData.append("serviceType", "branding");
formData.append("logo", logoFile);

await fetch("/api/portfolio", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

Axios:

```javascript
await axios.post("/api/portfolio", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Notes

- `accent` and `bg` may be stored as `null` when omitted.
- Tags and deliverables are persisted as normalized arrays.

---

## `PUT /api/portfolio/:id`

### Summary

Updates a portfolio card and optionally replaces the logo.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- `Content-Type: multipart/form-data`

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - portfolio card ID

### Multipart/form-data fields

- `logo` - optional single file
- `slug` - optional text
- `name` - optional text
- `category` - optional text
- `tagline` - optional text
- `description` - optional text
- `serviceType` - optional text
- `tags` - optional array, JSON string, or comma-separated string
- `deliverables` - optional array, JSON string, or comma-separated string
- `featured` - optional boolean-like text/boolean
- `published` - optional boolean-like text/boolean
- `displayOrder` - optional number-like text
- `accent` - optional text
- `bg` - optional text

### Validation rules

- No Joi schema is applied in the current controller
- Only provided fields are updated
- `displayOrder` is coerced with `Number(displayOrder) || 0`
- `tags` and `deliverables` are normalized if present

### Prisma interaction

- `prisma.portfolioCard.update({ where: { id }, data: updateData })`

### Behavior

- No field changes are made for omitted inputs
- Uploaded logo replaces the existing stored path

### Status codes

- `200` - update successful
- `401` - authentication required
- `403` - admin role required
- `500` - update failed

### Example request

```bash
curl -X PUT http://localhost:4000/api/portfolio/card_1 \
  -H "Cookie: token=YOUR_COOKIE_VALUE" \
  -F "name=Updated Brand Redesign" \
  -F "featured=false"
```

### Example success response

```json
{
  "success": true,
  "message": "Portfolio card updated successfully",
  "card": {
    "id": "card_1",
    "name": "Updated Brand Redesign",
    "featured": false
  }
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to update portfolio card"
}
```

### Frontend usage examples

Fetch:

```javascript
const formData = new FormData();
formData.append("name", "Updated Brand Redesign");

await fetch("/api/portfolio/card_1", {
  method: "PUT",
  credentials: "include",
  body: formData,
});
```

Axios:

```javascript
await axios.put("/api/portfolio/card_1", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Notes

- If the record does not exist, Prisma throws and the controller returns `500`.

---

## `DELETE /api/portfolio/:id`

### Summary

Deletes a portfolio card by ID.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - portfolio card ID

### Request body

- None

### Prisma interaction

- `prisma.portfolioCard.delete({ where: { id } })`

### Status codes

- `200` - deleted successfully
- `401` - authentication required
- `403` - admin role required
- `500` - failed to delete portfolio card

### Example request

```bash
curl -X DELETE http://localhost:4000/api/portfolio/card_1 \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "message": "Portfolio card deleted successfully"
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to delete portfolio card"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/portfolio/card_1", {
  method: "DELETE",
  credentials: "include",
});
```

Axios:

```javascript
await axios.delete("/api/portfolio/card_1", { withCredentials: true });
```

### Notes

- This route performs hard deletion in the database.

---

## `POST /api/contacts`

### Summary

Accepts a public contact form submission and stores it in Prisma.

### Authentication

- None

### Required headers

- `Content-Type: application/json`

### Required cookies

- None

### Request body schema

```json
{
  "fullName": "string | required",
  "email": "string | required",
  "phoneNumber": "string | optional",
  "subject": "string | required",
  "projectInfo": "string | required"
}
```

### Validation rules

- `fullName`, `email`, `subject`, and `projectInfo` are required
- `phoneNumber` is optional
- `email` is trimmed and lowercased before storage

### Prisma interaction

- `prisma.contact.create({ data: { fullName, email, phoneNumber, subject, projectInfo } })`

### Behavior

- Missing required fields return `400`
- Successful submissions are stored in the database and returned in full

### Status codes

- `201` - contact created
- `400` - missing required fields
- `500` - failed to submit contact form

### Example request

```bash
curl -X POST http://localhost:4000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "+1-555-123-4567",
    "subject": "Website redesign",
    "projectInfo": "We need a modern portfolio website."
  }'
```

### Example success response

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "contact_1",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "+1-555-123-4567",
    "subject": "Website redesign",
    "projectInfo": "We need a modern portfolio website."
  }
}
```

### Example error responses

```json
{
  "success": false,
  "error": "Please fill all required fields"
}
```

```json
{
  "success": false,
  "error": "Failed to submit contact form"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/contacts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "Jane Doe",
    email: "jane@example.com",
    phoneNumber: "+1-555-123-4567",
    subject: "Website redesign",
    projectInfo: "We need a modern portfolio website.",
  }),
});
```

Axios:

```javascript
await axios.post("/api/contacts", {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phoneNumber: "+1-555-123-4567",
  subject: "Website redesign",
  projectInfo: "We need a modern portfolio website.",
});
```

### Notes

- This endpoint is public and does not require authentication.

---

## `GET /api/contacts`

### Summary

Returns all contact submissions, newest first.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Query parameters

- None

### Path parameters

- None

### Request body

- None

### Prisma interaction

- `prisma.contact.findMany({ orderBy: { createdAt: "desc" } })`

### Returns

- `200 OK`
- Body:

```json
{
  "success": true,
  "contacts": []
}
```

### Status codes

- `200` - success
- `401` - authentication required
- `403` - admin role required
- `500` - failed to fetch contacts

### Example request

```bash
curl http://localhost:4000/api/contacts \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "contacts": [
    {
      "id": "contact_1",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Website redesign",
      "projectInfo": "We need a modern portfolio website."
    }
  ]
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to fetch contacts"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/contacts", {
  credentials: "include",
});
```

Axios:

```javascript
await axios.get("/api/contacts", { withCredentials: true });
```

### Notes

- This endpoint is admin-only and is intended for back-office tools.

---

## `GET /api/contacts/:id`

### Summary

Returns a single contact submission by ID.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - contact ID

### Request body

- None

### Prisma interaction

- `prisma.contact.findUnique({ where: { id } })`

### Behavior

- If no contact exists, returns `404`

### Status codes

- `200` - contact returned
- `401` - authentication required
- `403` - admin role required
- `404` - contact not found
- `500` - failed to fetch contact

### Example request

```bash
curl http://localhost:4000/api/contacts/contact_1 \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "contact": {
    "id": "contact_1",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Website redesign",
    "projectInfo": "We need a modern portfolio website."
  }
}
```

### Example error response

```json
{
  "success": false,
  "error": "Contact not found"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/contacts/contact_1", {
  credentials: "include",
});
```

Axios:

```javascript
await axios.get("/api/contacts/contact_1", { withCredentials: true });
```

### Notes

- The route uses the raw `id` parameter directly as stored in Prisma.

---

## `DELETE /api/contacts/:id`

### Summary

Deletes a contact submission by ID.

### Authentication

- Required
- Middleware: `authenticate`, `requireAdmin`

### Role requirements

- `ADMIN`

### Required headers

- None beyond auth usage

### Required cookies

- Auth cookie `token` or bearer fallback token

### Path parameters

- `id` - contact ID

### Request body

- None

### Prisma interaction

- `prisma.contact.delete({ where: { id } })`

### Status codes

- `200` - deleted successfully
- `401` - authentication required
- `403` - admin role required
- `500` - failed to delete contact

### Example request

```bash
curl -X DELETE http://localhost:4000/api/contacts/contact_1 \
  -H "Cookie: token=YOUR_COOKIE_VALUE"
```

### Example success response

```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### Example error response

```json
{
  "success": false,
  "error": "Failed to delete contact"
}
```

### Frontend usage examples

Fetch:

```javascript
await fetch("/api/contacts/contact_1", {
  method: "DELETE",
  credentials: "include",
});
```

Axios:

```javascript
await axios.delete("/api/contacts/contact_1", { withCredentials: true });
```

### Notes

- This route performs hard deletion.

---

## Frontend Integration Notes

### Fetch

When using cookie auth with `fetch`, always send credentials:

```javascript
fetch("/api/admin/signin", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

### Axios

Set the global client configuration once:

```javascript
axios.defaults.withCredentials = true;
```

Then call endpoints normally:

```javascript
axios.get("/api/admin/me");
```

### Multipart uploads

For file uploads, use `FormData` and do not manually set the boundary header:

```javascript
const formData = new FormData();
formData.append("file", file);

await fetch("/api/blogs/editor-image", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

## Common Frontend Mistakes

- Omitting `credentials: "include"` or `withCredentials: true`
- Using the wrong frontend origin in `CORS_ORIGINS`
- Forgetting to send `multipart/form-data` for upload routes
- Manually setting `Content-Type: multipart/form-data` in fetch instead of letting the browser set the boundary
- Expecting `/api/blogs` to return drafts; it only returns published blogs
- Expecting `/api/contacts` to be public; it is admin-only

## Common Auth Issues

- Cookie not set because the browser blocked it due to cross-site settings
- `JWT_SECRET` missing or mismatched between environments
- `ADMIN_REGISTRATION_KEY` set, but the client did not send `registrationKey`
- Token expired and the middleware returned `401 Token expired`
- Auth cookie present, but the frontend did not include credentials in the request

## Cookie Troubleshooting

- In development, `sameSite` is `Lax` unless overridden by helper configuration.
- In production, cookies are `secure` and `sameSite: None` to support cross-site browser sessions.
- If the frontend and API are on different subdomains, set the correct cookie domain in your deployment setup.
- Always use HTTPS in production; secure cookies are ignored on plain HTTP.

## Upload Troubleshooting

- Ensure `data/uploads/blogs`, `data/uploads/editor`, and `data/uploads/portfolio` exist and are writable.
- Ensure the file type matches the allowed upload MIME types.
- Send the exact field names expected by the route:
  - `thumbnail` and `cover` for blog creation/update
  - `file` for editor image uploads
  - `logo` for portfolio creation/update

## Prisma Troubleshooting

- Run `npx prisma generate` after schema changes.
- Run `npx prisma migrate dev` to apply local changes.
- Verify `DATABASE_URL` in the environment used by tests and development.
- If tests fail due to missing data, check the cleanup hooks in `tests/setup.js` and the suite-specific `beforeAll` / `afterAll` blocks.

## Windows Compatibility Notes

This repository is set up for Windows PowerShell.

- Use `npm test` rather than a bare `jest` command.
- Jest runs through `node --experimental-vm-modules`.
- Local dependencies must be installed in the project, not globally.
- `cross-env` is available if cross-platform environment injection is needed.

## Deployment Notes

- Set `NODE_ENV=production`
- Serve the API behind HTTPS
- Restrict `CORS_ORIGINS` to trusted frontend origins only
- Set a strong `JWT_SECRET`
- Store secrets in a secret manager, not in source control
- Ensure upload directories are writable in production
- Add CSRF protection if you want to harden cross-site cookie flows further
- Use a WAF or reverse-proxy rate limiter for auth and mutation endpoints

## HTTP Status Code Guide

- `200 OK` - successful read, update, or logout
- `201 Created` - successful create or signup
- `400 Bad Request` - missing or invalid input
- `401 Unauthorized` - missing, invalid, or expired authentication
- `403 Forbidden` - authenticated but not permitted, or invalid admin registration key
- `404 Not Found` - target record does not exist
- `500 Internal Server Error` - unexpected backend failure

## Test Workflow Summary

The current passing test workflow uses:

- Jest
- Babel
- Supertest
- Prisma cleanup hooks
- ESM imports
- Windows-safe `npm test`

The confirmed command is:

```bash
npm test
```

## Final Notes

This README is aligned with the current implementation and does not invent routes that do not exist. It reflects the actual controller behavior, middleware flow, upload handling, and Prisma access patterns currently used by the backend.
