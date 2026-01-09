/**
 * Formatea una fecha MySQL (YYYY-MM-DD o YYYY-MM-DD HH:mm:ss)
 * a formato dd-mm-aaaa
 */
export function formatDateDMY(dateString) {
  if (!dateString) return "";

  // Soporta DATE y DATETIME
  const [datePart] = dateString.split(" ");
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return "";

  return `${day}-${month}-${year}`;
}

/**
 * Formatea una fecha usando locale (más robusto)
 * Útil si luego trabajás con zonas horarias
 */
export function formatDateLocale(dateString, locale = "es-AR") {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date)) return "";

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Devuelve true si la fecha es válida
 */
export function isValidDate(dateString) {
  if (!dateString) return false;
  return !isNaN(new Date(dateString));
}

/**
 * Ordena un array por fecha (ascendente)
 * key: nombre del campo de fecha
 */
export function sortByDateAsc(array, key) {
  return [...array].sort((a, b) => new Date(a[key]) - new Date(b[key]));
}

/**
 * Ordena un array por fecha (descendente)
 */
export function sortByDateDesc(array, key) {
  return [...array].sort((a, b) => new Date(b[key]) - new Date(a[key]));
}
