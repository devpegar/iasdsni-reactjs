import { useMemo, useRef, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaEdit,
  FaToggleOff,
  FaToggleOn,
  FaTrash,
} from "react-icons/fa";
import useCrud from "../hooks/useCrud";
import useFormEdit from "../hooks/useFormEdit";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import { confirmDestructive } from "../utils/confirmAction";

const BASE_PATH = "/admin/daily_verses";

const initialForm = {
  text: "",
  reference: "",
  eop: "",
  position: "",
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeVerse(verse) {
  return {
    ...initialForm,
    ...verse,
    text: verse.text ?? verse.texto ?? "",
    reference: verse.reference ?? verse.versiculo ?? "",
    eop: verse.eop ?? "",
    position: verse.position ?? "",
    is_active: toBoolean(verse.is_active ?? verse.active ?? true),
  };
}

function getPayload(verse) {
  return {
    text: verse.text,
    reference: verse.reference,
    eop: verse.eop,
    position: verse.position === "" ? null : Number(verse.position),
    is_active: verse.is_active ? 1 : 0,
  };
}

export default function DailyVersesPage() {
  const {
    list: verses,
    createItem,
    updateItem,
    deleteItem,
    loading,
  } = useCrud(BASE_PATH);

  const formRef = useRef(null);
  const [actionLoading, setActionLoading] = useState(null);

  const { form, setForm, handleChange, resetForm, editingId, setEditingId } =
    useFormEdit(initialForm, { formRef });

  const orderedVerses = useMemo(
    () =>
      [...verses].sort((a, b) => {
        const positionA = Number(a.position ?? 0);
        const positionB = Number(b.position ?? 0);

        if (positionA !== positionB) return positionA - positionB;
        return Number(a.id ?? 0) - Number(b.id ?? 0);
      }),
    [verses],
  );

  const startEdit = (verse) => {
    setEditingId(verse.id);
    setForm(normalizeVerse(verse));

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = getPayload(form);

    if (editingId) {
      await updateItem(editingId, payload);
    } else {
      await createItem(payload);
    }

    resetForm();
  };

  const handleToggleActive = async (verse) => {
    const normalized = normalizeVerse(verse);
    const nextVerse = {
      ...normalized,
      is_active: !normalized.is_active,
    };

    try {
      setActionLoading(`toggle-${verse.id}`);
      await updateItem(verse.id, getPayload(nextVerse));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorder = async (verse, direction) => {
    const currentIndex = orderedVerses.findIndex((item) => item.id === verse.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= orderedVerses.length
    ) {
      return;
    }

    const currentVerse = normalizeVerse(orderedVerses[currentIndex]);
    const targetVerse = normalizeVerse(orderedVerses[targetIndex]);
    const currentPosition = currentVerse.position || currentIndex + 1;
    const targetPosition = targetVerse.position || targetIndex + 1;

    try {
      setActionLoading(`reorder-${verse.id}-${direction}`);
      await updateItem(currentVerse.id, {
        ...getPayload(currentVerse),
        position: Number(targetPosition),
      });
      await updateItem(targetVerse.id, {
        ...getPayload(targetVerse),
        position: Number(currentPosition),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (verse) => {
    const normalized = normalizeVerse(verse);
    if (
      !confirmDestructive({
        title: `Eliminar versículo "${normalized.reference}"`,
        detail: "El versículo se quitará del listado diario.",
        action: "Eliminar versículo",
        irreversible: true,
      })
    ) {
      return;
    }

    try {
      setActionLoading(`delete-${verse.id}`);
      await deleteItem(verse.id);

      if (editingId === verse.id) {
        resetForm();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="daily-verses-page" ref={formRef}>
      <PageHeader
        title="Versículo diario"
        description="Administrá textos, referencias y orden de los versículos mostrados en el sitio."
        actions={
          editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Crear nuevo versículo
            </button>
          )
        }
      />

      <SectionHeader
        title={editingId ? "Editar versículo diario" : "Crear versículo diario"}
        description="Completá la referencia, el texto y su posición en el listado."
      />

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field
          label="Referencia"
          type="text"
          name="reference"
          value={form.reference}
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
          label="Texto"
          type="textarea"
          name="text"
          value={form.text}
          onChange={handleChange}
          rows={4}
          span
          required
        />

        <Field
          label="EOP"
          type="textarea"
          name="eop"
          value={form.eop}
          onChange={handleChange}
          rows={3}
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
            {editingId ? "Guardar cambios" : "Crear versículo"}
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

      <SectionHeader
        title="Listado de versículos diarios"
        description="Reordená, editá o eliminá los versículos disponibles."
      />

      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          {
            key: "reference",
            label: "Referencia",
            width: "180px",
            render: (verse) => normalizeVerse(verse).reference || "-",
          },
          {
            key: "text",
            label: "Texto",
            width: "360px",
            truncate: true,
            render: (verse) => normalizeVerse(verse).text || "-",
          },
          {
            key: "eop",
            label: "EOP",
            width: "260px",
            truncate: true,
            render: (verse) => normalizeVerse(verse).eop || "-",
          },
          {
            key: "position",
            label: "Orden",
            width: "80px",
            render: (verse) => verse.position ?? "-",
          },
          {
            key: "is_active",
            label: "Estado",
            width: "100px",
            render: (verse) =>
              toBoolean(verse.is_active ?? verse.active ?? true)
                ? "Activo"
                : "Inactivo",
          },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={orderedVerses}
        loading={loading}
        emptyText="No hay versículos diarios registrados"
        renderActions={(verse) => {
          const index = orderedVerses.findIndex((item) => item.id === verse.id);
          const isActive = toBoolean(verse.is_active ?? verse.active ?? true);

          return (
            <>
              <button
                className="btn-icon"
                title="Mover arriba"
                disabled={index <= 0 || actionLoading === `reorder-${verse.id}-up`}
                onClick={() => handleReorder(verse, "up")}
              >
                <FaArrowUp />
              </button>

              <button
                className="btn-icon"
                title="Mover abajo"
                disabled={
                  index === orderedVerses.length - 1 ||
                  actionLoading === `reorder-${verse.id}-down`
                }
                onClick={() => handleReorder(verse, "down")}
              >
                <FaArrowDown />
              </button>

              <button
                className="btn-icon"
                title={isActive ? "Desactivar" : "Activar"}
                disabled={actionLoading === `toggle-${verse.id}`}
                onClick={() => handleToggleActive(verse)}
              >
                {isActive ? <FaToggleOn /> : <FaToggleOff />}
              </button>

              <button
                className="btn-icon"
                title="Editar"
                onClick={() => startEdit(verse)}
              >
                <FaEdit />
              </button>

              <button
                className="btn-icon btn-danger"
                title="Eliminar"
                disabled={actionLoading === `delete-${verse.id}`}
                onClick={() => handleDelete(verse)}
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
