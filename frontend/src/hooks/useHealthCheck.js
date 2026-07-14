import { useState, useEffect } from "react";
import api from "../services/api";

function useHealthCheck() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/health")
      .then((response) => {
        setStatus(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { status, loading, error };
}

export default useHealthCheck;
