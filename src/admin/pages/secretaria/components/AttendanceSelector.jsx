import { useEffect, useState } from "react";
import { apiGet } from "../../../../services/api";
import formatUsername from "../../../utils/formatUsername";

const ALLOWED_ROLES = ["secretaria", "miembro"];

export default function AttendanceSelector({ value = [], onChange }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiGet("/admin/users/list.php").then((res) => {
      if (!res?.success) return;

      const eligible = res.users.filter((u) => ALLOWED_ROLES.includes(u.role));

      setUsers(eligible);

      // 🔑 Inicializar snapshot completo si está vacío
      if (value.length === 0) {
        onChange(
          eligible.map((u) => ({
            user_id: u.id,
            present: false,
          }))
        );
      }
    });
  }, []);

  const toggle = (userId) => {
    onChange(
      value.map((a) =>
        a.user_id === userId ? { ...a, present: !a.present } : a
      )
    );
  };

  const isPresent = (userId) =>
    value.find((a) => a.user_id === userId)?.present;

  return (
    <div className="attendance-selector">
      <h4>Asistencia</h4>

      <div className="attendance-selector-list">
        {users.map((u) => (
          <label
            key={u.id}
            className={`attendance-selector-item ${
              isPresent(u.id) ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(isPresent(u.id))}
              onChange={() => toggle(u.id)}
            />
            {formatUsername(u.username)}
          </label>
        ))}
      </div>
    </div>
  );
}
