import { apiGet, apiPost, apiPostForm } from "../../services/api";

const BASE_PATH = "/admin/media";

export function listMediaFiles() {
  return apiGet(`${BASE_PATH}/list.php`);
}

export function uploadMediaFile(data) {
  return apiPostForm(`${BASE_PATH}/upload.php`, data);
}

export function updateMediaFile(id, data) {
  return apiPost(`${BASE_PATH}/update.php`, { id, ...data });
}

export function deleteMediaFile(id) {
  return apiPost(`${BASE_PATH}/delete.php`, { id });
}
