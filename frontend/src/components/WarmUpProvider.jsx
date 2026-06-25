import { useEffect } from "react";
import { useApi } from "../hooks/useApi";

export default function WarmUpProvider({ children }) {
  const { warmUp } = useApi();

  useEffect(() => {
    warmUp();
  }, [warmUp]);

  return children;
}
