import prisma from "../helper/pooler.js";

// Create contact form submission
export const createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      subject,
      projectInfo,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !subject || !projectInfo) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber || null,
        subject: subject.trim(),
        projectInfo: projectInfo.trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      contact,
    });
  } catch (err) {
    console.error("❌ Contact creation failed:");
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Failed to submit contact form",
    });
  }
};

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch contacts",
    });
  }
};

// Get single contact
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    res.json({
      success: true,
      contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch contact",
    });
  }
};

// Delete contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete contact",
    });
  }
};