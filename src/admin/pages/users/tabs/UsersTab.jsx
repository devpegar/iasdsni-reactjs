// import { useState } from "react";
import useCrud from "../../../../hooks/useCrud";
import useFormEdit from "../../../../hooks/useFormEdit";
import TagMultiSelect from "../../../components/TagMultiSelect";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function UsersTab() {
  const {
    list: users,
    createItem,
    updateItem,
    deleteItem,
    loading,
  } = useCrud("/admin/users");

  const { list: departments } = useCrud("/admin/departments");
  const { list: roles } = useCrud("/admin/roles");

  const { form, handleChange, startEdit, setForm, resetForm, editingId } =
    useFormEdit({
      username: "",
      email: "",
      password: "",
      role_id: "",
      departments: [],
      has_access: false,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password, // si está vacío, backend NO cambia contraseña
      role_id: form.role_id,
      departments: form.departments, // backend lo espera como array
      has_access: form.has_access,
    };

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  return (
    <div>
      <h2>{editingId ? "Editar Usuario" : "Crear Usuario"}</h2>

      <form onSubmit={handleSubmit} className="form users-form">
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={editingId ? "Nueva contraseña (opcional)" : "Clave"}
          value={form.password}
          onChange={handleChange}
          required={!editingId} // solo obligatorio en crear
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione rol</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <TagMultiSelect
          options={departments}
          value={form.departments}
          onChange={(newValues) =>
            setForm((prev) => ({ ...prev, departments: newValues }))
          }
        />
        <label>
          <input
            type="checkbox"
            checked={form.has_access}
            onChange={(e) =>
              setForm((f) => ({ ...f, has_access: e.target.checked }))
            }
          />
          Puede acceder al sistema
        </label>

        <div className="form-actions">
          <button type="submit">
            {editingId ? "Guardar Cambios" : "Crear Usuario"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <h3>Listado de Usuarios</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Depto.</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.departments_names}</td>
                <td>
                  <button onClick={() => startEdit(u)}>
                    <FaEdit className="edit" />
                  </button>
                  <button onClick={() => deleteItem(u.id)}>
                    <FaTrash className="delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
