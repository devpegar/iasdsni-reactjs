import { getJson } from "../../../services/httpClient";

export function listBeliefDoctrines() {
  return getJson("/public/beliefs/doctrines.php");
}

export function getBeliefDoctrine(slug) {
  return getJson(`/public/beliefs/doctrine.php?slug=${encodeURIComponent(slug)}`);
}
