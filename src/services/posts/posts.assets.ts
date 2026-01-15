const ASSETS_URL = import.meta.env.VITE_ASSETS_URL ?? "http://localhost:3000";

export function resolveCover(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${ASSETS_URL}${url}`;
}
