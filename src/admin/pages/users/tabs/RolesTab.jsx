import useCrud from "../../../../hooks/useCrud";
import useFormEdit from "../../../../hooks/useFormEdit";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function RolesTab() {
  const {
    list: roles,
    createItem,
    updateItem,
    deleteItem,
    loading,
  } = useCrud("/admin/roles");

  const { form, handleChange, startEdit, resetForm, editingId } = useFormEdit({
    name: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
    };
    console.log(payload);

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  return (
    <div className="tab-section">
      <h2>{editingId ? "Editar Rol" : "Crear Rol"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Nombre del rol"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción del rol"
          value={form.description}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">
            {editingId ? "Guardar Cambios" : "Crear Rol"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <h3>Listado de roles</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rol</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td className="actions">
                  <button onClick={() => startEdit(r)}>
                    <FaEdit className="edit" />
                  </button>
                  <button onClick={() => deleteItem(r.id)}>
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
