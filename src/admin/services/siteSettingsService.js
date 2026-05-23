import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/settings";

export function listSiteSettings() {
  return apiGet(`${BASE_PATH}/list.php`);
}

export function updateSiteSettings(settings) {
  return apiPost(`${BASE_PATH}/update.php`, { settings });
}
