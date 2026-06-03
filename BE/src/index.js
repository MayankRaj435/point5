import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";

import adminRouter from "./routes/admin.routes.js";
import blogRouter from "./routes/blog.routes.js";
import contactRouter from "./routes/contact.routes.js";
import portfolioRouter from "./routes/portfolio.routes.js";

import prisma from "./helper/pooler.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
// CORS configuration (allow credentials for cookie-based auth)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests like curl (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS origin denied"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

const uploadsPath = path.join(process.cwd(), "data", "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/contacts", contactRouter);

app.get("/health", (req, res) => res.json({ success: true, ok: true }));

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

const port = process.env.PORT || 4000;
let server;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

const shutdown = async (signal) => {
  console.log(`Received ${signal}, shutting down...`);
  try {
    await prisma.$disconnect();
    if (server) {
      server.close(() => process.exit(0));
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error("Error during shutdown", error);
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => shutdown(signal)),
);

export default app;
