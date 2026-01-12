import useCrud from "../../../hooks/useCrud";
import useFormEdit from "../../../hooks/useFormEdit";
import FormLayout from "../../../layout/FormLayout";
import TableLayout from "../../../layout/TableLayout";
import Field from "../../../components/form/Field";
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
    <div>
      <h2>{editingId ? "Editar Rol" : "Crear Rol"}</h2>
      <div className="rolesTab">
        <FormLayout inline compact onSubmit={handleSubmit}>
          <Field
            type="text"
            name="name"
            placeholder="Nombre del rol"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Field
            type="text"
            name="description"
            placeholder="Descripción del rol"
            value={form.description}
            onChange={handleChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Guardar Cambios" : "Crear Rol"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </FormLayout>
      </div>

      <h3>Listado de roles</h3>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TableLayout
          columns={[
            {
              type: "index",
              label: "#",
              width: "80px",
            },
            {
              key: "name",
              label: "Rol",
              width: "200px",
              truncate: true,
            },
            {
              key: "description",
              label: "Descripción",
              width: "360px",
              truncate: true,
            },
            {
              key: "actions",
              label: "Acciones",
              type: "actions",
            },
          ]}
          data={roles}
          loading={loading}
          emptyText="No hay roles registrados"
          renderActions={(r) => (
            <>
              <button
                className="btn-icon"
                title="Editar"
                onClick={() => startEdit(r)}
              >
                <FaEdit />
              </button>

              <button
                className="btn-icon btn-danger"
                title="Eliminar"
                onClick={() => deleteItem(r.id)}
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
