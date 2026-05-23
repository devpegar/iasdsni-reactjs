import { useEffect, useRef, useState } from "react";
import { FaEdit, FaExternalLinkAlt, FaToggleOff, FaToggleOn } from "react-icons/fa";
import Field from "../components/form/Field";
import ImageUrlField from "../components/media/ImageUrlField";
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
  page_type: "page",
  meta_description: "",
  excerpt: "",
  featured_image: "",
  published_at: "",
  content: "",
  seo_title: "",
  og_image: "",
  canonical_url: "",
  noindex: false,
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizePage(page) {
  return {
    ...initialForm,
    ...page,
    page_type: page.page_type ?? "page",
    meta_description: page.meta_description ?? "",
    excerpt: page.excerpt ?? "",
    featured_image: page.featured_image ?? "",
    published_at: page.published_at ? page.published_at.replace(" ", "T").slice(0, 16) : "",
    content: page.content ?? "",
    seo_title: page.seo_title ?? "",
    og_image: page.og_image ?? "",
    canonical_url: page.canonical_url ?? "",
    noindex: toBoolean(page.noindex ?? false),
    is_active: toBoolean(page.is_active ?? true),
  };
}

function getPayload(page) {
  return {
    slug: page.slug,
    title: page.title,
    page_type: page.page_type,
    meta_description: page.meta_description,
    excerpt: page.excerpt,
    featured_image: page.featured_image,
    published_at: page.published_at ? page.published_at.replace("T", " ") : "",
    content: page.content,
    seo_title: page.seo_title,
    og_image: page.og_image,
    canonical_url: page.canonical_url,
    noindex: page.noindex ? 1 : 0,
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
          label="Tipo de contenido"
          type="select"
          name="page_type"
          value={form.page_type}
          onChange={handleChange}
        >
          <option value="page">Página</option>
          <option value="news">Noticia</option>
          <option value="announcement">Anuncio</option>
          <option value="event">Evento</option>
        </Field>

        <Field
          label="Fecha de publicación"
          type="datetime-local"
          name="published_at"
          value={form.published_at}
          onChange={handleChange}
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
          label="Resumen"
          type="textarea"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          rows={3}
          span
        />

        <ImageUrlField
          label="Imagen destacada"
          name="featured_image"
          value={form.featured_image}
          onChange={handleChange}
          placeholder="/uploads/... o https://..."
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

        <div className="card full-span dynamic-pages-page__seo">
          <div className="card-header">
            <h3>SEO</h3>
          </div>

          <div className="dynamic-pages-page__seo-grid">
            <Field
              label="Título SEO"
              type="text"
              name="seo_title"
              value={form.seo_title}
              onChange={handleChange}
              placeholder="Si queda vacío usa el título"
            />

            <ImageUrlField
              label="Imagen Open Graph"
              name="og_image"
              value={form.og_image}
              onChange={handleChange}
              placeholder="/uploads/... o https://..."
              span
            />

            <Field
              label="URL canónica"
              type="text"
              name="canonical_url"
              value={form.canonical_url}
              onChange={handleChange}
              placeholder="/pagina/historia o https://..."
              span
            />

            <SwitchField
              label="No indexar"
              checked={form.noindex}
              onChange={(checked) =>
                setForm((prev) => ({ ...prev, noindex: checked }))
              }
            />
          </div>
        </div>

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
            key: "page_type",
            label: "Tipo",
            width: "120px",
            render: (page) => page.page_type || "page",
          },
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
