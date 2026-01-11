import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../../../../services/api";
import AttendanceSelector from "../components/AttendanceSelector";
import FormLayout from "../../../layout/FormLayout";
import Field from "../../../components/form/Field";
import useCrud from "../../../hooks/useCrud";

export default function BoardFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { createItem } = useCrud("/secretaria/boards");

  const [meetingDate, setMeetingDate] = useState("");
  const [description, setDescription] = useState("");
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* =======================
     LOAD BOARD (EDIT)
  ======================= */
  useEffect(() => {
    if (!isEdit) return;

    setLoading(true);
    setError(null);

    apiGet(`/secretaria/boards/get.php?id=${id}`)
      .then((res) => {
        if (!res?.success) {
          throw new Error(res?.message || "Error al cargar la junta");
        }

        const board = res.board;

        setMeetingDate(board.meeting_date || "");
        setDescription(board.description || "");

        // 👇 Adaptamos asistencia al formato del selector
        setAttendance(
          (board.attendance || []).map((a) => ({
            user_id: a.user_id,
            present: Boolean(a.present),
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  /* =======================
     SUBMIT
  ======================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!meetingDate) {
      alert("La fecha es obligatoria");
      return;
    }

    if (!attendance.some((a) => a.present)) {
      alert("Debe haber al menos un asistente presente");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit) {
        const res = await apiPost("/secretaria/boards/update.php", {
          id,
          meeting_date: meetingDate,
          description,
          attendance,
        });

        if (!res?.success) {
          throw new Error(res?.message || "Error al actualizar junta");
        }

        navigate(`/admin/secretaria/boards/${id}`);
      } else {
        const res = await createItem({
          meeting_date: meetingDate,
          description,
          attendance,
        });

        if (res?.success) {
          navigate(`/admin/secretaria/boards/${res.board_id}`);
        } else {
          throw new Error(res?.message || "Error al crear junta");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="secretaria-section">
      <div className="secretaria-section__header">
        <h2>{isEdit ? "Editar Junta" : "Nueva Junta"}</h2>
      </div>

      {loading && <p className="secretaria-loading">Cargando datos…</p>}
      {error && <p className="secretaria-error">{error}</p>}

      {!loading && (
        <FormLayout columns={2} onSubmit={submit} className="board-form">
          <Field
            label="Fecha"
            type="date"
            name="Fecha"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            required
          />

          <Field
            type="textarea"
            placeholder="Escribe una descripción"
            name="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* ASISTENCIA – ocupa todo el ancho */}
          <div className="full-span">
            <AttendanceSelector value={attendance} onChange={setAttendance} />
          </div>

          {/* ACCIONES – todo el ancho */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/admin/secretaria")}
            >
              Cancelar
            </button>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? "Guardando..."
                : isEdit
                ? "Guardar cambios"
                : "Crear Junta"}
            </button>
          </div>
        </FormLayout>
      )}
    </div>
  );
}
