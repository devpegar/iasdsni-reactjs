import { useEffect, useState } from "react";
import { apiGet } from "../../../../services/api";
import formatUsername from "../../../utils/formatUsername";

export default function AttendanceSelector({ value = [], onChange }) {
  const [users, setUsers] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    apiGet("/secretaria/boards/attendance-users.php").then((res) => {
      if (!res?.success) return;

      const activeUsers = res.users;

      /**
       * Mezclamos:
       * - usuarios activos (endpoint)
       * - usuarios históricos (value) que ya no están activos
       */
      const mergedAttendance = [
        ...activeUsers.map((u) => {
          const existing = value.find((a) => a.user_id === u.id);
          return {
            user_id: u.id,
            present: existing?.present ?? false,
            username: u.username,
            inactive: false,
          };
        }),
        ...value
          .filter((a) => !activeUsers.some((u) => u.id === a.user_id))
          .map((a) => ({
            ...a,
            inactive: true,
          })),
      ];

      setUsers(mergedAttendance);

      // Solo inicializamos una vez
      if (!initialized) {
        onChange(
          mergedAttendance.map(({ user_id, present }) => ({
            user_id,
            present,
          })),
        );
        setInitialized(true);
      }
    });
  }, []);

  const toggle = (userId) => {
    const updated = users.map((u) =>
      u.user_id === userId && !u.inactive ? { ...u, present: !u.present } : u,
    );

    setUsers(updated);

    onChange(
      updated.map(({ user_id, present }) => ({
        user_id,
        present,
      })),
    );
  };

  return (
    <div className="attendance-selector">
      <h4>Asistencia</h4>

      <div className="attendance-selector-list">
        {users.map((u) => (
          <label
            key={u.user_id}
            className={`attendance-selector-item ${
              u.present ? "selected" : ""
            } ${u.inactive ? "inactive" : ""}`}
          >
            <input
              type="checkbox"
              checked={Boolean(u.present)}
              disabled={u.inactive}
              onChange={() => toggle(u.user_id)}
            />
            {formatUsername(u.username)}
            {u.inactive && " (histórico)"}
          </label>
        ))}
      </div>
    </div>
  );
}
