import { getJson } from "../../../services/httpClient";

export async function getPublicPage(slug) {
  return getJson(`/public/pages/get.php?slug=${encodeURIComponent(slug)}`);
}
