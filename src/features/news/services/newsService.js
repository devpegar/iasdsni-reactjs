import { getJson } from "../../../services/httpClient";

export function listNews(limit = 6) {
  return getJson(`/public/content/list.php?type=news&limit=${encodeURIComponent(limit)}`);
}
