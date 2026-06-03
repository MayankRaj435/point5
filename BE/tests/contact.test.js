import request from "supertest";
import prisma from "../src/helper/pooler.js";
import app from "../src/index.js";
import { cleanTestUser, getAdminAuthCookie } from "./testUtils.js";

describe("Contact API", () => {
  const contactEmail = `contact-${Date.now()}@example.com`;
  const contactData = {
    fullName: "Test User",
    email: contactEmail,
    phoneNumber: "1234567890",
    subject: "Test Contact",
    projectInfo: "Testing contact submission",
  };

  let createdContactId;
  let authCookie;
  let testAdminEmail;

  beforeAll(async () => {
    const authResult = await getAdminAuthCookie(app, {
      email: `contact-admin-${Date.now()}@example.com`,
      password: "Password123!",
    });

    authCookie = authResult.authCookie;
    testAdminEmail = authResult.email;

    await prisma.contact.deleteMany({ where: { email: contactEmail.toLowerCase() } });
  });

  afterAll(async () => {
    if (createdContactId) {
      await prisma.contact.deleteMany({ where: { id: createdContactId } });
    }

    await prisma.contact.deleteMany({ where: { email: contactEmail.toLowerCase() } });
    await cleanTestUser(testAdminEmail);
  });

  test("should create contact submission successfully", async () => {
    const response = await request(app).post("/api/contacts").send(contactData);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.contact).toHaveProperty("id");
    expect(response.body.contact.email).toBe(contactEmail.toLowerCase());

    createdContactId = response.body.contact.id;
  });

  test("should fail when required fields are missing", async () => {
    const response = await request(app).post("/api/contacts").send({ fullName: "Only Name" });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("should reject unauthenticated access to contacts list", async () => {
    const response = await request(app).get("/api/contacts");

    expect([401, 403]).toContain(response.statusCode);
  });

  test("should fetch contacts as admin", async () => {
    const response = await request(app)
      .get("/api/contacts")
      .set("Cookie", authCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.contacts)).toBe(true);
  });

  test("should fetch contact by id as admin", async () => {
    const response = await request(app)
      .get(`/api/contacts/${createdContactId}`)
      .set("Cookie", authCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.contact.id).toBe(createdContactId);
  });

  test("should delete contact successfully", async () => {
    const response = await request(app)
      .delete(`/api/contacts/${createdContactId}`)
      .set("Cookie", authCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
