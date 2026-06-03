// src/api/portfolio.ts

import {
  normalizePortfolioCollection,
  normalizePortfolioSingle,
} from "../data/portfolio";

import axiosInstance from "../lib/axiosInstance";

import type { PortfolioCard, PortfolioQueryParams } from "../types/portfolio";

/* =========================================================
   PUBLIC APIs
========================================================= */

export async function getPortfolio(
  params?: PortfolioQueryParams,
): Promise<PortfolioCard[]> {
  const response = await axiosInstance.get("/portfolio", {
    params,
  });

  return normalizePortfolioCollection(response.data);
}

export async function getPortfolioCardById(
  id: string | number,
): Promise<PortfolioCard | null> {
  const response = await axiosInstance.get(`/portfolio/${id}`);

  return normalizePortfolioSingle(response.data?.card);
}

export async function getPortfolioCardBySlug(
  slug: string,
): Promise<PortfolioCard | null> {
  const response = await axiosInstance.get("/portfolio", {
    params: {
      slug,
    },
  });

  return normalizePortfolioCollection(response.data)[0] ?? null;
}

/* =========================================================
   ADMIN PAYLOAD TYPES
========================================================= */

export interface CreatePortfolioPayload {
  name: string;

  slug: string;

  category: string;

  tagline: string;

  description: string;

  accent?: string;

  bg?: string;

  deliverables?: string[];

  serviceType: string;

  featured?: boolean;

  published?: boolean;

  displayOrder?: number;

  tags?: string[];

  logo?: File | null;
}

export interface UpdatePortfolioPayload {
  name?: string;

  slug?: string;

  category?: string;

  tagline?: string;

  description?: string;

  accent?: string;

  bg?: string;

  deliverables?: string[];

  serviceType?: string;

  featured?: boolean;

  published?: boolean;

  displayOrder?: number;

  tags?: string[];

  logo?: File | null;
}

/* =========================================================
   HELPERS
========================================================= */

const appendIfDefined = (formData: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) {
    return;
  }

  formData.append(key, String(value));
};

const appendArray = (formData: FormData, key: string, values?: string[]) => {
  if (!values?.length) {
    return;
  }

  values.forEach((value) => {
    formData.append(key, value);
  });
};

/* =========================================================
   GET ALL PORTFOLIO CARDS
========================================================= */

export async function getPortfolioCards(): Promise<PortfolioCard[]> {
  const response = await axiosInstance.get("/portfolio");

  return normalizePortfolioCollection(response.data);
}

/* =========================================================
   CREATE PORTFOLIO CARD
========================================================= */

export async function createPortfolioCard(payload: CreatePortfolioPayload) {
  const formData = new FormData();

  formData.append("name", payload.name);

  formData.append("slug", payload.slug);

  formData.append("category", payload.category);

  formData.append("tagline", payload.tagline);

  formData.append("description", payload.description);

  formData.append("serviceType", payload.serviceType);

  appendIfDefined(formData, "accent", payload.accent);

  appendIfDefined(formData, "bg", payload.bg);

  appendIfDefined(formData, "featured", payload.featured);

  appendIfDefined(formData, "published", payload.published);

  appendIfDefined(formData, "displayOrder", payload.displayOrder);

  appendArray(formData, "deliverables", payload.deliverables);

  appendArray(formData, "tags", payload.tags);

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  const response = await axiosInstance.post("/portfolio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/* =========================================================
   UPDATE PORTFOLIO CARD
========================================================= */

export async function updatePortfolioCard(
  id: string | number,
  payload: UpdatePortfolioPayload,
) {
  const formData = new FormData();

  appendIfDefined(formData, "name", payload.name);

  appendIfDefined(formData, "slug", payload.slug);

  appendIfDefined(formData, "category", payload.category);

  appendIfDefined(formData, "tagline", payload.tagline);

  appendIfDefined(formData, "description", payload.description);

  appendIfDefined(formData, "accent", payload.accent);

  appendIfDefined(formData, "bg", payload.bg);

  appendIfDefined(formData, "serviceType", payload.serviceType);

  appendIfDefined(formData, "featured", payload.featured);

  appendIfDefined(formData, "published", payload.published);

  appendIfDefined(formData, "displayOrder", payload.displayOrder);

  appendArray(formData, "deliverables", payload.deliverables);

  appendArray(formData, "tags", payload.tags);

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }

  const response = await axiosInstance.put(`/portfolio/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/* =========================================================
   DELETE PORTFOLIO CARD
========================================================= */

export async function deletePortfolioCard(id: string | number) {
  const response = await axiosInstance.delete(`/portfolio/${id}`);

  return response.data;
}
