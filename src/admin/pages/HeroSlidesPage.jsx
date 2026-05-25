import { useMemo, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaEdit,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import useCrud from "../hooks/useCrud";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import Field from "../components/form/Field";
import TableActions from "../components/ui/TableActions";
import AdminCard from "../components/ui/AdminCard";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import ImageUrlField from "../components/media/ImageUrlField";
import SwitchField from "../components/form/SwitchField";
import { apiPost, apiPostForm } from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { toastBus } from "../../services/toastBus";
import AdminAlert from "../components/ui/AdminAlert";
import { confirmDestructive } from "../utils/confirmAction";

const BASE_PATH = "/admin/hero_slides";

const initialForm = {
  title: "",
  description: "",
  button_text: "",
  button_link: "",
  image_path: "",
  position: "",
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeSlide(slide) {
  return {
    ...initialForm,
    ...slide,
    is_active: toBoolean(slide.is_active ?? slide.active ?? true),
    position: slide.position ?? "",
  };
}

function getImageValue(data) {
  return (
    data.image_path ||
    data.path ||
    data.url ||
    data.image_url ||
    data.file_path ||
    data.file ||
    ""
  );
}

export default function HeroSlidesPage() {
  const {
    list: slides,
    createItem,
    updateItem,
    deleteItem,
    refresh,
    loading,
    error,
  } = useCrud(BASE_PATH);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [formError, setFormError] = useState(null);
  const [imageError, setImageError] = useState(null);

  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

  const orderedSlides = useMemo(
    () =>
      [...slides].sort((a, b) => {
        const positionA = Number(a.position ?? 0);
        const positionB = Number(b.position ?? 0);

        if (positionA !== positionB) return positionA - positionB;
        return Number(a.id ?? 0) - Number(b.id ?? 0);
      }),
    [slides],
  );

  const startEdit = (slide) => {
    setEditingId(slide.id);
    setForm(normalizeSlide(slide));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      button_text: form.button_text,
      button_link: form.button_link,
      image_path: form.image_path,
      position: form.position === "" ? null : Number(form.position),
      is_active: form.is_active ? 1 : 0,
    };

    try {
      setFormError(null);

      if (editingId) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }

      resetForm();
    } catch (err) {
      setFormError(err.message || "No se pudo guardar el slide");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    if (editingId) {
      data.append("id", editingId);
    }

    try {
      setImageError(null);
      setUploading(true);
      const res = await apiPostForm(`${BASE_PATH}/upload_image.php`, data);
      const imagePath = getImageValue(res);

      if (!imagePath) {
        const message = "No se recibió la ruta de la imagen";
        setImageError(message);
        toastBus.error(message);
        return;
      }

      setForm((prev) => ({ ...prev, image_path: imagePath }));
      toastBus.success("Imagen subida");
    } catch (err) {
      setImageError(err.message || "No se pudo subir la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleToggleActive = async (slide) => {
    const nextValue = !toBoolean(slide.is_active ?? slide.active ?? true);

    try {
      setActionLoading(`toggle-${slide.id}`);
      await apiPost(`${BASE_PATH}/toggle_active.php`, {
        id: slide.id,
        slide_id: slide.id,
        is_active: nextValue ? 1 : 0,
      });
      await refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorder = async (slide, direction) => {
    const currentIndex = orderedSlides.findIndex((item) => item.id === slide.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= orderedSlides.length
    ) {
      return;
    }

    const nextSlides = [...orderedSlides];
    [nextSlides[currentIndex], nextSlides[targetIndex]] = [
      nextSlides[targetIndex],
      nextSlides[currentIndex],
    ];

    const order = nextSlides.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    try {
      setActionLoading(`reorder-${slide.id}-${direction}`);
      await apiPost(`${BASE_PATH}/reorder.php`, {
        slides: order,
        order,
      });
      await refresh();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (slide) => {
    if (
      !confirmDestructive({
        title: `Eliminar slide "${slide.title}"`,
        detail: "El slide se quitará del carrusel principal.",
        action: "Eliminar slide",
        irreversible: true,
      })
    ) {
      return;
    }

    try {
      setActionLoading(`delete-${slide.id}`);
      await deleteItem(slide.id);

      if (editingId === slide.id) {
        resetForm();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="hero-slides-page" ref={formRef}>
      <PageHeader
        title="Hero slides"
        description="Administrá banners, textos, llamadas a la acción, imágenes y orden del carrusel principal."
        actions={
          editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Crear nuevo slide
            </button>
          )
        }
      />

      <AdminCard>
        <SectionHeader
          title={editingId ? "Editar hero slide" : "Crear hero slide"}
          description="Completá el contenido visible del slide y definí si queda publicado."
        />

        <FormLayout columns={2} onSubmit={handleSubmit}>
          <AdminAlert variant="error">{formError}</AdminAlert>

          <Field
            label="Título"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <Field
            label="Orden"
            type="number"
            name="position"
            value={form.position}
            onChange={handleChange}
            helpText="Define la posición del slide en el carrusel."
          />

          <Field
            label="Descripción"
            type="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            span
          />

          <Field
            label="Texto del botón"
            type="text"
            name="button_text"
            value={form.button_text}
            onChange={handleChange}
          />

          <Field
            label="URL del botón"
            type="text"
            name="button_link"
            value={form.button_link}
            onChange={handleChange}
            helpText="Usá una ruta interna como /pagina/historia o una URL completa."
          />

          <ImageUrlField
            label="URL de imagen"
            name="image_path"
            value={form.image_path}
            onChange={handleChange}
            placeholder="/uploads/media/hero/... o https://..."
            span
          />

          <div className="hero-slide-image-field full-span">
            <AdminAlert variant="error">{imageError}</AdminAlert>
            <label className="label">
              Imagen
              <div className="hero-slide-image-field__controls">
                <input
                  ref={fileInputRef}
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaUpload />
                  {uploading ? "Subiendo..." : "Subir imagen"}
                </button>
              </div>
              <p className="field-message">Podés pegar una URL arriba o subir una imagen para completar el campo automáticamente.</p>
            </label>
          </div>

          <SwitchField
            label="Activo"
            checked={form.is_active}
            onChange={(checked) =>
              setForm((prev) => ({ ...prev, is_active: checked }))
            }
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Guardar cambios" : "Crear slide"}
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
        title="Listado de hero slides"
        description="Reordená, publicá o editá los slides activos del carrusel."
      />

      <TableLayout
        toolbar={`${orderedSlides.length} slides configurados`}
        columns={[
          { type: "index", label: "#", width: "60px", mobileHidden: true },
          {
            key: "image",
            label: "Imagen",
            width: "96px",
            mobileHidden: true,
            render: (slide) => {
              const src = resolveMediaUrl(slide.image_url || slide.image_path);

              return src ? (
                <img
                  className="hero-slide-thumb"
                  src={src}
                  alt={slide.title || "Hero slide"}
                />
              ) : (
                "-"
              );
            },
          },
          { key: "title", label: "Título", width: "220px", truncate: true },
          {
            key: "description",
            label: "Descripción",
            width: "320px",
            truncate: true,
          },
          {
            key: "button_text",
            label: "Botón",
            width: "160px",
            truncate: true,
          },
          {
            key: "position",
            label: "Orden",
            width: "80px",
            render: (slide) => slide.position ?? "-",
          },
          {
            key: "is_active",
            label: "Estado",
            width: "100px",
            mobileHidden: true,
            render: (slide) =>
              toBoolean(slide.is_active ?? slide.active ?? true)
                ? <StatusBadge variant="success">Activo</StatusBadge>
                : <StatusBadge variant="warning">Inactivo</StatusBadge>,
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={orderedSlides}
        loading={loading}
        error={error}
        emptyTitle="No hay hero slides registrados"
        emptyDescription="Creá un slide para empezar a armar el carrusel principal."
        mobileTitle={(slide) => slide.title || "Hero slide sin título"}
        mobileDescription={(slide) => slide.description || slide.button_text || "Sin descripción"}
        mobileBadges={(slide) =>
          toBoolean(slide.is_active ?? slide.active ?? true) ? (
            <StatusBadge variant="success">Activo</StatusBadge>
          ) : (
            <StatusBadge variant="warning">Inactivo</StatusBadge>
          )
        }
        mobileCompact
        renderActions={(slide) => {
          const index = orderedSlides.findIndex((item) => item.id === slide.id);
          const isActive = toBoolean(slide.is_active ?? slide.active ?? true);

          return (
            <TableActions>
              <button
                className="btn-icon"
                title="Mover arriba"
                disabled={index <= 0 || actionLoading === `reorder-${slide.id}-up`}
                onClick={() => handleReorder(slide, "up")}
              >
                <FaArrowUp />
              </button>

              <button
                className="btn-icon"
                title="Mover abajo"
                disabled={
                  index === orderedSlides.length - 1 ||
                  actionLoading === `reorder-${slide.id}-down`
                }
                onClick={() => handleReorder(slide, "down")}
              >
                <FaArrowDown />
              </button>

              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `toggle-${slide.id}`}
                onClick={() => handleToggleActive(slide)}
              >
                {isActive ? <FaToggleOn /> : <FaToggleOff />}
              </button>

              <button
                className="btn-icon"
                title="Editar"
                onClick={() => startEdit(slide)}
              >
                <FaEdit />
              </button>

              <button
                className="btn-icon btn-danger"
                title="Eliminar"
                disabled={actionLoading === `delete-${slide.id}`}
                onClick={() => handleDelete(slide)}
              >
                <FaTrash />
              </button>
            </TableActions>
          );
        }}
      />
    </div>
  );
}
