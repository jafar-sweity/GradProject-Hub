import { Alert } from "react-native";
import { useEffect, useState, useMemo } from "react";

const useFetchData = (fn, params = []) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...memoizedParams);
      setData(res);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [memoizedParams]);

  const refetch = () => fetchData();

  return { data, loading, error, refetch };
};

export default useFetchData;
