import type { PortfolioCard } from '../types/portfolio';

type UnknownRecord = Record<string, unknown>;

export const PORTFOLIO_COPY = {
  heading: 'Selected Case Studies',
  description:
    'A curated portfolio section connected directly to live API data. This collection is fully data-driven and future-ready for CMS expansion.',
  loadingLabel: 'Loading...',
  emptyTitle: 'Case studies coming soon.',
  emptyFallback: 'We are currently updating this section. Check back shortly for fresh projects and published case studies.',
  errorTitle: 'Unable to load projects',
  errorFallback: 'We could not load the portfolio right now. Please try again in a moment.',
} as const;

const portfolioImportMeta = import.meta as ImportMeta & {
  env?: {
    VITE_BACKEND_URL?: string;
  };
};

export const PORTFOLIO_IMAGE_ORIGIN = portfolioImportMeta.env?.VITE_BACKEND_URL?.replace(/\/$/, '') ?? '';

const toArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const asString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);

const asNumber = (value: unknown, fallback = 0): number => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

const asBoolean = (value: unknown, fallback = false): boolean => (typeof value === 'boolean' ? value : fallback);

function extractItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as UnknownRecord;

  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.results)) return record.results;
  if (Array.isArray(record.cards)) return record.cards;
  if (Array.isArray(record.portfolioCards)) return record.portfolioCards;
  if (Array.isArray(record.portfolios)) return record.portfolios;
  if (Array.isArray(record.data)) return record.data;

  if (record.data && typeof record.data === 'object') {
    const nestedData = record.data as UnknownRecord;

    if (Array.isArray(nestedData.cards)) return nestedData.cards;
    if (Array.isArray(nestedData.portfolioCards)) return nestedData.portfolioCards;
    if (Array.isArray(nestedData.portfolios)) return nestedData.portfolios;
    if (Array.isArray(nestedData.items)) return nestedData.items;
    if (Array.isArray(nestedData.results)) return nestedData.results;
  }

  return [];
}

export function normalizePortfolioCard(raw: unknown): PortfolioCard {
  const item = (raw ?? {}) as UnknownRecord;

  return {
    id: asString(item.id, asString(item.slug)),
    slug: asString(item.slug, asString(item.id)),
    name: asString(item.name, 'Untitled Project'),
    category: asString(item.category, 'General'),
    tagline: asString(item.tagline, 'Case study coming soon'),
    description: asString(item.description, 'We are currently updating this section.'),
    logo: asString(item.logo) || null,
    accent: typeof item.accent === 'string' ? item.accent : null,
    bg: typeof item.bg === 'string' ? item.bg : null,
    deliverables: toArray(item.deliverables).filter((entry): entry is string => typeof entry === 'string'),
    serviceType: asString(item.serviceType, 'BRANDING'),
    featured: asBoolean(item.featured, false),
    published: asBoolean(item.published, true),
    displayOrder: asNumber(item.displayOrder, 0),
    tags: toArray(item.tags).filter((entry): entry is string => typeof entry === 'string'),
    createdAt: asString(item.createdAt),
    updatedAt: asString(item.updatedAt),
  };
}

export function normalizePortfolioCollection(payload: unknown): PortfolioCard[] {
  return extractItems(payload)
    .map((entry) => normalizePortfolioCard(entry))
    .filter((entry) => Boolean(entry.slug));
}

export function normalizePortfolioSingle(payload: unknown): PortfolioCard | null {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    return payload.length > 0 ? normalizePortfolioCard(payload[0]) : null;
  }

  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const record = payload as UnknownRecord;

    if (record.data && !Array.isArray(record.data)) {
      return normalizePortfolioCard(record.data);
    }
  }

  return normalizePortfolioCard(payload);
}

export function getPortfolioImageSrc(path?: string | null): string | null {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${PORTFOLIO_IMAGE_ORIGIN}${path}`;
}

export function getPortfolioMonogram(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatPortfolioCount(count: number): string {
  return `${count} project${count === 1 ? '' : 's'}`;
}