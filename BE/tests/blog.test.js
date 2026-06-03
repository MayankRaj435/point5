import request from "supertest";
import prisma from "../src/helper/pooler.js";
import app from "../src/index.js";
import {
    cleanTestUser,
    ensureTempFile,
    getAdminAuthCookie,
    removeTempFile,
    removeUploadFiles,
    testImagePath,
} from "./testUtils.js";

describe("Blog API", () => {
  const tempImagePath = testImagePath("temp-image.png");
  const uploadedFiles = [];

  let authCookie;
  let createdBlogId;
  let testAdminEmail;

  beforeAll(async () => {
    ensureTempFile(tempImagePath);

    const authResult = await getAdminAuthCookie(app, {
      email: `blog-admin-${Date.now()}@example.com`,
      password: "Password123!",
    });

    authCookie = authResult.authCookie;
    testAdminEmail = authResult.email;
  });

  afterAll(async () => {
    if (createdBlogId) {
      await prisma.blog.deleteMany({ where: { id: createdBlogId } });
    }

    removeUploadFiles(uploadedFiles);
    removeTempFile(tempImagePath);
    await cleanTestUser(testAdminEmail);
  });

  describe("GET /api/blogs", () => {
    test("should fetch all blogs", async () => {
      const response = await request(app).get("/api/blogs");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.blogs)).toBe(true);
    });
  });

  describe("GET /api/blogs/:id", () => {
    test("should fail for invalid id", async () => {
      const response = await request(app).get("/api/blogs/invalid");

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should return 404 for non existing blog", async () => {
      const response = await request(app).get("/api/blogs/999999");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/blogs", () => {
    test("should reject unauthenticated request", async () => {
      const response = await request(app)
        .post("/api/blogs")
        .field("title", "Unauthorized Blog")
        .field("content", "Unauthorized Content");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should fail without title", async () => {
      const response = await request(app)
        .post("/api/blogs")
        .set("Cookie", authCookie)
        .field("content", "No title")
        .attach("thumbnail", tempImagePath)
        .attach("cover", tempImagePath);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should fail without images", async () => {
      const response = await request(app)
        .post("/api/blogs")
        .set("Cookie", authCookie)
        .field("title", "Missing Images")
        .field("content", "Test content");

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should create blog successfully", async () => {
      const response = await request(app)
        .post("/api/blogs")
        .set("Cookie", authCookie)
        .field("title", "Test Blog")
        .field("content", "Test Content")
        .field("published", "true")
        .attach("thumbnail", tempImagePath)
        .attach("cover", tempImagePath);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.blog).toHaveProperty("id");

      createdBlogId = response.body.blog.id;
      uploadedFiles.push(response.body.blog.thumbnail, response.body.blog.cover);
    });
  });

  describe("GET created blog", () => {
    test("should fetch created blog", async () => {
      const response = await request(app).get(`/api/blogs/${createdBlogId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.blog.id).toBe(createdBlogId);
    });
  });

  describe("PUT /api/blogs/:id", () => {
    test("should reject unauthenticated update", async () => {
      const response = await request(app)
        .put(`/api/blogs/${createdBlogId}`)
        .field("title", "Updated");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should update blog title", async () => {
      const response = await request(app)
        .put(`/api/blogs/${createdBlogId}`)
        .set("Cookie", authCookie)
        .field("title", "Updated Blog Title");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.blog.title).toBe("Updated Blog Title");
    });

    test("should update blog images", async () => {
      const response = await request(app)
        .put(`/api/blogs/${createdBlogId}`)
        .set("Cookie", authCookie)
        .attach("thumbnail", tempImagePath)
        .attach("cover", tempImagePath);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      uploadedFiles.push(response.body.blog.thumbnail, response.body.blog.cover);
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    test("should reject unauthenticated delete", async () => {
      const response = await request(app).delete(`/api/blogs/${createdBlogId}`);

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should fail with invalid id", async () => {
      const response = await request(app)
        .delete("/api/blogs/invalid")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(400);
    });

    test("should delete blog successfully", async () => {
      const response = await request(app)
        .delete(`/api/blogs/${createdBlogId}`)
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("POST /api/blogs/editor-image", () => {
    test("should reject unauthenticated upload", async () => {
      const response = await request(app)
        .post("/api/blogs/editor-image")
        .send({});

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should fail without file", async () => {
      const response = await request(app)
        .post("/api/blogs/editor-image")
        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should upload editor image successfully", async () => {
      const response = await request(app)
        .post("/api/blogs/editor-image")
        .set("Cookie", authCookie)
        .attach("file", tempImagePath);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.result)).toBe(true);

      if (Array.isArray(response.body.result) && response.body.result[0]?.url) {
        uploadedFiles.push(response.body.result[0].url);
      }
    });
  });
});
