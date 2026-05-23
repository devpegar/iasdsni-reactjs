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
import ImageUrlField from "../components/media/ImageUrlField";
import SwitchField from "../components/form/SwitchField";
import { apiPost, apiPostForm } from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { toastBus } from "../../services/toastBus";

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
  } = useCrud(BASE_PATH);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

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

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
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
      setUploading(true);
      const res = await apiPostForm(`${BASE_PATH}/upload_image.php`, data);
      const imagePath = getImageValue(res);

      if (!imagePath) {
        toastBus.error("No se recibio la ruta de la imagen");
        return;
      }

      setForm((prev) => ({ ...prev, image_path: imagePath }));
      toastBus.success("Imagen subida");
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
    if (!window.confirm(`Eliminar el slide "${slide.title}"?`)) return;

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
      <h2>{editingId ? "Editar Hero Slide" : "Crear Hero Slide"}</h2>

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field
          label="Titulo"
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
        />

        <Field
          label="Descripcion"
          type="textarea"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          span
        />

        <Field
          label="Texto del boton"
          type="text"
          name="button_text"
          value={form.button_text}
          onChange={handleChange}
        />

        <Field
          label="URL del boton"
          type="text"
          name="button_link"
          value={form.button_link}
          onChange={handleChange}
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
            {editingId ? "Guardar Cambios" : "Crear Slide"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancelar edicion
            </button>
          )}
        </div>
      </FormLayout>

      <h3>Listado de hero slides</h3>

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          {
            key: "image",
            label: "Imagen",
            width: "96px",
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
          { key: "title", label: "Titulo", width: "220px", truncate: true },
          {
            key: "description",
            label: "Descripcion",
            width: "320px",
            truncate: true,
          },
          {
            key: "button_text",
            label: "Boton",
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
            render: (slide) =>
              toBoolean(slide.is_active ?? slide.active ?? true)
                ? "Activo"
                : "Inactivo",
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={orderedSlides}
        loading={loading}
        emptyText="No hay hero slides registrados"
        renderActions={(slide) => {
          const index = orderedSlides.findIndex((item) => item.id === slide.id);
          const isActive = toBoolean(slide.is_active ?? slide.active ?? true);

          return (
            <>
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
            </>
          );
        }}
      />
    </div>
  );
}
