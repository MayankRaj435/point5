export interface Blog {
  id: number;
  title: string;
  content?: string;
  excerpt?: string;
  thumbnail?: string;
  cover?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogListQueryParams {
  published?: boolean;
  limit?: number;
  page?: number;
  search?: string;
}

export interface BlogRequestOptions {
  signal?: AbortSignal;
}

export interface UseBlogsOptions {
  enabled?: boolean;
  params?: BlogListQueryParams;
}

export interface UseBlogOptions {
  enabled?: boolean;
}
