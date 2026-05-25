import { useEffect, useRef, useState } from "react";
import { FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import {
  createNavigationItem,
  deactivateNavigationItem,
  listNavigationItems,
  updateNavigationItem,
} from "../services/navigationService";
import { toastBus } from "../../services/toastBus";
import { confirmDestructive } from "../utils/confirmAction";

const initialForm = {
  label: "",
  url: "",
  target: "_self",
  sort_order: 0,
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeItem(item) {
  return {
    ...initialForm,
    ...item,
    sort_order: item.sort_order ?? 0,
    is_active: toBoolean(item.is_active ?? true),
  };
}

function getPayload(item) {
  return {
    label: item.label,
    url: item.url,
    target: item.target,
    sort_order: Number(item.sort_order || 0),
    is_active: item.is_active ? 1 : 0,
  };
}

export default function NavigationPage() {
  const formRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await listNavigationItems();
      setItems(res.navigation_items ?? []);
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudo cargar el menú");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm(normalizeItem(item));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setActionLoading("save");
      const payload = getPayload(form);

      if (editingId) {
        await updateNavigationItem(editingId, payload);
        toastBus.success("Ítem actualizado");
      } else {
        await createNavigationItem(payload);
        toastBus.success("Ítem creado");
      }

      resetForm();
      await fetchItems();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (item) => {
    const normalized = normalizeItem(item);

    if (
      normalized.is_active &&
      !confirmDestructive({
        title: `Desactivar ítem "${item.label}"`,
        detail: "El enlace dejará de mostrarse en el menú público.",
        action: "Desactivar ítem",
      })
    ) {
      return;
    }

    try {
      setActionLoading(`toggle-${item.id}`);

      if (normalized.is_active) {
        await deactivateNavigationItem(item.id);
        toastBus.success("Ítem desactivado");
      } else {
        await updateNavigationItem(item.id, { is_active: 1 });
        toastBus.success("Ítem activado");
      }

      await fetchItems();

      if (normalized.is_active && editingId === item.id) {
        resetForm();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="navigation-page" ref={formRef}>
      <PageHeader
        title="Menú"
        description="Administrá los enlaces visibles en la navegación pública del sitio."
        actions={
          editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Crear nuevo ítem
            </button>
          )
        }
      />

      <SectionHeader
        title={editingId ? "Editar ítem de menú" : "Crear ítem de menú"}
        description="Definí etiqueta, URL, orden y comportamiento del enlace."
      />

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field label="Etiqueta" name="label" value={form.label} onChange={handleChange} required />
        <Field label="URL" name="url" value={form.url} onChange={handleChange} placeholder="/pagina/historia" required />

        <Field label="Target" type="select" name="target" value={form.target} onChange={handleChange}>
          <option value="_self">Misma pestaña</option>
          <option value="_blank">Nueva pestaña</option>
        </Field>

        <Field label="Orden" type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />

        <SwitchField
          label="Activo"
          checked={form.is_active}
          onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
        />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={actionLoading === "save"}>
            {editingId ? "Guardar cambios" : "Crear ítem"}
          </button>

          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </FormLayout>

      <SectionHeader
        title="Ítems del menú"
        description="Ordená y activá los enlaces que componen la navegación principal."
      />
      {error && <p>{error}</p>}

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px", mobileHidden: true },
          { key: "label", label: "Etiqueta", width: "180px" },
          { key: "url", label: "URL", width: "260px", truncate: true },
          { key: "target", label: "Target", width: "100px" },
          { key: "sort_order", label: "Orden", width: "90px" },
          {
            key: "is_active",
            label: "Estado",
            width: "100px",
            mobileHidden: true,
            render: (item) =>
              toBoolean(item.is_active) ? (
                <StatusBadge variant="success">Activo</StatusBadge>
              ) : (
                <StatusBadge variant="warning">Inactivo</StatusBadge>
              ),
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={items}
        loading={loading}
        emptyText="No hay ítems de menú registrados"
        mobileTitle={(item) => item.label}
        mobileDescription={(item) => item.url}
        mobileBadges={(item) =>
          toBoolean(item.is_active) ? (
            <StatusBadge variant="success">Activo</StatusBadge>
          ) : (
            <StatusBadge variant="warning">Inactivo</StatusBadge>
          )
        }
        mobileCompact
        renderActions={(item) => {
          const isActive = toBoolean(item.is_active);

          return (
            <>
              <button className="btn-icon" title="Editar" onClick={() => startEdit(item)}>
                <FaEdit />
              </button>
              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `toggle-${item.id}`}
                onClick={() => handleToggleActive(item)}
              >
                {isActive ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </>
          );
        }}
      />
    </div>
  );
}
