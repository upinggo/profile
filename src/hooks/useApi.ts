'use client';

import { useState, useEffect } from 'react';
import { envFetch } from '@/utils/HelperUtils';
import { ApiResponse } from '@/types';

interface UseApiOptions {
  enabled?: boolean;
  retry?: number;
  retryDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { enabled = true, retry = 3, retryDelay = 1000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await envFetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      // Extract data from response - handle both direct data and wrapped response
      const extractedData = result.data !== undefined ? result.data : result as unknown as T;
      setData(extractedData);
      setRetryCount(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      // Implement retry logic
      if (retryCount < retry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, enabled]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}