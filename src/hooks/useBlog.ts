import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { getBlogById } from '../api/blogs';
import type { Blog, UseBlogOptions } from '../types/blog';

interface UseBlogResult {
  data: Blog | null;
  isLoading: boolean;
  error: Error | null;
  isNotFound: boolean;
  retry: () => void;
}

export const useBlog = (id?: string | number | null, options: UseBlogOptions = {}): UseBlogResult => {
  const { enabled = true } = options;
  const [data, setData] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(enabled && Boolean(id));
  const [error, setError] = useState<Error | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [retryCount, triggerRetry] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setError(null);
      setIsNotFound(false);
      setIsLoading(false);
      return;
    }

    if (id === undefined || id === null || id === '') {
      setData(null);
      setError(null);
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const loadBlog = async () => {
      setIsLoading(true);
      setError(null);
      setIsNotFound(false);

      try {
        const nextBlog = await getBlogById(id, {
          signal: controller.signal,
        });

        if (!active || controller.signal.aborted) {
          return;
        }

        if (!nextBlog) {
          setData(null);
          setIsNotFound(true);
          return;
        }

        setData(nextBlog);
      } catch (requestError) {
        if (
          !active ||
          controller.signal.aborted ||
          (axios.isAxiosError(requestError) && requestError.code === 'ERR_CANCELED')
        ) {
          return;
        }

        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          setData(null);
          setIsNotFound(true);
          return;
        }

        setData(null);
        setError(requestError instanceof Error ? requestError : new Error('Failed to load this blog post.'));
      } finally {
        if (active && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadBlog();

    return () => {
      active = false;
      controller.abort();
    };
  }, [enabled, id, retryCount]);

  return {
    data,
    isLoading,
    error,
    isNotFound,
    retry: triggerRetry,
  };
};
