export default function TableLayout({
  columns,
  data = [],
  loading = false,
  emptyText = "Sin registros",
  renderActions,
}) {
  if (loading) return <p>Cargando...</p>;
  if (!data.length) return <p>{emptyText}</p>;

  const gridTemplate = columns
    .map((col) => (col.type === "actions" ? "auto" : col.width || "200px"))
    .join(" ");

  return (
    <div className="data-table">
      {/* HEADER */}
      <div
        className="data-table__header"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <div
            key={col.key}
            className={col.type === "actions" ? "data-table__actions" : ""}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* ROWS */}
      {data.map((row) => (
        <div
          key={row.id}
          className="data-table__row"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => {
            if (col.type === "actions") {
              return (
                <div key={col.key} className="data-table__actions">
                  {renderActions?.(row)}
                </div>
              );
            }

            return (
              <div key={col.key} className={col.truncate ? "truncate" : ""}>
                {col.render ? col.render(row) : row[col.key] || "—"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
