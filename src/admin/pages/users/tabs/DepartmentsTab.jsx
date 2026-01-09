import useCrud from "../../../hooks/useCrud";
import useFormEdit from "../../../hooks/useFormEdit";
import FormLayout from "../../../layout/FormLayout";
import TableLayout from "../../../layout/TableLayout";
import Field from "../../../components/form/Field";
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
    <div className="departmentsTab">
      <h2>{editingId ? "Editar Departamento" : "Crear Departamento"}</h2>
      <div className="departmentsTab">
        <FormLayout inline compact onSubmit={handleSubmit}>
          <Field
            type="text"
            name="name"
            placeholder="Nombre del departamento"
            value={form.name}
            onChange={handleChange}
          />
          <Field
            type="text"
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Guardar Cambios" : "Crear Departamento"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </FormLayout>
      </div>

      <h3>Lista de departamentos</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TableLayout
          columns={[
            { key: "id", label: "ID", width: "80px" },
            { key: "name", label: "Departamento", width: "180px" },
            { key: "description", label: "Descripción", width: "360px" },
            { key: "actions", label: "Acciones", type: "actions" },
          ]}
          data={departments}
          loading={loading}
          emptyText="No hay roles registrados"
          renderActions={(d) => (
            <>
              <button
                className="btn-icon"
                title="Editar"
                onClick={() => startEdit(d)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-icon btn-danger"
                title="Eliminar"
                onClick={() => deleteItem(d)}
              >
                <FaTrash />
              </button>
            </>
          )}
        />
      )}
    </div>
  );
}
