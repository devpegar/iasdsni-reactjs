import { useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import useCrud from "../hooks/useCrud";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";

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

export default function HeroSlidesPage() {
  const {
    list: slides,
    createItem,
    updateItem,
    deleteItem,
    loading,
  } = useCrud("/admin/hero_slides");

  const formRef = useRef(null);

  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

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

        <Field
          label="URL de imagen"
          type="text"
          name="image_path"
          value={form.image_path}
          onChange={handleChange}
          span
        />

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
        data={slides}
        loading={loading}
        emptyText="No hay hero slides registrados"
        renderActions={(slide) => (
          <>
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
              onClick={() => deleteItem(slide.id)}
            >
              <FaTrash />
            </button>
          </>
        )}
      />
    </div>
  );
}
