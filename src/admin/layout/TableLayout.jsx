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
    .map((col) => {
      if (col.type === "actions") return "auto";
      if (col.type === "index") return col.width || "60px";
      return col.width || "200px";
    })
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
            key={col.key || col.type}
            className={col.type === "actions" ? "data-table__actions" : ""}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* ROWS */}
      {data.map((row, index) => (
        <div
          key={row.id ?? index}
          className="data-table__row"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((col) => {
            // Columna índice visual
            if (col.type === "index") {
              return <div key={col.key || "index"}>{index + 1}</div>;
            }

            // Acciones
            if (col.type === "actions") {
              return (
                <div key={col.key} className="data-table__actions">
                  {renderActions?.(row)}
                </div>
              );
            }

            // Columna normal
            return (
              <div key={col.key} className={col.truncate ? "truncate" : ""}>
                {col.render ? col.render(row) : row[col.key] ?? "—"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
