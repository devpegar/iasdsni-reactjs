import { useRef } from "react";
import useCrud from "../../../hooks/useCrud";
import useFormEdit from "../../../hooks/useFormEdit";
import FormLayout from "../../../layout/FormLayout";
import TableLayout from "../../../layout/TableLayout";
import Field from "../../../components/form/Field";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminCard from "../../../components/ui/AdminCard";
import SectionHeader from "../../../components/ui/SectionHeader";
import TableActions from "../../../components/ui/TableActions";

export default function RolesTab() {
  const {
    list: roles,
    createItem,
    updateItem,
    deleteItem,
    loading,
    error,
  } = useCrud("/admin/roles");

  const formRef = useRef(null);

  const { form, handleChange, startEdit, resetForm, editingId } = useFormEdit(
    {
      name: "",
      description: "",
    },
    { formRef }
  );

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
    <div ref={formRef}>
      <AdminCard className="rolesTab">
        <SectionHeader
          title={editingId ? "Editar rol" : "Crear rol"}
          description="Creá grupos de permisos para asignarlos a usuarios del panel."
        />

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
              {editingId ? "Guardar cambios" : "Crear rol"}
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
      </AdminCard>

      <SectionHeader
        title="Listado de roles"
        description="Roles disponibles para clasificar usuarios y permisos."
      />

        <TableLayout
          toolbar={`${roles.length} roles registrados`}
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
          error={error}
          emptyTitle="No hay roles registrados"
          emptyDescription="Creá roles para agrupar permisos y tipos de usuario."
          renderActions={(r) => (
            <TableActions>
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
            </TableActions>
          )}
        />
    </div>
  );
}
