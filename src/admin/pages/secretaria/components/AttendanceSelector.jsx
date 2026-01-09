import { useEffect, useState } from "react";
import { apiGet } from "../../../../services/api";
import formatUsername from "../../../utils/formatUsername";

const ALLOWED_ROLES = ["secretaria", "miembro"];

export default function AttendanceSelector({ value, onChange }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiGet("/admin/users/list.php").then((res) => {
      if (!res?.success) return;

      // Filtramos solo los roles permitidos
      const filteredUsers = res.users.filter((u) =>
        ALLOWED_ROLES.includes(u.role)
      );

      setUsers(filteredUsers);
    });
  }, []);

  const toggle = (id) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  return (
    <div className="attendance-selector">
      <h4>Asistencia</h4>

      <div className="attendance-selector-list">
        {users.length === 0 && (
          <div className="attendance-selector-empty">
            No hay usuarios disponibles
          </div>
        )}

        {users.map((u) => (
          <label
            key={u.id}
            className={`attendance-selector-item ${
              value.includes(u.id) ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={value.includes(u.id)}
              onChange={() => toggle(u.id)}
            />
            {formatUsername(u.username)}
          </label>
        ))}
      </div>
    </div>
  );
}
