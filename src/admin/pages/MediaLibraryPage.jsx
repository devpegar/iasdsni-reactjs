import { useEffect, useRef, useState } from "react";
import { FaCopy, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import Field from "../components/form/Field";
import FormLayout from "../layout/FormLayout";
import {
  deleteMediaFile,
  listMediaFiles,
  updateMediaFile,
  uploadMediaFile,
} from "../services/mediaService";
import { toastBus } from "../../services/toastBus";

function formatSize(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPreviewUrl(path) {
  if (!path) return "";

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiUrl}${normalizedPath}`;
}

export default function MediaLibraryPage() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [altDrafts, setAltDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({ alt_text: "" });
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await listMediaFiles();
      const nextFiles = res.media_files ?? [];

      setFiles(nextFiles);
      setAltDrafts(
        nextFiles.reduce((acc, file) => {
          acc[file.id] = file.alt_text || "";
          return acc;
        }, {}),
      );
      setError(null);
    } catch (err) {
      setError(err.message || "No se pudo cargar la biblioteca multimedia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toastBus.error("Seleccioná una imagen");
      return;
    }

    const data = new FormData();
    data.append("image", file);
    data.append("alt_text", form.alt_text);

    try {
      setUploading(true);
      const res = await uploadMediaFile(data);

      if (res.success === false) {
        return;
      }

      toastBus.success("Imagen subida");
      setForm({ alt_text: "" });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchFiles();
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toastBus.success("URL copiada");
    } catch {
      window.prompt("Copiar URL", url);
    }
  };

  const handleSaveAlt = async (file) => {
    try {
      setActionLoading(`save-${file.id}`);
      const res = await updateMediaFile(file.id, {
        alt_text: altDrafts[file.id] || "",
      });

      if (res.success !== false) {
        toastBus.success("Texto alternativo actualizado");
        await fetchFiles();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Desactivar "${file.original_name}"?`)) {
      return;
    }

    try {
      setActionLoading(`delete-${file.id}`);
      const res = await deleteMediaFile(file.id);

      if (res.success !== false) {
        toastBus.success("Imagen desactivada");
        await fetchFiles();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="media-library-page">
      <div className="media-library-page__header">
        <div>
          <h2>Multimedia</h2>
          <p>Subí imágenes y copiá sus URLs para reutilizarlas en páginas, SEO y configuración.</p>
        </div>
      </div>

      <section className="card media-upload">
        <FormLayout columns={2} onSubmit={handleUpload}>
          <label className="label full-span">
            Imagen
            <input
              ref={fileInputRef}
              className="input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
            />
          </label>

          <Field
            label="Texto alternativo"
            name="alt_text"
            value={form.alt_text}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, alt_text: event.target.value }))
            }
            placeholder="Descripción breve de la imagen"
          />

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              <FaUpload />
              {uploading ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </FormLayout>
      </section>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Cargando multimedia...</p>
      ) : files.length === 0 ? (
        <div className="card">
          <p>No hay imágenes cargadas.</p>
        </div>
      ) : (
        <div className="media-grid">
          {files.map((file) => {
            const previewUrl = getPreviewUrl(file.public_url);

            return (
              <article className="media-card" key={file.id}>
                <div className="media-card__preview">
                  <img src={previewUrl} alt={file.alt_text || file.original_name} />
                </div>

                <div className="media-card__body">
                  <h3 title={file.original_name}>{file.original_name}</h3>
                  <p>{file.mime_type} · {formatSize(file.size_bytes)}</p>

                  <label className="label">
                    URL
                    <input className="input" value={file.public_url} readOnly />
                  </label>

                  <Field
                    label="Texto alternativo"
                    name={`alt_text_${file.id}`}
                    value={altDrafts[file.id] ?? ""}
                    onChange={(event) =>
                      setAltDrafts((prev) => ({
                        ...prev,
                        [file.id]: event.target.value,
                      }))
                    }
                  />

                  <div className="media-card__actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleCopy(file.public_url)}
                    >
                      <FaCopy />
                      Copiar URL
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={actionLoading === `save-${file.id}`}
                      onClick={() => handleSaveAlt(file)}
                    >
                      <FaSave />
                      Guardar alt
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={actionLoading === `delete-${file.id}`}
                      onClick={() => handleDelete(file)}
                    >
                      <FaTrash />
                      Desactivar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
