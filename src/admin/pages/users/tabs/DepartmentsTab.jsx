import useCrud from "../../../../hooks/useCrud";
import useFormEdit from "../../../../hooks/useFormEdit";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function DepartmentsTab() {
  const {
    list: departments,
    createItem,
    updateItem,
    deleteItem,
    loading,
  } = useCrud("/admin/departments");

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

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  return (
    <div className="tab-section">
      <h2>{editingId ? "Editar Departamento" : "Crear Departamento"}</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Nombre del departamento"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">
            {editingId ? "Guardar Cambios" : "Crear Departamento"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <h3>Lista de departamentos</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Departamento</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td className="actions">
                  <button onClick={() => startEdit(d)}>
                    <FaEdit className="edit" />
                  </button>
                  <button onClick={() => deleteItem(d.id)}>
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
