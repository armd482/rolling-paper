import { useEffect, useState, useCallback } from 'react';
import { rollingTeamInstance } from 'API/APIInstance';

function useRequest({ deps = [], skip = false, options }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusCode, setStatusCode] = useState(null);

  const refetch = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: fetchedData, status } = await rollingTeamInstance({
          ...options,
          ...args,
        });
        setData(() => fetchedData);
        setStatusCode(status);
        return { data: fetchedData, status };
      } catch (err) {
        setError(() => err);
        return { error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [options?.url, options?.method, options?.data, options?.params],
  );

  useEffect(() => {
    if (skip) return;
    refetch();
  }, deps);

  return { data, isLoading, error, statusCode, fetch: refetch };
}

export default useRequest;
