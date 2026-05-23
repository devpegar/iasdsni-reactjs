import { apiGet, apiPost } from "../../services/api";

const BASE_PATH = "/admin/gallery";

export function listGalleryAlbumsAdmin() {
  return apiGet(`${BASE_PATH}/albums_list.php`);
}

export function createGalleryAlbum(data) {
  return apiPost(`${BASE_PATH}/album_create.php`, data);
}

export function updateGalleryAlbum(id, data) {
  return apiPost(`${BASE_PATH}/album_update.php`, { id, ...data });
}

export function deleteGalleryAlbum(id) {
  return apiPost(`${BASE_PATH}/album_delete.php`, { id });
}

export function listGalleryItems(albumId) {
  return apiGet(`${BASE_PATH}/items_list.php?album_id=${encodeURIComponent(albumId)}`);
}

export function addGalleryItem(data) {
  return apiPost(`${BASE_PATH}/item_add.php`, data);
}

export function updateGalleryItem(id, data) {
  return apiPost(`${BASE_PATH}/item_update.php`, { id, ...data });
}

export function deleteGalleryItem(id) {
  return apiPost(`${BASE_PATH}/item_delete.php`, { id });
}
