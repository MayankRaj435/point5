import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

export function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}
