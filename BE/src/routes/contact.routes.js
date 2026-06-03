import { Router } from "express";

import {
    createContact,
    deleteContact,
    getAllContacts,
    getContactById,
} from "../controllers/contact.controller.js";

import { authenticate, requireAdmin } from "../middlewares/authenticate.js";

const contactRouter = Router();

/* ================= PUBLIC ROUTES ================= */

// Submit contact form
contactRouter.post("/", createContact);

/* ================= PROTECTED ROUTES ================= */

// Get all contacts
contactRouter.get("/", authenticate, requireAdmin, getAllContacts);

// Get single contact
contactRouter.get("/:id", authenticate, requireAdmin, getContactById);

// Delete contact
contactRouter.delete("/:id", authenticate, requireAdmin, deleteContact);

export default contactRouter;