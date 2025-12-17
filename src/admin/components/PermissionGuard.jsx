export default function PermissionGuard({ can, children }) {
  if (!can) {
    return (
      <div className="no-permission">
        <h3>No tienes permisos para acceder a esta sección</h3>
      </div>
    );
  }

  return children;
}
