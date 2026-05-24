export default function EmptyStateAdmin({
  title = "Sin registros",
  description,
}) {
  return (
    <div className="admin-empty-state">
      <strong>{title}</strong>
      {description && <p>{description}</p>}
    </div>
  );
}
