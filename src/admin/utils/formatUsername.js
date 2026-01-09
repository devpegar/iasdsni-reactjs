export default function formatUsername(username) {
  if (!username) return "";

  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
