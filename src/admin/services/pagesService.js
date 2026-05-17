import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/pages";

export function listPages(query = "") {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiGet(`${BASE_PATH}/list.php${suffix}`);
}

export function createPage(data) {
  return apiPost(`${BASE_PATH}/create.php`, data);
}

export function updatePage(id, data) {
  return apiPost(`${BASE_PATH}/update.php`, { id, ...data });
}

export function deactivatePage(id) {
  return apiPost(`${BASE_PATH}/delete.php`, { id });
}
