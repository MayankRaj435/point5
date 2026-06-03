import { Router } from "express";

import {
  createPortfolioCard,
  deletePortfolioCard,
  getAllPortfolioCards,
  getPortfolioCardById,
  updatePortfolioCard,
} from "../controllers/portfolio.controller.js";

import { authenticate, requireAdmin } from "../middlewares/authenticate.js";

import { createUploader } from "../middlewares/upload.js";

const portfolioRouter = Router();

/* ================= UPLOAD CONFIG ================= */

const uploadPortfolioLogo = createUploader("data/uploads/portfolio", [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "image/svg+xml",
]);

/* ================= PUBLIC ROUTES ================= */

portfolioRouter.get("/", getAllPortfolioCards);

portfolioRouter.get("/:id", getPortfolioCardById);

/* ================= PROTECTED ROUTES ================= */

portfolioRouter.post(
  "/",
  uploadPortfolioLogo.single("logo"),
  createPortfolioCard,
);

portfolioRouter.put(
  "/:id",
  authenticate,
  requireAdmin,
  uploadPortfolioLogo.single("logo"),
  updatePortfolioCard,
);

portfolioRouter.delete("/:id", authenticate, requireAdmin, deletePortfolioCard);

export default portfolioRouter;
