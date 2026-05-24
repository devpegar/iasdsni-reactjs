export default function LoadingStateAdmin({ label = "Cargando..." }) {
  return (
    <div className="admin-loading-state" role="status" aria-live="polite">
      <span className="admin-loading-state__dot" />
      <span>{label}</span>
    </div>
  );
}
