import { env } from "../config/env";

export function resolveMediaUrl(url) {
  if (!url) return "";

  const value = String(url).trim();

  if (!value) return "";

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    const baseUrl = env.apiUrl;
    const normalizedPath = value.startsWith("/") ? value : `/${value}`;

    if (!baseUrl) {
      return normalizedPath;
    }

    return `${baseUrl}${normalizedPath}`;
  }

  return value;
}
