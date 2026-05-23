import { useEffect, useRef, useState } from "react";
import { FaEdit, FaToggleOff, FaToggleOn } from "react-icons/fa";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import {
  createHomeSection,
  deactivateHomeSection,
  listHomeSectionsAdmin,
  updateHomeSection,
} from "../services/homeSectionsService";
import { toastBus } from "../../services/toastBus";

const SUPPORTED_KEYS = [
  "hero_carousel",
  "verse_daily",
  "mission_vision_service",
  "adventists_world",
  "gallery",
  "contact_map",
  "latest_news",
];

const initialForm = {
  section_key: "hero_carousel",
  title: "",
  subtitle: "",
  config_json: "",
  sort_order: 0,
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeSection(section) {
  return {
    ...initialForm,
    ...section,
    title: section.title ?? "",
    subtitle: section.subtitle ?? "",
    config_json: section.config_json ?? "",
    sort_order: section.sort_order ?? 0,
    is_active: toBoolean(section.is_active ?? true),
  };
}

function getPayload(section) {
  return {
    section_key: section.section_key,
    title: section.title,
    subtitle: section.subtitle,
    config_json: section.config_json,
    sort_order: Number(section.sort_order || 0),
    is_active: section.is_active ? 1 : 0,
  };
}

export default function HomeSectionsPage() {
  const formRef = useRef(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await listHomeSectionsAdmin();
      setSections(res.home_sections ?? []);
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las secciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const startEdit = (section) => {
    setEditingId(section.id);
    setForm(normalizeSection(section));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setActionLoading("save");
      const payload = getPayload(form);

      if (editingId) {
        await updateHomeSection(editingId, payload);
        toastBus.success("Sección actualizada");
      } else {
        await createHomeSection(payload);
        toastBus.success("Sección creada");
      }

      resetForm();
      await fetchSections();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (section) => {
    const normalized = normalizeSection(section);

    if (normalized.is_active && !window.confirm(`Desactivar "${section.section_key}"?`)) {
      return;
    }

    try {
      setActionLoading(`toggle-${section.id}`);

      if (normalized.is_active) {
        await deactivateHomeSection(section.id);
        toastBus.success("Sección desactivada");
      } else {
        await updateHomeSection(section.id, { is_active: 1 });
        toastBus.success("Sección activada");
      }

      await fetchSections();

      if (normalized.is_active && editingId === section.id) {
        resetForm();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="home-sections-page" ref={formRef}>
      <h2>{editingId ? "Editar Sección del Home" : "Crear Sección del Home"}</h2>
      <p>Claves soportadas: {SUPPORTED_KEYS.join(", ")}</p>

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field
          label="section_key"
          type="select"
          name="section_key"
          value={form.section_key}
          onChange={handleChange}
        >
          {SUPPORTED_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Field>

        <Field label="Orden" type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />
        <Field label="Título" name="title" value={form.title} onChange={handleChange} />
        <Field label="Subtítulo" name="subtitle" value={form.subtitle} onChange={handleChange} />
        <Field
          label="config_json"
          type="textarea"
          name="config_json"
          value={form.config_json}
          onChange={handleChange}
          rows={5}
          placeholder='{"limit": 3}'
          span
        />

        <SwitchField
          label="Activa"
          checked={form.is_active}
          onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
        />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={actionLoading === "save"}>
            {editingId ? "Guardar Cambios" : "Crear Sección"}
          </button>

          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </FormLayout>

      <h3>Secciones configuradas</h3>
      {error && <p>{error}</p>}

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          { key: "section_key", label: "Clave", width: "220px" },
          { key: "title", label: "Título", width: "220px" },
          { key: "sort_order", label: "Orden", width: "90px" },
          {
            key: "is_active",
            label: "Estado",
            width: "100px",
            render: (section) => (toBoolean(section.is_active) ? "Activa" : "Inactiva"),
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={sections}
        loading={loading}
        emptyText="No hay secciones configuradas"
        renderActions={(section) => {
          const isActive = toBoolean(section.is_active);

          return (
            <>
              <button className="btn-icon" title="Editar" onClick={() => startEdit(section)}>
                <FaEdit />
              </button>
              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `toggle-${section.id}`}
                onClick={() => handleToggleActive(section)}
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
