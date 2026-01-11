import formatUsername from "../../../utils/formatUsername";

export default function AttendanceList({ attendance = [] }) {
  if (!attendance.length) {
    return (
      <div className="secretaria-section attendance-list">
        <p className="attendance-empty">No hay asistencia registrada.</p>
      </div>
    );
  }

  const present = attendance.filter((a) => a.present);
  const absent = attendance.filter((a) => !a.present);

  return (
    <div className="secretaria-section attendance-list">
      <div className="secretaria-section__header">
        <h3>Asistencia a la junta</h3>
        <small>
          {present.length} presentes / {absent.length} ausentes
        </small>
      </div>

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
    </div>
  );
}
