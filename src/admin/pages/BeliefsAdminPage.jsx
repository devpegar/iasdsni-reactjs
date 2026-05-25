import { useCallback, useEffect, useState } from "react";
import { FaEdit, FaExternalLinkAlt, FaToggleOff, FaToggleOn } from "react-icons/fa";
import Field from "../components/form/Field";
import RichTextEditor from "../components/form/RichTextEditor";
import SelectField from "../components/form/SelectField";
import SwitchField from "../components/form/SwitchField";
import ImageUrlField from "../components/media/ImageUrlField";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import { toastBus } from "../../services/toastBus";
import { confirmDestructive } from "../utils/confirmAction";
import {
  createBeliefDoctrine,
  createBeliefItem,
  deactivateBeliefDoctrine,
  deactivateBeliefItem,
  listBeliefDoctrines,
  listBeliefItems,
  updateBeliefDoctrine,
  updateBeliefItem,
} from "../services/beliefsService";

const doctrineInitialForm = {
  title: "",
  slug: "",
  summary: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

const itemInitialForm = {
  doctrine_id: "",
  title: "",
  slug: "",
  content: "",
  bible_references: "",
  sort_order: 0,
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeDoctrine(doctrine) {
  return {
    ...doctrineInitialForm,
    ...doctrine,
    summary: doctrine.summary ?? "",
    image_url: doctrine.image_url ?? "",
    is_active: toBoolean(doctrine.is_active),
  };
}

function normalizeItem(item) {
  return {
    ...itemInitialForm,
    ...item,
    doctrine_id: String(item.doctrine_id ?? ""),
    content: item.content ?? "",
    bible_references: item.bible_references ?? "",
    is_active: toBoolean(item.is_active),
  };
}

function getDoctrinePayload(form) {
  return {
    title: form.title,
    slug: form.slug,
    summary: form.summary,
    image_url: form.image_url,
    sort_order: Number(form.sort_order) || 0,
    is_active: form.is_active ? 1 : 0,
  };
}

function getItemPayload(form) {
  return {
    doctrine_id: Number(form.doctrine_id),
    title: form.title,
    slug: form.slug,
    content: form.content,
    bible_references: form.bible_references,
    sort_order: Number(form.sort_order) || 0,
    is_active: form.is_active ? 1 : 0,
  };
}

export default function BeliefsAdminPage() {
  const [doctrines, setDoctrines] = useState([]);
  const [items, setItems] = useState([]);
  const [doctrineForm, setDoctrineForm] = useState(doctrineInitialForm);
  const [itemForm, setItemForm] = useState(itemInitialForm);
  const [editingDoctrineId, setEditingDoctrineId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedDoctrineId, setSelectedDoctrineId] = useState("");
  const [loading, setLoading] = useState({ doctrines: true, items: true });
  const [errors, setErrors] = useState({ doctrines: null, items: null });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDoctrines = useCallback(async () => {
    try {
      setLoading((current) => ({ ...current, doctrines: true }));
      const res = await listBeliefDoctrines();
      setDoctrines(res.doctrines ?? []);
      setErrors((current) => ({ ...current, doctrines: null }));
    } catch (err) {
      setErrors((current) => ({ ...current, doctrines: err.message || "No se pudieron cargar las doctrinas" }));
    } finally {
      setLoading((current) => ({ ...current, doctrines: false }));
    }
  }, []);

  const fetchItems = useCallback(async (doctrineId = "") => {
    try {
      setLoading((current) => ({ ...current, items: true }));
      const res = await listBeliefItems(doctrineId);
      setItems(res.items ?? []);
      setErrors((current) => ({ ...current, items: null }));
    } catch (err) {
      setErrors((current) => ({ ...current, items: err.message || "No se pudieron cargar las creencias" }));
    } finally {
      setLoading((current) => ({ ...current, items: false }));
    }
  }, []);

  useEffect(() => {
    fetchDoctrines();
    fetchItems("");
  }, [fetchDoctrines, fetchItems]);

  const handleDoctrineChange = (event) => {
    const { name, value } = event.target;
    setDoctrineForm((current) => ({ ...current, [name]: value }));
  };

  const handleItemChange = (event) => {
    const { name, value } = event.target;
    setItemForm((current) => ({ ...current, [name]: value }));
  };

  const resetDoctrineForm = () => {
    setEditingDoctrineId(null);
    setDoctrineForm(doctrineInitialForm);
  };

  const resetItemForm = () => {
    setEditingItemId(null);
    setItemForm((current) => ({
      ...itemInitialForm,
      doctrine_id: selectedDoctrineId || current.doctrine_id || "",
    }));
  };

  const startEditDoctrine = (doctrine) => {
    setEditingDoctrineId(doctrine.id);
    setDoctrineForm(normalizeDoctrine(doctrine));
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setItemForm(normalizeItem(item));
  };

  const handleDoctrineSubmit = async (event) => {
    event.preventDefault();

    try {
      setActionLoading("save-doctrine");
      const payload = getDoctrinePayload(doctrineForm);

      if (editingDoctrineId) {
        await updateBeliefDoctrine(editingDoctrineId, payload);
        toastBus.success("Doctrina actualizada");
      } else {
        await createBeliefDoctrine(payload);
        toastBus.success("Doctrina creada");
      }

      resetDoctrineForm();
      await fetchDoctrines();
    } finally {
      setActionLoading(null);
    }
  };

  const handleItemSubmit = async (event) => {
    event.preventDefault();

    try {
      setActionLoading("save-item");
      const payload = getItemPayload(itemForm);

      if (editingItemId) {
        await updateBeliefItem(editingItemId, payload);
        toastBus.success("Creencia actualizada");
      } else {
        await createBeliefItem(payload);
        toastBus.success("Creencia creada");
      }

      resetItemForm();
      await fetchItems(selectedDoctrineId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDoctrine = async (doctrine) => {
    const normalized = normalizeDoctrine(doctrine);

    if (
      normalized.is_active &&
      !confirmDestructive({
        title: `Desactivar doctrina "${doctrine.title}"`,
        detail: "La doctrina dejará de verse en la página pública.",
        action: "Desactivar doctrina",
      })
    ) {
      return;
    }

    try {
      setActionLoading(`doctrine-${doctrine.id}`);
      if (normalized.is_active) {
        await deactivateBeliefDoctrine(doctrine.id);
        toastBus.success("Doctrina desactivada");
      } else {
        await updateBeliefDoctrine(doctrine.id, { is_active: 1 });
        toastBus.success("Doctrina activada");
      }
      await fetchDoctrines();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleItem = async (item) => {
    const normalized = normalizeItem(item);

    if (
      normalized.is_active &&
      !confirmDestructive({
        title: `Desactivar creencia "${item.title}"`,
        detail: "La creencia dejará de verse en la página pública.",
        action: "Desactivar creencia",
      })
    ) {
      return;
    }

    try {
      setActionLoading(`item-${item.id}`);
      if (normalized.is_active) {
        await deactivateBeliefItem(item.id);
        toastBus.success("Creencia desactivada");
      } else {
        await updateBeliefItem(item.id, { is_active: 1 });
        toastBus.success("Creencia activada");
      }
      await fetchItems(selectedDoctrineId);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterItems = async (event) => {
    const doctrineId = event.target.value;
    setSelectedDoctrineId(doctrineId);
    setItemForm((current) => ({ ...current, doctrine_id: doctrineId || current.doctrine_id }));
    await fetchItems(doctrineId);
  };

  return (
    <div className="beliefs-admin-page">
      <PageHeader
        title="Creencias"
        description="Gestioná doctrinas principales y sus creencias internas publicadas en el sitio."
      />

      <SectionHeader
        title={editingDoctrineId ? "Editar doctrina" : "Crear doctrina"}
        description="Definí título, imagen, resumen, orden y visibilidad pública."
      />

      <FormLayout columns={2} onSubmit={handleDoctrineSubmit}>
        <Field label="Título" name="title" value={doctrineForm.title} onChange={handleDoctrineChange} required />
        <Field label="Slug" name="slug" value={doctrineForm.slug} onChange={handleDoctrineChange} placeholder="dios" required />
        <Field label="Resumen" type="textarea" name="summary" value={doctrineForm.summary} onChange={handleDoctrineChange} rows={3} span />
        <ImageUrlField label="Imagen" name="image_url" value={doctrineForm.image_url} onChange={handleDoctrineChange} placeholder="/assets/images/..." span />
        <Field label="Orden" type="number" name="sort_order" value={doctrineForm.sort_order} onChange={handleDoctrineChange} />
        <SwitchField
          label="Activa"
          checked={doctrineForm.is_active}
          onChange={(checked) => setDoctrineForm((current) => ({ ...current, is_active: checked }))}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={actionLoading === "save-doctrine"}>
            {editingDoctrineId ? "Guardar doctrina" : "Crear doctrina"}
          </button>
          {editingDoctrineId && (
            <button type="button" className="btn btn-secondary" onClick={resetDoctrineForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </FormLayout>

      <SectionHeader title="Doctrinas" description="Listado de doctrinas principales." />

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          { key: "title", label: "Título", width: "180px" },
          { key: "slug", label: "Slug", width: "180px" },
          { key: "summary", label: "Resumen", width: "320px", truncate: true },
          { key: "sort_order", label: "Orden", width: "90px" },
          { key: "is_active", label: "Estado", width: "100px", render: (row) => (toBoolean(row.is_active) ? "Activa" : "Inactiva") },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={doctrines}
        loading={loading.doctrines}
        error={errors.doctrines}
        emptyText="No hay doctrinas registradas"
        renderActions={(doctrine) => {
          const isActive = toBoolean(doctrine.is_active);
          return (
            <>
              <a className="btn-icon" title="Ver doctrina pública" href={`/creencias/${doctrine.slug}`} target="_blank" rel="noreferrer">
                <FaExternalLinkAlt />
              </a>
              <button className="btn-icon" title="Editar" onClick={() => startEditDoctrine(doctrine)}>
                <FaEdit />
              </button>
              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `doctrine-${doctrine.id}`}
                onClick={() => handleToggleDoctrine(doctrine)}
              >
                {isActive ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </>
          );
        }}
      />

      <SectionHeader
        title={editingItemId ? "Editar creencia" : "Crear creencia"}
        description="Cargá el texto completo, referencias bíblicas, orden y estado dentro de una doctrina."
      />

      <FormLayout columns={2} onSubmit={handleItemSubmit}>
        <SelectField label="Doctrina" name="doctrine_id" value={itemForm.doctrine_id} onChange={handleItemChange} required>
          <option value="">Seleccionar doctrina</option>
          {doctrines.map((doctrine) => (
            <option value={doctrine.id} key={doctrine.id}>
              {doctrine.title}
            </option>
          ))}
        </SelectField>
        <Field label="Título" name="title" value={itemForm.title} onChange={handleItemChange} required />
        <Field label="Slug" name="slug" value={itemForm.slug} onChange={handleItemChange} placeholder="la-trinidad" required />
        <Field label="Orden" type="number" name="sort_order" value={itemForm.sort_order} onChange={handleItemChange} />
        <RichTextEditor
          label="Texto completo"
          value={itemForm.content}
          onChange={(content) => setItemForm((current) => ({ ...current, content }))}
          placeholder="Escribí el contenido completo de la creencia..."
          span
          required
        />
        <Field
          label="Referencias bíblicas"
          type="textarea"
          name="bible_references"
          value={itemForm.bible_references}
          onChange={handleItemChange}
          rows={3}
          span
        />
        <SwitchField
          label="Activa"
          checked={itemForm.is_active}
          onChange={(checked) => setItemForm((current) => ({ ...current, is_active: checked }))}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={actionLoading === "save-item"}>
            {editingItemId ? "Guardar creencia" : "Crear creencia"}
          </button>
          {editingItemId && (
            <button type="button" className="btn btn-secondary" onClick={resetItemForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </FormLayout>

      <SectionHeader title="Creencias internas" description="Filtrá y administrá las creencias de cada doctrina." />

      <div className="beliefs-admin-page__filter">
        <SelectField label="Filtrar por doctrina" name="selected_doctrine" value={selectedDoctrineId} onChange={handleFilterItems}>
          <option value="">Todas las doctrinas</option>
          {doctrines.map((doctrine) => (
            <option value={doctrine.id} key={doctrine.id}>
              {doctrine.title}
            </option>
          ))}
        </SelectField>
      </div>

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          { key: "title", label: "Título", width: "220px" },
          { key: "doctrine_title", label: "Doctrina", width: "180px" },
          { key: "bible_references", label: "Referencias", width: "240px", truncate: true },
          { key: "sort_order", label: "Orden", width: "90px" },
          { key: "is_active", label: "Estado", width: "100px", render: (row) => (toBoolean(row.is_active) ? "Activa" : "Inactiva") },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={items}
        loading={loading.items}
        error={errors.items}
        emptyText="No hay creencias registradas"
        renderActions={(item) => {
          const isActive = toBoolean(item.is_active);
          return (
            <>
              <button className="btn-icon" title="Editar" onClick={() => startEditItem(item)}>
                <FaEdit />
              </button>
              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `item-${item.id}`}
                onClick={() => handleToggleItem(item)}
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
