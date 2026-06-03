// src/api/contact.ts

import axiosInstance from "../lib/axiosInstance";

/* =========================================================
   TYPES
========================================================= */

export interface Contact {
  id: string;

  fullName?: string;

  email?: string;

  phoneNumber?: string;

  subject?: string;

  projectInfo?: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface CreateContactPayload {
  fullName: string;

  email: string;

  phoneNumber?: string;

  subject: string;

  projectInfo: string;
}

/* =========================================================
   HELPERS
========================================================= */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toOptionalString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const toOptionalDate = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

/* =========================================================
   NORMALIZER
========================================================= */

const normalizeContact = (value: unknown): Contact | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = toOptionalString(value.id);

  if (!id) {
    return null;
  }

  return {
    id,

    fullName: toOptionalString(value.fullName),

    email: toOptionalString(value.email),

    phoneNumber: toOptionalString(value.phoneNumber),

    subject: toOptionalString(value.subject),

    projectInfo: toOptionalString(value.projectInfo),

    createdAt: toOptionalDate(value.createdAt),

    updatedAt: toOptionalDate(value.updatedAt),
  };
};

/* =========================================================
   EXTRACT COLLECTION
========================================================= */

const extractCollection = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const key of ["contacts", "items", "results", "data", "payload"]) {
    const nested = extractCollection(value[key]);

    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

/* =========================================================
   EXTRACT OBJECT
========================================================= */

const extractObject = (value: unknown): unknown | null => {
  if (isRecord(value) && "id" in value) {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const key of ["contact", "data", "result", "item", "payload"]) {
    const nested = extractObject(value[key]);

    if (nested) {
      return nested;
    }
  }

  return null;
};

/* =========================================================
   CREATE CONTACT
========================================================= */

export const createContact = async (payload: CreateContactPayload) => {
  const response = await axiosInstance.post("/contacts", payload);

  return response.data;
};

/* =========================================================
   GET ALL CONTACTS
========================================================= */

export const getContacts = async (): Promise<Contact[]> => {
  const response = await axiosInstance.get("/contacts");

  return extractCollection(response.data)
    .map((item) => normalizeContact(item))
    .filter((item): item is Contact => Boolean(item));
};

/* =========================================================
   GET SINGLE CONTACT
========================================================= */

export const getContactById = async (id: string): Promise<Contact | null> => {
  const response = await axiosInstance.get(`/contacts/${id}`);

  return normalizeContact(extractObject(response.data) ?? response.data);
};

/* =========================================================
   DELETE CONTACT
========================================================= */

export const deleteContact = async (id: string) => {
  const response = await axiosInstance.delete(`/contacts/${id}`);

  return response.data;
};
