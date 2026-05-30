import { useCallback, useEffect, useState } from 'react';
import { getPortfolioCardById, getPortfolioCardBySlug } from '../api/portfolio';
import type { PortfolioCard } from '../types/portfolio';

interface UsePortfolioCardOptions {
  id?: string;
  slug?: string;
  enabled?: boolean;
}

interface UsePortfolioCardResult {
  data: PortfolioCard | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export const usePortfolioCard = ({ id, slug, enabled = true }: UsePortfolioCardOptions): UsePortfolioCardResult => {
  const [data, setData] = useState<PortfolioCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled && Boolean(id || slug));
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled || (!id && !slug)) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    const request = id ? getPortfolioCardById(id) : getPortfolioCardBySlug(String(slug));

    request
      .then((card) => {
        if (active) {
          setData(card);
        }
      })
      .catch((err: unknown) => {
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Unable to load this portfolio card.';
        setError(message);
        setData(null);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, id, reloadKey, slug]);

  const retry = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  return {
    data,
    isLoading,
    error,
    retry,
  };
};
