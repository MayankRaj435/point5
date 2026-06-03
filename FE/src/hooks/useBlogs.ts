import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { getBlogs } from '../api/blogs';
import type { Blog, UseBlogsOptions } from '../types/blog';

interface UseBlogsResult {
  data: Blog[];
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  retry: () => void;
}

export const useBlogs = (options: UseBlogsOptions = {}): UseBlogsResult => {
  const { enabled = true, params } = options;
  const [data, setData] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, triggerRetry] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const loadBlogs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextBlogs = await getBlogs(params, {
          signal: controller.signal,
        });

        if (!active || controller.signal.aborted) {
          return;
        }

        setData(nextBlogs);
      } catch (requestError) {
        if (
          !active ||
          controller.signal.aborted ||
          (axios.isAxiosError(requestError) && requestError.code === 'ERR_CANCELED')
        ) {
          return;
        }

        setData([]);
        setError(requestError instanceof Error ? requestError : new Error('Failed to load blog posts.'));
      } finally {
        if (active && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadBlogs();

    return () => {
      active = false;
      controller.abort();
    };
  }, [enabled, params, retryCount]);

  return {
    data,
    isLoading,
    error,
    isEmpty: !isLoading && !error && data.length === 0,
    retry: triggerRetry,
  };
};
