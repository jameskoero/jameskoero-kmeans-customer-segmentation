import { useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "";
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 4000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, options = {}, retries = RETRY_COUNT) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`Attempt ${attempt} failed. Retrying...`, err.message);
      await sleep(RETRY_DELAY_MS);
    }
  }
}

export function useApi() {
  const warmUp = useCallback(async () => {
    try { await fetch(`${API_BASE}/health`); } catch (_) {}
  }, []);

  const predict = useCallback(async (payload) => {
    return await fetchWithRetry(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }, []);

  const predictBatch = useCallback(async (formData) => {
    return await fetchWithRetry(`${API_BASE}/predict/batch`, {
      method: "POST",
      body: formData,
    });
  }, []);

  return { predict, predictBatch, warmUp };
}
