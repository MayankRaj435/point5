import request from "supertest";
import app from "../src/index.js";

describe("Health API", () => {
  test("GET /health", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      success: true,
      ok: true,
    });
  });
});