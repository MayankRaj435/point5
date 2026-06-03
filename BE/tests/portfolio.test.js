import request from "supertest";

import prisma from "../src/helper/pooler.js";
import app from "../src/index.js";

import {
    cleanTestUser,
    ensureTempFile,
    getAdminAuthCookie,
    removeTempFile,
    removeUploadFile,
    testImagePath,
} from "./testUtils.js";

const portfolioData = {
  name: "Acme Inc",

  slug: `acme-${Date.now()}`,

  tagline: "We build amazing products",

  description: "Portfolio description for testing",

  category: "Technology",

  serviceType: "BRANDING",

  featured: "true",

  published: "true",

  displayOrder: "1",

  accent: "#C9A84C",

  bg: "from-[#1a1508] to-[#0d0d0d]",

  tags: JSON.stringify(["React", "Node", "Design"]),

  deliverables: JSON.stringify([
    "Logo Design",
    "Brand Guidelines",
    "Typography System",
  ]),
};

describe("Portfolio API", () => {
  const tempLogoPath = testImagePath("temp-logo.png");

  let authCookie;

  let createdCardId;

  let createdLogoUrl;

  let testAdminEmail;

  /* ================= SETUP ================= */

  beforeAll(async () => {
    ensureTempFile(tempLogoPath);

    const authResult = await getAdminAuthCookie(app, {
      email: `portfolio-admin-${Date.now()}@example.com`,

      password: "Password123!",
    });

    authCookie = authResult.authCookie;

    testAdminEmail = authResult.email;
  });

  /* ================= CLEANUP ================= */

  afterAll(async () => {
    if (createdCardId) {
      await prisma.portfolioCard.deleteMany({
        where: {
          id: createdCardId,
        },
      });
    }

    removeUploadFile(createdLogoUrl);

    removeTempFile(tempLogoPath);

    await cleanTestUser(testAdminEmail);
  });

  /* ================= GET ALL ================= */

  describe("GET /api/portfolio", () => {
    test("should fetch all portfolio cards", async () => {
      const response = await request(app).get("/api/portfolio");

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.cards)).toBe(true);
    });

    test("should filter by featured=true", async () => {
      const response = await request(app).get("/api/portfolio?featured=true");

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);
    });

    test("should filter by serviceType", async () => {
      const response = await request(app).get(
        "/api/portfolio?serviceType=BRANDING",
      );

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.cards)).toBe(true);
    });
  });

  /* ================= CREATE ================= */

  describe("POST /api/portfolio", () => {
    test("should reject unauthenticated request", async () => {
      const response = await request(app)
        .post("/api/portfolio")
          .field("name", "Unauthorized");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should fail with missing fields", async () => {
      const response = await request(app)
        .post("/api/portfolio")
        .set("Cookie", authCookie)
          .field("name", "Only Name");

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should fail without logo", async () => {
      const response = await request(app)
        .post("/api/portfolio")
        .set("Cookie", authCookie)

        .field("name", portfolioData.name)

        .field("slug", portfolioData.slug)

        .field("tagline", portfolioData.tagline)

        .field("description", portfolioData.description)

        .field("category", portfolioData.category)

        .field("serviceType", portfolioData.serviceType);

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test("should create portfolio card successfully", async () => {
      const response = await request(app)
        .post("/api/portfolio")

        .set("Cookie", authCookie)

        .field("name", portfolioData.name)

        .field("slug", portfolioData.slug)

        .field("tagline", portfolioData.tagline)

        .field("description", portfolioData.description)

        .field("category", portfolioData.category)

        .field("serviceType", portfolioData.serviceType)

        .field("featured", portfolioData.featured)

        .field("published", portfolioData.published)

        .field("displayOrder", portfolioData.displayOrder)

        .field("accent", portfolioData.accent)

        .field("bg", portfolioData.bg)

        .field("tags", portfolioData.tags)

        .field("deliverables", portfolioData.deliverables)

        .attach("logo", tempLogoPath);

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.card).toHaveProperty("id");

      expect(response.body.card.slug).toBe(portfolioData.slug);

      createdCardId = response.body.card.id;

      createdLogoUrl = response.body.card.logo;
    });
  });

  /* ================= FETCH CREATED ================= */

  describe("GET created portfolio card", () => {
    test("should fetch created card", async () => {
      const response = await request(app).get(
        `/api/portfolio/${createdCardId}`,
      );

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.card.id).toBe(createdCardId);
    });
  });

  /* ================= UPDATE ================= */

  describe("PUT /api/portfolio/:id", () => {
    test("should reject unauthenticated update", async () => {
      const response = await request(app)
        .put(`/api/portfolio/${createdCardId}`)

        .field("name", "Updated");

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should update portfolio card", async () => {
      const response = await request(app)
        .put(`/api/portfolio/${createdCardId}`)

        .set("Cookie", authCookie)

        .field("name", "Updated Company")

        .field("tagline", "Updated Tagline")

        .field("featured", "false")

        .field("tags", JSON.stringify(["Updated", "Tags"]))

        .field("deliverables", JSON.stringify(["Updated Deliverable"]));

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.card.name).toBe("Updated Company");
    });

    test("should update logo", async () => {
      const response = await request(app)
        .put(`/api/portfolio/${createdCardId}`)

        .set("Cookie", authCookie)

        .attach("logo", tempLogoPath);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      createdLogoUrl = response.body.card.logo;
    });
  });

  /* ================= DELETE ================= */

  describe("DELETE /api/portfolio/:id", () => {
    test("should reject unauthenticated delete", async () => {
      const response = await request(app).delete(
        `/api/portfolio/${createdCardId}`,
      );

      expect([401, 403]).toContain(response.statusCode);
    });

    test("should delete portfolio card", async () => {
      const response = await request(app)
        .delete(`/api/portfolio/${createdCardId}`)

        .set("Cookie", authCookie);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);
    });
  });
});
