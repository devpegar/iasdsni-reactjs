import { useNavigate } from "react-router-dom";
import useCrud from "../../../hooks/useCrud";
import TableLayout from "../../../layout/TableLayout";
import { formatDateDMY } from "../../../../utils/date";
import { FaEye, FaEdit } from "react-icons/fa";

export default function BoardListPage() {
  const navigate = useNavigate();

  const { list: boards, loading, error } = useCrud("/secretaria/boards");

  if (loading) {
    return <p className="secretaria-loading">Cargando juntas...</p>;
  }

  if (error) {
    return <p className="secretaria-error">Error al cargar juntas: {error}</p>;
  }

  return (
    <div className="secretaria-section">
      {/* HEADER */}
      <div className="secretaria-section__header">
        <h2>Juntas</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("boards/new")}
        >
          Nueva Junta
        </button>
      </div>

      {/* EMPTY */}
      {boards.length === 0 && (
        <p className="secretaria-empty">No hay juntas registradas.</p>
      )}

      {/* TABLE */}
      {boards.length > 0 && (
        <TableLayout
          columns={[
            {
              key: "meeting_date",
              label: "Fecha",
              width: "140px",
              render: (b) => formatDateDMY(b.meeting_date),
            },
            {
              key: "description",
              label: "Descripción",
              width: "420px",
              truncate: true,
              render: (b) => b.description || "—",
            },
            {
              key: "actions",
              label: "Acciones",
              type: "actions",
            },
          ]}
          data={boards}
          loading={loading}
          emptyText="No hay juntas registradas"
          renderActions={(board) => (
            <>
              <button
                className="btn-icon"
                title="Ver"
                onClick={() => navigate(`boards/${board.id}`)}
              >
                <FaEye />
              </button>

              <button
                className="btn-icon"
                title="Editar"
                onClick={() => navigate(`boards/${board.id}/edit`)}
              >
                <FaEdit />
              </button>
            </>
          )}
        />
      )}
    </div>
  );
}
