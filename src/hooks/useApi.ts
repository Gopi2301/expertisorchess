import { useState, useEffect, useCallback } from 'react';
import type { PaginationParams } from '../types';

interface UseApiOptions<T> {
  fetcher: (params?: PaginationParams) => Promise<{ data: T[]; meta?: any }>;
  initialParams?: PaginationParams;
  autoFetch?: boolean;
}

export function useApi<T>({ fetcher, initialParams, autoFetch = true }: UseApiOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PaginationParams>(initialParams ?? { page: 1, limit: 20 });

  const fetch = useCallback(async (overrideParams?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const p = overrideParams ?? params;
      const result = await fetcher(p);
      setData(result.data);
      if (result.meta) setMeta(result.meta);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [fetcher, params]);

  useEffect(() => {
    if (autoFetch) fetch();
  }, [fetch, autoFetch]);

  const updateParams = (newParams: Partial<PaginationParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return { data, meta, loading, error, refetch: fetch, params, updateParams };
}
