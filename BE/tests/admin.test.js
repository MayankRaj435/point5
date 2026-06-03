import request from "supertest";

import prisma from "../src/helper/pooler.js";
import app from "../src/index.js";

describe("Admin Authentication API", () => {
  const adminData = {
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    registrationKey: process.env.ADMIN_REGISTRATION_KEY,
  };

  let authCookie;

  /* =========================================================
     CLEANUP
  ========================================================= */

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: adminData.email,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: adminData.email,
      },
    });
  });

  /* =========================================================
     SIGNUP TESTS
  ========================================================= */

  describe("POST /api/admin/signup", () => {
    test("should fail with missing email", async () => {
      const response = await request(app)
        .post("/api/admin/signup")
        .send({
          password: "password123",
        });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should fail with invalid email", async () => {
      const response = await request(app)
        .post("/api/admin/signup")
        .send({
          email: "invalid-email",
          password: "password123",
        });

      expect(response.statusCode).toBe(400);
    });

    test("should fail with short password", async () => {
      const response = await request(app)
        .post("/api/admin/signup")
        .send({
          email: "test@test.com",
          password: "123",
        });

      expect(response.statusCode).toBe(400);
    });

    test("should fail with invalid registration key", async () => {
      if (!process.env.ADMIN_REGISTRATION_KEY) return;

      const response = await request(app)
        .post("/api/admin/signup")
        .send({
          ...adminData,
          email: "wrongkey@test.com",
          registrationKey: "wrong-key",
        });

      expect(response.statusCode).toBe(403);

      expect(response.body.success).toBe(false);
    });

    test("should create admin successfully", async () => {
      const response = await request(app)
        .post("/api/admin/signup")
        .send(adminData);

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.admin.email).toBe(adminData.email);

      expect(response.headers["set-cookie"]).toBeDefined();
    });

    test("should fail for duplicate email", async () => {
      const response = await request(app)
        .post("/api/admin/signup")
        .send(adminData);

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  /* =========================================================
     SIGNIN TESTS
  ========================================================= */

  describe("POST /api/admin/signin", () => {
    test("should fail with missing credentials", async () => {
      const response = await request(app)
        .post("/api/admin/signin")
        .send({});

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should fail with invalid email", async () => {
      const response = await request(app)
        .post("/api/admin/signin")
        .send({
          email: "wrong@test.com",
          password: "password123",
        });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test("should fail with wrong password", async () => {
      const response = await request(app)
        .post("/api/admin/signin")
        .send({
          email: adminData.email,
          password: "wrongpassword",
        });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test("should signin successfully", async () => {
      const response = await request(app)
        .post("/api/admin/signin")
        .send({
          email: adminData.email,
          password: adminData.password,
        });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.admin.email).toBe(adminData.email);

      expect(response.headers["set-cookie"]).toBeDefined();

      authCookie = response.headers["set-cookie"];
    });
  });

  /* =========================================================
     GET CURRENT USER
  ========================================================= */

  describe("GET /api/admin/me", () => {
    test("should reject unauthenticated request", async () => {
      const response = await request(app).get("/api/admin/me");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should get current admin", async () => {
      const response = await request(app)
        .get("/api/admin/me")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.admin.email).toBe(adminData.email);
    });
  });

  /* =========================================================
     LOGOUT
  ========================================================= */

  describe("POST /api/admin/logout", () => {
    test("should reject unauthenticated logout", async () => {
      const response = await request(app)
        .post("/api/admin/logout");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/admin/logout")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);
    });
  });
});