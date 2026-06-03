import prisma from "../helper/pooler.js";

/* ================= HELPERS ================= */

const parseArrayField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {}

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

/* ================= GET ALL ================= */

export const getAllPortfolioCards = async (req, res) => {
  try {
    const { serviceType, featured, slug } = req.query;

    const where = {
      published: true,
    };

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (slug) {
      where.slug = slug;
    }

    if (featured === "true") {
      where.featured = true;
    }

    const cards = await prisma.portfolioCard.findMany({
      where,
      orderBy: {
        displayOrder: "asc",
      },
    });

    return res.json({
      success: true,
      cards,
    });
  } catch (err) {
    console.error("❌ Get portfolio cards failed:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch portfolio cards",
    });
  }
};

/* ================= GET SINGLE ================= */

export const getPortfolioCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await prisma.portfolioCard.findUnique({
      where: {
        id,
      },
    });

    if (!card) {
      return res.status(404).json({
        success: false,
        error: "Portfolio card not found",
      });
    }

    return res.json({
      success: true,
      card,
    });
  } catch (err) {
    console.error("❌ Get portfolio card failed:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch portfolio card",
    });
  }
};

/* ================= CREATE ================= */
export const createPortfolioCard = async (req, res) => {
  try {
    const {
      slug,
      name,
      category,
      tagline,
      description,
      accent,
      bg,
      serviceType,
      featured,
      published,
      displayOrder,
    } = req.body;

    const logoFile = req.file;

    if (
      !slug ||
      !name ||
      !category ||
      !tagline ||
      !description ||
      !serviceType
    ) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
    }

    if (!logoFile) {
      return res.status(400).json({
        success: false,
        error: "Logo image is required",
      });
    }

    const tags = parseArrayField(req.body.tags);

    const deliverables = parseArrayField(req.body.deliverables);

    const logo = `/uploads/portfolio/${logoFile.filename}`;

    const card = await prisma.portfolioCard.create({
      data: {
        slug: slug.trim(),

        name: name.trim(),

        category: category.trim(),

        tagline: tagline.trim(),

        description: description.trim(),

        accent: accent || null,

        bg: bg || null,

        serviceType,

        tags,

        deliverables,

        logo,

        featured: featured === true || featured === "true",

        published:
          published === undefined
            ? true
            : published === true || published === "true",

        displayOrder: Number(displayOrder) || 0,
      },
    });

    return res.status(201).json({
      success: true,
      card,
    });
  } catch (error) {
    console.error("❌ Portfolio create failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to create portfolio card",
    });
  }
};

/* ================= UPDATE ================= */
export const updatePortfolioCard = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;

    const {
      slug,
      name,
      category,
      tagline,
      description,
      accent,
      bg,
      serviceType,
      featured,
      published,
      displayOrder,
    } = req.body;

    // Because route uses .single("logo")
    const logoFile = req.file;

    const updateData = {};

    /* ================= STRINGS ================= */

    if (slug !== undefined) {
      updateData.slug = slug.trim();
    }

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (category !== undefined) {
      updateData.category =
        category.trim();
    }

    if (tagline !== undefined) {
      updateData.tagline =
        tagline.trim();
    }

    if (description !== undefined) {
      updateData.description =
        description.trim();
    }

    if (serviceType !== undefined) {
      updateData.serviceType =
        serviceType;
    }

    /* ================= ARRAYS ================= */

    if (req.body.tags !== undefined) {
      updateData.tags =
        parseArrayField(req.body.tags);
    }

    if (
      req.body.deliverables !== undefined
    ) {
      updateData.deliverables =
        parseArrayField(
          req.body.deliverables,
        );
    }

    /* ================= BOOLEANS ================= */

    if (featured !== undefined) {
      updateData.featured =
        featured === true ||
        featured === "true";
    }

    if (published !== undefined) {
      updateData.published =
        published === true ||
        published === "true";
    }

    /* ================= NUMBERS ================= */

    if (displayOrder !== undefined) {
      updateData.displayOrder =
        Number(displayOrder) || 0;
    }

    /* ================= OPTIONAL STYLING ================= */

    if (accent !== undefined) {
      updateData.accent =
        accent || null;
    }

    if (bg !== undefined) {
      updateData.bg = bg || null;
    }

    /* ================= FILE ================= */

    if (logoFile) {
      updateData.logo =
        `/uploads/portfolio/${logoFile.filename}`;
    }

    /* ================= UPDATE ================= */

    const card =
      await prisma.portfolioCard.update({
        where: {
          id,
        },
        data: updateData,
      });

    return res.json({
      success: true,
      message:
        "Portfolio card updated successfully",
      card,
    });
  } catch (error) {
    console.error(
      "❌ Portfolio update failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      error:
        "Failed to update portfolio card",
    });
  }
};


/* ================= DELETE ================= */

export const deletePortfolioCard = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.portfolioCard.delete({
      where: {
        id,
      },
    });

    return res.json({
      success: true,
      message: "Portfolio card deleted successfully",
    });
  } catch (err) {
    console.error("❌ Portfolio delete failed:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to delete portfolio card",
    });
  }
};
