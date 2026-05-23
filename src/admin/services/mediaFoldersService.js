import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/media_folders";

export function listMediaFolders() {
  return apiGet(`${BASE_PATH}/list.php`);
}

export function createMediaFolder(data) {
  return apiPost(`${BASE_PATH}/create.php`, data);
}

export function updateMediaFolder(id, data) {
  return apiPost(`${BASE_PATH}/update.php`, { id, ...data });
}

export function deleteMediaFolder(id) {
  return apiPost(`${BASE_PATH}/delete.php`, { id });
}
