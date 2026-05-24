export function confirmDestructive({
  title,
  detail,
  action = "Continuar",
  irreversible = false,
}) {
  const lines = [
    title,
    detail,
    irreversible
      ? "Esta acción no se puede deshacer."
      : "Podés revertirlo luego si el módulo lo permite.",
    `Acción: ${action}`,
  ].filter(Boolean);

  return window.confirm(lines.join("\n\n"));
}
