import fs from "fs";
import path from "path";
import request from "supertest";
import prisma from "../src/helper/pooler.js";

export const testImagePath = (filename) =>
  path.join(process.cwd(), "tests", filename);

export async function getAdminAuthCookie(app, options = {}) {
  const email = options.email || `admin-${Date.now()}@example.com`;
  const password = options.password || "Password123!";
  const name = options.name || "Test Admin";

  const signInResponse = await request(app)
    .post("/api/admin/signin")
    .send({ email, password });

  if (signInResponse.statusCode === 200 && signInResponse.headers["set-cookie"]) {
    return {
      authCookie: signInResponse.headers["set-cookie"],
      email,
      password,
    };
  }

  const signUpResponse = await request(app)
    .post("/api/admin/signup")
    .send({ email, password, name, registrationKey: process.env.ADMIN_REGISTRATION_KEY });

  if (![200, 201].includes(signUpResponse.statusCode)) {
    throw new Error(
      `Unable to create or sign in test admin: ${signUpResponse.statusCode} ${JSON.stringify(
        signUpResponse.body,
      )}`,
    );
  }

  return {
    authCookie: signUpResponse.headers["set-cookie"],
    email,
    password,
  };
}

export async function cleanTestUser(email) {
  if (!email) return;
  await prisma.user.deleteMany({ where: { email } });
}

export function ensureTempFile(filePath, contents = "fake-image") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, contents);
  }
}

export function removeTempFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function removeUploadFile(url) {
  if (!url || typeof url !== "string") return;
  const filepath = path.join(process.cwd(), url.replace(/^\//, ""));
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

export function removeUploadFiles(urls) {
  if (!Array.isArray(urls)) return;
  urls.forEach(removeUploadFile);
}
