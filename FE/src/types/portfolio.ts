export type PortfolioServiceType =
  | 'BRANDING'
  | 'SOCIAL_MEDIA_MANAGEMENT'
  | 'DIGITAL_MARKETING'
  | 'BRAND_PRODUCT_SHOOTS'
  | 'WEDDING'
  | 'EVENT_PHOTOGRAPHY_VIDEOGRAPHY'
  | 'WEBSITE_DEVELOPMENT_MANAGEMENT'
  | (string & {});

export interface PortfolioCard {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  logo: string | null;
  accent: string | null;
  bg: string | null;
  deliverables: string[];
  serviceType: PortfolioServiceType;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioQueryParams {
  serviceType?: PortfolioServiceType;
  featured?: boolean;
  slug?: string;
}

export interface PortfolioHookOptions extends PortfolioQueryParams {
  enabled?: boolean;
  limit?: number;
}
