import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/home_sections";

export function listHomeSectionsAdmin() {
  return apiGet(`${BASE_PATH}/list.php`);
}

export function createHomeSection(data) {
  return apiPost(`${BASE_PATH}/create.php`, data);
}

export function updateHomeSection(id, data) {
  return apiPost(`${BASE_PATH}/update.php`, { id, ...data });
}

export function deactivateHomeSection(id) {
  return apiPost(`${BASE_PATH}/delete.php`, { id });
}
