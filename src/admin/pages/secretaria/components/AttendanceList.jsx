import { useEffect, useState } from "react";
import { apiGet } from "../../../../services/api";
import formatUsername from "../../../utils/formatUsername";

export default function AttendanceList({ boardId }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    apiGet(`/secretaria/attendance/list.php?board_id=${boardId}`)
      .then((res) => {
        if (!res?.success) {
          throw new Error(res?.message || "Error al cargar asistencia");
        }
        setAttendance(res.attendance || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [boardId]);

  return (
    <div className="secretaria-section attendance-list">
      <div className="secretaria-section__header">
        <h3>Asistentes a la junta</h3>
      </div>

      {loading && <p className="attendance-loading">Cargando asistencia...</p>}

      {error && <p className="attendance-error">{error}</p>}

      {!loading && !error && attendance.length === 0 && (
        <p className="attendance-empty">No hay asistencia registrada.</p>
      )}

      {!loading && !error && attendance.length > 0 && (
        <ul className="attendance-items">
          {attendance.map((a) => (
            <li key={a.user_id} className="attendance-item">
              <span
                className={`attendance-status ${
                  a.present ? "present" : "absent"
                }`}
              >
                {a.present ? "✔" : "✖"}
              </span>

              <span className="attendance-name">
                {formatUsername(a.username)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
