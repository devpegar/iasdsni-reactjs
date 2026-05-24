import { useState, useRef } from "react";
import useCrud from "../../../hooks/useCrud";
import useFormEdit from "../../../hooks/useFormEdit";
import FormLayout from "../../../layout/FormLayout";
import TableLayout from "../../../layout/TableLayout";
import Field from "../../../components/form/Field";
import SwitchField from "../../../components/form/SwitchField";
import SelectField from "../../../components/form/SelectField";
import MultiSelectField from "../../../components/form/MultiSelectField";
import { apiPost } from "../../../../services/api";
import { FaEdit, FaKey } from "react-icons/fa";
import AdminCard from "../../../components/ui/AdminCard";
import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import TableActions from "../../../components/ui/TableActions";

export default function UsersTab() {
  const {
    list: users,
    createItem,
    updateItem,
    // deleteItem,
    loading,
    error,
    refresh,
  } = useCrud("/admin/users");

  const { list: departments } = useCrud("/admin/departments");
  const { list: roles } = useCrud("/admin/roles");

  const formRef = useRef(null);

  const { form, handleChange, startEdit, setForm, resetForm, editingId } =
    useFormEdit(
      {
        username: "",
        email: "",
        password: "",
        role_id: "",
        departments: [],
        has_access: false,
        active: true,
      },
      { formRef },
    );
  /* ==========================
     ESTADO ACTIVAR ACCESO
  ========================== */
  const [activatingUser, setActivatingUser] = useState(null);
  const [activateEmail, setActivateEmail] = useState("");
  const [activatePassword, setActivatePassword] = useState("");
  const [activating, setActivating] = useState(false);

  /* ==========================
     SUBMIT CREAR / EDITAR
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: form.username,
      role_id: form.role_id,
      departments: form.departments,
      has_access: form.has_access,
      active: form.active,
    };

    if (form.has_access) {
      payload.email = form.email;

      if (form.password) {
        payload.password = form.password;
      }
    } else {
      payload.email = "";
      payload.password = "";
    }

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  /* ==========================
     ACTIVAR ACCESO
  ========================== */
  const activateAccess = async () => {
    if (!activatingUser || !activateEmail || !activatePassword) {
      alert("Email y contraseña son obligatorios");
      return;
    }

    setActivating(true);

    try {
      const res = await apiPost("/admin/users/activate_access.php", {
        id: activatingUser.id,
        email: activateEmail,
        password: activatePassword,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Error al activar acceso");
      }

      alert("Acceso habilitado correctamente");

      setActivatingUser(null);
      setActivateEmail("");
      setActivatePassword("");
      refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div ref={formRef}>
      <AdminCard className="users-tab">
        <SectionHeader
          title={editingId ? "Editar usuario" : "Crear usuario"}
          description="Definí rol, departamentos y acceso al sistema para cada persona."
        />

        <FormLayout columns={2} onSubmit={handleSubmit} className="users-form">
          <Field
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            required
          />

          {form.has_access && (
            <>
              <Field
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Field
                type="password"
                name="password"
                placeholder={
                  editingId ? "Nueva contraseña (opcional)" : "Contraseña"
                }
                value={form.password}
                onChange={handleChange}
                required={!editingId}
              />
            </>
          )}

          <SelectField
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
          </SelectField>

          <MultiSelectField
            placeholder="Seleccione departamentos (Puede seleccionar más de uno)"
            options={departments}
            value={form.departments}
            onChange={(newValues) =>
              setForm((prev) => ({ ...prev, departments: newValues }))
            }
          />

          {/* SWITCHES */}
          <div className="form-switch-group">
            <SwitchField
              label="Permitir acceso al sistema"
              hint={!form.has_access ? "(no podrá iniciar sesión)" : null}
              checked={form.has_access}
              onChange={(checked) =>
                setForm((f) => ({
                  ...f,
                  has_access: checked,
                  email: checked ? f.email : "",
                  password: "",
                }))
              }
            />

            <SwitchField
              label="Usuario activo"
              hint={
                !form.active
                  ? "(no aparecerá en nuevas juntas)"
                  : "(usuario vigente)"
              }
              checked={form.active}
              onChange={(checked) =>
                setForm((f) => ({
                  ...f,
                  active: checked,
                }))
              }
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Guardar Cambios" : "Crear Usuario"}
            </button>

            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </FormLayout>
      </AdminCard>

      <SectionHeader
        title="Listado de usuarios"
        description="Revisá estado, acceso y asignaciones de cada usuario registrado."
      />

      <TableLayout
        toolbar={`${users.length} usuarios registrados`}
        columns={[
          { key: "username", label: "Usuario", width: "150px" },
          {
            key: "email",
            label: "Email",
            width: "200px",
            truncate: true,
            render: (u) => u.email || "—",
          },
          { key: "role", label: "Rol", width: "100px" },
          {
            key: "departments",
            label: "Departamentos",
            width: "170px",
            render: (u) => {
              if (!u.departments_names) return "—";

              const deps = u.departments_names.split(",").map((d) => d.trim());

              return (
                <div className="departments-chips-vertical">
                  {deps.map((dep, idx) => (
                    <span key={idx} className="department-chip">
                      {dep}
                    </span>
                  ))}
                </div>
              );
            },
          },

          {
            key: "has_access",
            label: "Acceso",
            width: "90px",
            render: (u) =>
              u.has_access ? (
                <StatusBadge variant="success">Con acceso</StatusBadge>
              ) : (
                <StatusBadge>Sin acceso</StatusBadge>
              ),
          },
          {
            key: "active",
            label: "Estado",
            width: "75px",
            render: (u) =>
              u.active ? (
                <StatusBadge variant="success">Activo</StatusBadge>
              ) : (
                <StatusBadge variant="warning">Inactivo</StatusBadge>
              ),
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={users}
        loading={loading}
        error={error}
        emptyTitle="No hay usuarios registrados"
        emptyDescription="Creá usuarios para asignar roles, departamentos y acceso al sistema."
        renderActions={(u) => (
          <TableActions>
            <button
              className="btn-icon"
              title="Editar"
              onClick={() => {
                startEdit(u);
              }}
            >
              <FaEdit />
            </button>

            {!u.has_access && (
              <button
                className="btn-icon"
                title="Activar acceso"
                onClick={() => setActivatingUser(u)}
              >
                <FaKey />
              </button>
            )}
          </TableActions>
        )}
      />

      {/* ==========================
          MODAL ACTIVAR ACCESO
      ========================== */}
      {activatingUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Activar acceso para {activatingUser.username}</h3>

            <input
              type="email"
              placeholder="Correo electrónico"
              value={activateEmail}
              onChange={(e) => setActivateEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={activatePassword}
              onChange={(e) => setActivatePassword(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={activateAccess} disabled={activating}>
                {activating ? "Activando..." : "Activar"}
              </button>

              <button className="btn btn-secondary" onClick={() => setActivatingUser(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
