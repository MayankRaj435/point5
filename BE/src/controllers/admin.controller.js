import bcrypt from "bcryptjs";
import Joi from "joi";

import { clearAuthCookie, setAuthCookie } from "../helper/authCookies.js";
import { generateToken } from "../helper/jwt.js";
import prisma from "../helper/pooler.js";

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signupSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  registrationKey: Joi.string().optional(),
});

export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, registrationKey } = req.body;

    const { error } = signupSchema.validate({
      name,
      email,
      password,
      registrationKey,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const adminCode = process.env.ADMIN_REGISTRATION_KEY;
    if (adminCode) {
      if (!registrationKey || registrationKey !== adminCode) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin registration key",
        });
      }
    } else {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
      if (existingAdmin) {
        return res.status(403).json({
          success: false,
          message:
            "Admin signup is disabled after initial setup. Set ADMIN_REGISTRATION_KEY to enable registration.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during signup",
    });
  }
};

export const signinAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate({ email, password });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin || admin.role !== "ADMIN") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("❌ Signin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutAdmin = async (req, res) => {
  try {
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({ success: true, admin });
  } catch (error) {
    console.error("❌ Me Route Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching current user",
    });
  }
};
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const adminId = Number(id);

    if (Number.isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin id",
      });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Prevent deleting yourself
    if (req.user.id === adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const adminCount = await prisma.user.count({
      where: {
        role: "ADMIN",
      },
    });

    // Prevent deleting last admin
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the last admin account",
      });
    }

    await prisma.user.delete({
      where: {
        id: adminId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting admin",
    });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("❌ Get Admins Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching admins",
    });
  }
};
