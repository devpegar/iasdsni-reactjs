import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/navigation";

export function listNavigationItems() {
  return apiGet(`${BASE_PATH}/list.php`);
}

export function createNavigationItem(data) {
  return apiPost(`${BASE_PATH}/create.php`, data);
}

export function updateNavigationItem(id, data) {
  return apiPost(`${BASE_PATH}/update.php`, { id, ...data });
}

export function deactivateNavigationItem(id) {
  return apiPost(`${BASE_PATH}/delete.php`, { id });
}
