import { useEffect, useState } from "react";

const useFetchEmails = <T = any>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const refetch = () => setRefetchTrigger((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Unable to fetch data from ${url}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url, refetchTrigger]);

  return { data, error, loading, refetch };
};

export default useFetchEmails;
