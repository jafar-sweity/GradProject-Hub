import { useState, useEffect, useMemo, useCallback } from "react";

interface FetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFetchData<T, P extends unknown[]>(
  fn: (...params: P) => Promise<T>,
  params: P = [] as unknown as P
): FetchDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const paramsString = JSON.stringify(params);
  const memoizedParams = useMemo(() => params, [paramsString]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...memoizedParams);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fn, memoizedParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFetchData;
