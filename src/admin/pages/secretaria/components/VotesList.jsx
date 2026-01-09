import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../../../services/api";
import AttendanceList from "./AttendanceList";
import TableLayout from "../../../layout/TableLayout";
import TableSelectField from "../../../components/form/TableSelectField";
import DescriptionPreview from "../../../components/ui/DescriptionPreview";
import formatUsername from "../../../utils/formatUsername";

export default function VotesList({ boardId }) {
  const [votes, setVotes] = useState([]);
  const [description, setDescription] = useState("");

  const [editingVoteId, setEditingVoteId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");

  const [users, setUsers] = useState([]);

  const [assigningVoteId, setAssigningVoteId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* =======================
     LOAD USERS
  ======================= */
  const loadUsers = async () => {
    try {
      const res = await apiGet("/admin/users/list.php");
      if (!res?.success) throw new Error();

      const allowed = (res.users || []).filter((u) =>
        ["secretaria", "miembro"].includes(u.role)
      );

      setUsers(allowed);
    } catch (err) {
      console.error(err);
    }
  };

  /* =======================
     LOAD VOTES
  ======================= */
  const loadVotes = async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiGet(
        `/secretaria/boards/votes/list.php?board_id=${boardId}`
      );

      if (!res?.success) {
        throw new Error(res?.message || "Error al cargar los votos");
      }

      setVotes(res.votes || []);
    } catch (err) {
      setError(err.message);
      setVotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVotes();
    loadUsers();
  }, [boardId]);

  /* =======================
     CREATE
  ======================= */
  const createVote = async () => {
    if (!description.trim() || !boardId) return;

    await apiPost("/secretaria/boards/votes/create.php", {
      board_id: boardId,
      vote_number: votes.length + 1,
      vote_year: new Date().getFullYear(),
      description,
    });

    setDescription("");
    loadVotes();
  };

  /* =======================
     UPDATE DESCRIPTION
  ======================= */
  const updateVote = async () => {
    if (!editingVoteId || !editingDescription.trim()) return;

    setSaving(true);

    try {
      const res = await apiPost("/secretaria/boards/votes/update.php", {
        id: editingVoteId,
        description: editingDescription,
      });

      if (!res?.success) throw new Error("Error al actualizar el voto");

      setEditingVoteId(null);
      setEditingDescription("");
      loadVotes();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     DELETE
  ======================= */
  const deleteVote = async (voteId) => {
    const confirm = window.confirm(
      "¿Está seguro que desea eliminar este voto?\n\nEsta acción no se puede deshacer."
    );
    if (!confirm) return;

    try {
      const res = await apiPost(
        `/secretaria/boards/votes/delete.php?id=${voteId}`
      );

      if (!res?.success) throw new Error("Error al eliminar el voto");

      loadVotes();
    } catch (err) {
      alert(err.message);
    }
  };

  /* =======================
     FULFILL
  ======================= */
  const fulfillVote = async (voteId) => {
    await apiPost("/secretaria/boards/votes/fulfill.php", {
      vote_id: voteId,
    });
    loadVotes();
  };

  /* =======================
     ASSIGN RESPONSIBLE
  ======================= */
  const saveResponsible = async (voteId, userId) => {
    await apiPost("/secretaria/boards/votes/assign_responsible.php", {
      vote_id: voteId,
      user_id: userId || null,
    });

    setAssigningVoteId(null);
    setSelectedUserId("");
    loadVotes();
  };

  const truncateText = (text, max = 120) =>
    text && text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <div className="votes">
      {/* =======================
          NUEVO VOTO
      ======================= */}
      <section className="secretaria-section">
        <div className="secretaria-section__header">
          <button
            className="btn-link"
            onClick={() => navigate("/admin/secretaria")}
          >
            ← Volver a juntas
          </button>
        </div>

        <form className="form-group">
          <h3>Votos de la junta</h3>

          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descripción del voto..."
          />

          <div className="form-actions">
            <button className="btn btn-primary" onClick={createVote}>
              Agregar voto
            </button>
          </div>
        </form>
      </section>

      {/* =======================
          LISTADO
      ======================= */}
      <section className="votes">
        <div className="secretaria-section__header">
          <h3>Votos registrados</h3>
        </div>

        {loading && <p className="secretaria-loading">Cargando votos...</p>}
        {error && <p className="secretaria-error">{error}</p>}

        {!loading && !error && votes.length === 0 && (
          <p className="secretaria-empty">
            No hay votos registrados para esta junta.
          </p>
        )}

        {!loading && !error && votes.length > 0 && (
          <TableLayout
            columns={[
              {
                key: "vote",
                label: "Voto",
                width: "80px",
                render: (v) => `${v.vote_number}/${v.vote_year}`,
              },
              {
                key: "description",
                label: "Descripción",
                width: "280px",
                truncate: true,
                render: (v) => {
                  const isEditing = editingVoteId === v.id;

                  if (isEditing) {
                    return (
                      <textarea
                        className="textarea"
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        rows={2}
                      />
                    );
                  }

                  return (
                    <DescriptionPreview text={v.description}>
                      {truncateText(v.description, 35)}
                    </DescriptionPreview>
                  );
                },
              },
              {
                key: "status",
                label: "Estado",
                width: "100px",
                render: (v) => (v.fulfilled_date ? "Cumplido" : "Pendiente"),
              },
              {
                key: "responsible",
                label: "Responsable",
                width: "150px",
                truncate: true,
                render: (v) => {
                  const isAssigning = assigningVoteId === v.id;

                  if (isAssigning) {
                    return (
                      <TableSelectField
                        value={selectedUserId}
                        onChange={(e) => {
                          const userId = e.target.value;
                          setSelectedUserId(userId);
                          saveResponsible(v.id, userId);
                        }}
                      >
                        <option value="">Sin responsable</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {formatUsername(u.username)}
                          </option>
                        ))}
                      </TableSelectField>
                    );
                  }

                  return formatUsername(v.responsible_name) || "Sin asignar";
                },
              },

              {
                key: "actions",
                label: "Acciones",
                type: "actions",
              },
            ]}
            data={votes}
            loading={loading}
            emptyText="No hay votos registrados"
            renderActions={(v) => {
              const isEditing = editingVoteId === v.id;

              if (isEditing) {
                return (
                  <>
                    <button
                      className="btn-icon"
                      title="Guardar"
                      onClick={updateVote}
                      disabled={saving}
                    >
                      💾
                    </button>

                    <button
                      className="btn-icon"
                      title="Cancelar"
                      onClick={() => {
                        setEditingVoteId(null);
                        setEditingDescription("");
                      }}
                    >
                      ✖
                    </button>
                  </>
                );
              }

              return (
                <>
                  {!v.fulfilled_date && (
                    <button
                      className="btn-icon"
                      title="Cumplido"
                      onClick={() => fulfillVote(v.id)}
                    >
                      ✔
                    </button>
                  )}

                  <button
                    className="btn-icon"
                    title="Asignar responsable"
                    onClick={() => {
                      setAssigningVoteId(v.id);
                      setSelectedUserId(v.responsible_user_id || "");
                    }}
                  >
                    👤
                  </button>

                  <button
                    className="btn-icon"
                    title="Editar"
                    onClick={() => {
                      setEditingVoteId(v.id);
                      setEditingDescription(v.description);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn-icon btn-danger"
                    title="Eliminar"
                    onClick={() => deleteVote(v.id)}
                  >
                    🗑
                  </button>
                </>
              );
            }}
          />
        )}
      </section>

      {/* ASISTENCIA */}
      <AttendanceList boardId={boardId} />
    </div>
  );
}
