import { useEffect, useRef, useState } from "react";
import { FaEdit, FaExternalLinkAlt, FaToggleOff, FaToggleOn } from "react-icons/fa";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import {
  createPage,
  deactivatePage,
  listPages,
  updatePage,
} from "../services/pagesService";
import { toastBus } from "../../services/toastBus";

const initialForm = {
  slug: "",
  title: "",
  meta_description: "",
  content: "",
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizePage(page) {
  return {
    ...initialForm,
    ...page,
    meta_description: page.meta_description ?? "",
    content: page.content ?? "",
    is_active: toBoolean(page.is_active ?? true),
  };
}

function getPayload(page) {
  return {
    slug: page.slug,
    title: page.title,
    meta_description: page.meta_description,
    content: page.content,
    is_active: page.is_active ? 1 : 0,
  };
}

export default function DynamicPagesPage() {
  const formRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

  const fetchPages = async (search = query) => {
    try {
      setLoading(true);
      const res = await listPages(search);
      setPages(res.pages ?? []);
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las páginas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages("");
  }, []);

  const startEdit = (page) => {
    setEditingId(page.id);
    setForm(normalizePage(page));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = getPayload(form);

    try {
      setActionLoading("save");

      if (editingId) {
        await updatePage(editingId, payload);
        toastBus.success("Página actualizada");
      } else {
        await createPage(payload);
        toastBus.success("Página creada");
      }

      resetForm();
      await fetchPages();
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (page) => {
    const normalized = normalizePage(page);

    if (normalized.is_active && !window.confirm(`Desactivar la página "${page.title}"?`)) {
      return;
    }

    try {
      setActionLoading(`toggle-${page.id}`);

      if (normalized.is_active) {
        await deactivatePage(page.id);
        toastBus.success("Página desactivada");
      } else {
        await updatePage(page.id, { is_active: 1 });
        toastBus.success("Página activada");
      }

      await fetchPages();

      if (normalized.is_active && editingId === page.id) {
        resetForm();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchPages(query);
  };

  return (
    <div className="dynamic-pages-page" ref={formRef}>
      <h2>{editingId ? "Editar Página" : "Crear Página"}</h2>

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field
          label="Slug"
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="historia"
          required
        />

        <Field
          label="Título"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Field
          label="Meta descripción"
          type="textarea"
          name="meta_description"
          value={form.meta_description}
          onChange={handleChange}
          rows={3}
          span
        />

        <Field
          label="Contenido"
          type="textarea"
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={8}
          span
        />

        <SwitchField
          label="Activa"
          checked={form.is_active}
          onChange={(checked) =>
            setForm((prev) => ({ ...prev, is_active: checked }))
          }
        />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={actionLoading === "save"}>
            {editingId ? "Guardar Cambios" : "Crear Página"}
          </button>

          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </FormLayout>

      <h3>Listado de páginas</h3>

      <form className="form form--inline" onSubmit={handleSearch}>
        <Field
          label="Buscar"
          type="text"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="slug o título"
        />
        <button type="submit" className="btn btn-secondary">
          Buscar
        </button>
      </form>

      {error && <p>{error}</p>}

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          { key: "title", label: "Título", width: "220px" },
          { key: "slug", label: "Slug", width: "180px" },
          {
            key: "meta_description",
            label: "Meta descripción",
            width: "260px",
            truncate: true,
          },
          {
            key: "is_active",
            label: "Estado",
            width: "100px",
            render: (page) => (toBoolean(page.is_active) ? "Activa" : "Inactiva"),
          },
          {
            key: "updated_at",
            label: "Actualizada",
            width: "170px",
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={pages}
        loading={loading}
        emptyText="No hay páginas registradas"
        renderActions={(page) => {
          const isActive = toBoolean(page.is_active);

          return (
            <>
              <a
                className="btn-icon"
                title="Ver página pública"
                href={`/pagina/${page.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaExternalLinkAlt />
              </a>

              <button className="btn-icon" title="Editar" onClick={() => startEdit(page)}>
                <FaEdit />
              </button>

              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `toggle-${page.id}`}
                onClick={() => handleToggleActive(page)}
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
