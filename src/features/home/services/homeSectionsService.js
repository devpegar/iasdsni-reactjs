import { getJson } from "../../../services/httpClient";

export function listHomeSections() {
  return getJson("/public/home/sections.php");
}
