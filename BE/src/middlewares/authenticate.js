import { extractToken, verifyToken } from "../helper/authCookies.js";
import prisma from "../helper/pooler.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const { valid, expired, payload, error } = verifyToken(token);

    if (!valid) {
      if (expired) {
        return res.status(401).json({ success: false, error: "Token expired" });
      }
      console.error("Auth verify error", error);
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    if (!payload?.id) {
      return res.status(401).json({ success: false, error: "Invalid token payload" });
    }

    const userId = Number(payload.id);
    if (Number.isNaN(userId)) {
      return res.status(401).json({ success: false, error: "Invalid user id in token" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    // Attach minimal safe user info
    req.user = { id: user.id, email: user.email, role: user.role };
    return next();
  } catch (err) {
    console.error("Auth error", err && err.message);
    return res.status(401).json({ success: false, error: "Authentication failed" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: "Authentication required" });
  if (req.user.role !== "ADMIN") return res.status(403).json({ success: false, error: "Admin role required" });
  next();
};

export default authenticate;
