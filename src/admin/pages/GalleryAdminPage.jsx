import { useEffect, useState } from "react";
import { FaEdit, FaImage, FaSave, FaToggleOff, FaTrash } from "react-icons/fa";
import Field from "../components/form/Field";
import SwitchField from "../components/form/SwitchField";
import MediaPickerModal from "../components/media/MediaPickerModal";
import FormLayout from "../layout/FormLayout";
import TableLayout from "../layout/TableLayout";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import {
  addGalleryItem,
  createGalleryAlbum,
  deleteGalleryAlbum,
  deleteGalleryItem,
  listGalleryAlbumsAdmin,
  listGalleryItems,
  updateGalleryAlbum,
  updateGalleryItem,
} from "../services/galleryAdminService";
import { toastBus } from "../../services/toastBus";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  cover_media_id: "",
  cover_image_url: "",
  event_date: "",
  sort_order: 0,
  is_featured: false,
  is_active: true,
};

function toBoolean(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeAlbum(album) {
  return {
    ...initialForm,
    ...album,
    cover_media_id: album.cover_media_id || "",
    cover_image_url: album.cover_image_url || "",
    is_featured: toBoolean(album.is_featured),
    is_active: toBoolean(album.is_active),
  };
}

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [pickerMode, setPickerMode] = useState(null);
  const [itemDrafts, setItemDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await listGalleryAlbumsAdmin();
      setAlbums(res.albums ?? []);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (albumId) => {
    if (!albumId) {
      setItems([]);
      return;
    }

    const res = await listGalleryItems(albumId);
    const nextItems = res.items ?? [];
    setItems(nextItems);
    setItemDrafts(
      nextItems.reduce((acc, item) => {
        acc[item.id] = {
          caption: item.caption || "",
          sort_order: item.sort_order ?? 0,
        };
        return acc;
      }, {}),
    );
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      cover_media_id: form.cover_media_id || null,
      sort_order: Number(form.sort_order || 0),
      is_featured: form.is_featured ? 1 : 0,
      is_active: form.is_active ? 1 : 0,
    };

    try {
      setActionLoading("save-album");
      if (editingId) {
        await updateGalleryAlbum(editingId, payload);
        toastBus.success("Álbum actualizado");
      } else {
        await createGalleryAlbum(payload);
        toastBus.success("Álbum creado");
      }
      resetForm();
      await fetchAlbums();
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (album) => {
    setEditingId(album.id);
    setForm(normalizeAlbum(album));
  };

  const selectAlbumItems = async (album) => {
    setSelectedAlbum(album);
    await fetchItems(album.id);
  };

  const handleToggleAlbum = async (album) => {
    await updateGalleryAlbum(album.id, { is_active: toBoolean(album.is_active) ? 0 : 1 });
    await fetchAlbums();
  };

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Desactivar álbum "${album.title}"?`)) return;
    await deleteGalleryAlbum(album.id);
    await fetchAlbums();
  };

  const handlePickerSelect = async (url, file) => {
    if (pickerMode === "cover") {
      setForm((prev) => ({
        ...prev,
        cover_media_id: file.id,
        cover_image_url: url,
      }));
      return;
    }

    if (pickerMode === "item" && selectedAlbum) {
      await addGalleryItem({
        album_id: selectedAlbum.id,
        media_file_id: file.id,
      });
      toastBus.success("Imagen agregada al álbum");
      await fetchItems(selectedAlbum.id);
      await fetchAlbums();
    }
  };

  const handleSaveItem = async (item) => {
    const draft = itemDrafts[item.id] || {};
    await updateGalleryItem(item.id, {
      caption: draft.caption || "",
      sort_order: Number(draft.sort_order || 0),
      is_active: 1,
    });
    toastBus.success("Imagen actualizada");
    await fetchItems(selectedAlbum.id);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm("Desactivar imagen del álbum?")) return;
    await deleteGalleryItem(item.id);
    await fetchItems(selectedAlbum.id);
    await fetchAlbums();
  };

  return (
    <div className="gallery-admin-page">
      <h2>Galería</h2>

      <FormLayout columns={2} onSubmit={handleSubmit}>
        <Field label="Título" name="title" value={form.title} onChange={handleChange} required />
        <Field label="Slug" name="slug" value={form.slug} onChange={handleChange} placeholder="se genera desde el título si queda vacío" />
        <Field label="Descripción" type="textarea" name="description" value={form.description} onChange={handleChange} rows={3} span />
        <Field label="Fecha del evento" type="date" name="event_date" value={form.event_date || ""} onChange={handleChange} />
        <Field label="Orden" type="number" name="sort_order" value={form.sort_order} onChange={handleChange} />

        <div className="gallery-cover-field full-span">
          <label className="label">Portada</label>
          {form.cover_image_url && <img src={resolveMediaUrl(form.cover_image_url)} alt="Portada" />}
          <button type="button" className="btn btn-secondary" onClick={() => setPickerMode("cover")}>
            <FaImage /> Seleccionar portada
          </button>
        </div>

        <SwitchField label="Destacado en Home" checked={form.is_featured} onChange={(checked) => setForm((prev) => ({ ...prev, is_featured: checked }))} />
        <SwitchField label="Activo" checked={form.is_active} onChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))} />

        <div className="form-actions">
          <button className="btn btn-primary" disabled={actionLoading === "save-album"}>
            {editingId ? "Guardar álbum" : "Crear álbum"}
          </button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
        </div>
      </FormLayout>

      <h3>Álbumes</h3>
      <TableLayout
        columns={[
          { type: "index", label: "#", width: "60px" },
          { key: "title", label: "Título", width: "220px" },
          { key: "slug", label: "Slug", width: "160px" },
          { key: "total_items", label: "Imágenes", width: "100px" },
          { key: "is_featured", label: "Home", width: "90px", render: (album) => (toBoolean(album.is_featured) ? "Sí" : "No") },
          { key: "is_active", label: "Estado", width: "100px", render: (album) => (toBoolean(album.is_active) ? "Activo" : "Inactivo") },
          { key: "actions", label: "Acciones", type: "actions" },
        ]}
        data={albums}
        loading={loading}
        emptyText="No hay álbumes registrados"
        renderActions={(album) => (
          <>
            <button className="btn-icon" title="Editar" onClick={() => startEdit(album)}><FaEdit /></button>
            <button className="btn-icon" title="Imágenes" onClick={() => selectAlbumItems(album)}><FaImage /></button>
            <button className="btn-icon" title="Activar/desactivar" onClick={() => handleToggleAlbum(album)}><FaToggleOff /></button>
            <button className="btn-icon btn-danger" title="Desactivar" onClick={() => handleDeleteAlbum(album)}><FaTrash /></button>
          </>
        )}
      />

      {selectedAlbum && (
        <section className="card gallery-items-admin">
          <div className="card-header">
            <h3>Imágenes: {selectedAlbum.title}</h3>
            <button type="button" className="btn btn-secondary" onClick={() => setPickerMode("item")}>
              <FaImage /> Agregar imagen
            </button>
          </div>

          {items.length === 0 ? (
            <p>Este álbum no tiene imágenes.</p>
          ) : (
            <div className="gallery-items-admin__grid">
              {items.map((item) => (
                <article className="gallery-item-admin" key={item.id}>
                  <img src={resolveMediaUrl(item.public_url)} alt={item.alt_text || item.caption} />
                  <Field
                    label="Caption"
                    name={`caption_${item.id}`}
                    value={itemDrafts[item.id]?.caption ?? ""}
                    onChange={(event) => setItemDrafts((prev) => ({ ...prev, [item.id]: { ...prev[item.id], caption: event.target.value } }))}
                  />
                  <Field
                    label="Orden"
                    type="number"
                    name={`sort_${item.id}`}
                    value={itemDrafts[item.id]?.sort_order ?? 0}
                    onChange={(event) => setItemDrafts((prev) => ({ ...prev, [item.id]: { ...prev[item.id], sort_order: event.target.value } }))}
                  />
                  <div className="gallery-item-admin__actions">
                    <button className="btn btn-secondary" onClick={() => handleSaveItem(item)}><FaSave /> Guardar</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteItem(item)}><FaTrash /> Desactivar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <MediaPickerModal
        open={Boolean(pickerMode)}
        onClose={() => setPickerMode(null)}
        onSelect={handlePickerSelect}
      />
    </div>
  );
}
