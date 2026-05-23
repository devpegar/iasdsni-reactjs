import { getJson } from "../../../services/httpClient";

export function listGalleryAlbums({ featured = false, limit } = {}) {
  const params = new URLSearchParams();

  if (featured) params.set("featured", "1");
  if (limit) params.set("limit", String(limit));

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return getJson(`/public/gallery/albums.php${suffix}`);
}

export function getGalleryAlbum(slug) {
  return getJson(`/public/gallery/album.php?slug=${encodeURIComponent(slug)}`);
}
