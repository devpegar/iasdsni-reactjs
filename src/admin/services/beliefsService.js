import { apiGet, apiPost } from "../../services/api";

const DOCTRINES_PATH = "/admin/beliefs/doctrines";
const ITEMS_PATH = "/admin/beliefs/items";

export function listBeliefDoctrines(query = "") {
  const suffix = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiGet(`${DOCTRINES_PATH}/list.php${suffix}`);
}

export function createBeliefDoctrine(data) {
  return apiPost(`${DOCTRINES_PATH}/create.php`, data);
}

export function updateBeliefDoctrine(id, data) {
  return apiPost(`${DOCTRINES_PATH}/update.php`, { id, ...data });
}

export function deactivateBeliefDoctrine(id) {
  return apiPost(`${DOCTRINES_PATH}/delete.php`, { id });
}

export function listBeliefItems(doctrineId = "") {
  const suffix = doctrineId ? `?doctrine_id=${encodeURIComponent(doctrineId)}` : "";
  return apiGet(`${ITEMS_PATH}/list.php${suffix}`);
}

export function createBeliefItem(data) {
  return apiPost(`${ITEMS_PATH}/create.php`, data);
}

export function updateBeliefItem(id, data) {
  return apiPost(`${ITEMS_PATH}/update.php`, { id, ...data });
}

export function deactivateBeliefItem(id) {
  return apiPost(`${ITEMS_PATH}/delete.php`, { id });
}
