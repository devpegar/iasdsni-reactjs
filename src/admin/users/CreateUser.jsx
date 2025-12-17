import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../services/api";
import "../styles/create-user.scss";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    departments: [],
  });

  // ================================
  // Cargar roles y departamentos
  // ================================
  useEffect(() => {
    const loadData = async () => {
      try {
        const r = await apiGet("/admin/roles/list.php");
        const d = await apiGet("/admin/departments/list.php");

        if (r?.success) setRoles(r.roles);
        if (d?.success) setDepartments(d.departments);

        // Rol por defecto = primero de la lista
        if (r?.roles?.length > 0) {
          setForm((f) => ({ ...f, role: r.roles[0].name }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  // ================================
  // Manejo de cambios
  // ================================
  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "departments") {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      setForm({ ...form, departments: selected });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================================
  // Enviar formulario
  // ================================
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (!form.username || !form.email || !form.password || !form.role) {
      setMsg({
        type: "error",
        text: "Todos los campos obligatorios deben ser completados",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await apiPost("/admin/users/create.php", form);

      if (res?.success) {
        setMsg({ type: "success", text: "Usuario creado correctamente" });

        setTimeout(() => {
          navigate("/admin/users");
        }, 1200);
      } else {
        setMsg({
          type: "error",
          text: res?.message || "Error al crear usuario",
        });
      }
    } catch (error) {
      setMsg({ type: "error", text: "Error inesperado en el servidor" });
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="admin-form-wrapper">
      <h2 className="title">Crear usuario</h2>

      <form className="admin-form" onSubmit={onSubmit}>
        {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}

        {/* Nombre */}
        <label>Nombre</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="Nombre de usuario"
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Correo del usuario"
        />

        {/* Password */}
        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Contraseña inicial"
        />

        {/* Rol */}
        <label>Rol</label>
        <select name="role" value={form.role} onChange={onChange}>
          {roles.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Departamentos (MULTI SELECT) */}
        <label>Departamentos (opcional)</label>
        <select
          name="departments"
          multiple
          value={form.departments}
          onChange={onChange}
        >
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
}
