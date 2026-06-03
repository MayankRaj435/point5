import { Router } from "express";

import {
  getMe,
  logoutAdmin,
  signinAdmin,
  signupAdmin,
  deleteAdmin,
  getAllAdmins,
} from "../controllers/admin.controller.js";
import { authenticate, requireAdmin } from "../middlewares/authenticate.js";
import { signinRateLimiter } from "../middlewares/rateLimiter.js";

const adminRouter = Router();

adminRouter.post("/signup", authenticate, requireAdmin, signupAdmin);

adminRouter.post("/signin", signinRateLimiter, signinAdmin);

adminRouter.post("/logout", authenticate, requireAdmin, logoutAdmin);

adminRouter.get("/me", authenticate, requireAdmin, getMe);

adminRouter.get("/", authenticate, requireAdmin, getAllAdmins);

adminRouter.delete("/:id", authenticate, requireAdmin, deleteAdmin);

export default adminRouter;
