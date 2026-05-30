import { useCallback, useEffect, useState } from 'react';
import { getPortfolio } from '../api/portfolio';
import type { PortfolioCard, PortfolioHookOptions } from '../types/portfolio';

interface UsePortfolioResult {
  data: PortfolioCard[];
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  retry: () => void;
}

export const usePortfolio = (options: PortfolioHookOptions = {}): UsePortfolioResult => {
  const { enabled = true, limit, featured, serviceType, slug } = options;
  const [data, setData] = useState<PortfolioCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    getPortfolio({ featured, serviceType, slug })
      .then((items) => {
        if (!active) {
          return;
        }

        const visibleItems = typeof limit === 'number' ? items.slice(0, Math.max(limit, 0)) : items;
        setData(visibleItems);
      })
      .catch((err: unknown) => {
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Unable to fetch portfolio right now.';
        setError(message);
        setData([]);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, featured, limit, reloadKey, serviceType, slug]);

  const retry = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return {
    data,
    isLoading,
    error,
    isEmpty: !isLoading && !error && data.length === 0,
    retry,
  };
};
