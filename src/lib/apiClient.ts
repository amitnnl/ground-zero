/**
 * Universal safe JSON fetcher to prevent "Unexpected token '<', '<!DOCTYPE '... is not valid JSON"
 * when hitting endpoints during dev compile, 404s, or server reloads.
 */

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ ok: boolean; data: T | null; error?: string }> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      let errorMsg = `Request failed with status ${res.status}`;
      if (contentType.includes("application/json")) {
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch {
          // ignore parse error on error response
        }
      }
      return { ok: false, data: null, error: errorMsg };
    }

    if (!contentType.includes("application/json")) {
      return {
        ok: false,
        data: null,
        error: `Expected JSON but received ${contentType || "non-JSON"}`,
      };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return {
      ok: false,
      data: null,
      error: err?.message || "Network request failed",
    };
  }
}

export async function safeResponseJson<T = any>(res: Response): Promise<T | null> {
  if (!res.ok) return null;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
