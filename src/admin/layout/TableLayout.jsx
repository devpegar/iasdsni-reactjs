import AdminAlert from "../components/ui/AdminAlert";
import EmptyStateAdmin from "../components/ui/EmptyStateAdmin";
import LoadingStateAdmin from "../components/ui/LoadingStateAdmin";

export default function TableLayout({
  columns,
  data = [],
  loading = false,
  error,
  toolbar,
  actions,
  filters,
  emptyText = "Sin registros",
  emptyTitle,
  emptyDescription,
  loadingText = "Cargando registros...",
  renderActions,
}) {
  const gridTemplate = columns
    .map((col) => {
      if (col.type === "actions") return "auto";
      if (col.type === "index") return col.width || "60px";
      return col.width || "200px";
    })
    .join(" ");

  const hasToolbar = toolbar || actions || filters;

  return (
    <div className="data-table-shell">
      {hasToolbar && (
        <div className="data-table-toolbar">
          <div className="data-table-toolbar__main">{toolbar}</div>
          {filters && <div className="data-table-toolbar__filters">{filters}</div>}
          {actions && <div className="data-table-toolbar__actions">{actions}</div>}
        </div>
      )}

      <AdminAlert variant="error">{error}</AdminAlert>

      {loading && <LoadingStateAdmin label={loadingText} />}

      {!loading && !error && !data.length && (
        <EmptyStateAdmin
          title={emptyTitle || emptyText}
          description={emptyDescription}
        />
      )}

      {!loading && !error && data.length > 0 && (
        <div className="data-table" role="table">
          <div
            className="data-table__header"
            role="row"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col) => (
              <div
                key={col.key || col.type}
                role="columnheader"
                className={col.type === "actions" ? "data-table__actions" : ""}
              >
                {col.label}
              </div>
            ))}
          </div>

          {data.map((row, index) => (
            <div
              key={row.id ?? index}
              className="data-table__row"
              role="row"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col) => {
                if (col.type === "index") {
                  return (
                    <div key={col.key || "index"} role="cell">
                      {index + 1}
                    </div>
                  );
                }

                if (col.type === "actions") {
                  return (
                    <div
                      key={col.key || "actions"}
                      role="cell"
                      className="data-table__actions"
                    >
                      {renderActions?.(row)}
                    </div>
                  );
                }

                return (
                  <div
                    key={col.key}
                    role="cell"
                    data-label={col.label}
                    className={col.truncate ? "truncate" : ""}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? "—"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
