import { useState } from "react";
import { useApi } from "./ApiContext";

/**
 * Returns a function to mutate some data via the API, as well as some state
 * that tracks the response of that mutation request.
 */
export default function useMutation(method, resource, tagsToInvalidate) {
  const { request, invalidateTags } = useApi();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (body) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        typeof resource === "function" ? resource(body) : resource;
      const result = await request(endpoint, {
        method,
        body: method !== "DELETE" ? JSON.stringify(body) : undefined,
      });
      setData(result);
      invalidateTags(tagsToInvalidate);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
