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
import {
  createMediaFolder,
  listMediaFolders,
} from "../services/mediaFoldersService";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import { toastBus } from "../../services/toastBus";
import AdminAlert from "../components/ui/AdminAlert";
import AdminCard from "../components/ui/AdminCard";
import EmptyStateAdmin from "../components/ui/EmptyStateAdmin";
import LoadingStateAdmin from "../components/ui/LoadingStateAdmin";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";

function formatSize(bytes) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const OPTIMIZATION_LABELS = {
  optimized: "Optimizada",
  legacy: "Legacy",
  skipped: "Omitida",
  failed: "Falló",
};

function formatDimensions(width, height) {
  if (!width || !height) return null;
  return `${width} x ${height}px`;
}

function getOptimizationVariant(status) {
  if (status === "optimized") return "success";
  if (status === "skipped") return "warning";
  if (status === "failed") return "danger";
  return "neutral";
}

export default function MediaLibraryPage() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderFilter, setFolderFilter] = useState("all");
  const [altDrafts, setAltDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({ alt_text: "", folder_id: "" });
  const [folderForm, setFolderForm] = useState({ name: "" });
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [filesRes, foldersRes] = await Promise.all([
        listMediaFiles(),
        listMediaFolders(),
      ]);
      const nextFiles = filesRes.media_files ?? [];

      setFiles(nextFiles);
      setFolders(foldersRes.folders ?? []);
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
    fetchData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      const message = "Seleccioná una imagen";
      setUploadError(message);
      toastBus.error(message);
      return;
    }

    const data = new FormData();
    data.append("image", file);
    data.append("alt_text", form.alt_text);
    if (form.folder_id) {
      data.append("folder_id", form.folder_id);
    }

    try {
      setUploadError(null);
      setUploading(true);
      await uploadMediaFile(data);

      toastBus.success("Imagen subida");
      setForm((prev) => ({ ...prev, alt_text: "" }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchData();
    } catch (err) {
      setUploadError(err.message || "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async (event) => {
    event.preventDefault();

    if (!folderForm.name.trim()) {
      toastBus.error("Ingresá un nombre de carpeta");
      return;
    }

    try {
      setActionLoading("create-folder");
      await createMediaFolder({ name: folderForm.name });
      toastBus.success("Carpeta creada");
      setFolderForm({ name: "" });
      await fetchData();
    } finally {
      setActionLoading(null);
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
      await updateMediaFile(file.id, {
        alt_text: altDrafts[file.id] || "",
      });

      toastBus.success("Texto alternativo actualizado");
      await fetchData();
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
      await deleteMediaFile(file.id);
      toastBus.success("Imagen desactivada");
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const filteredFiles = files.filter((file) => {
    if (folderFilter === "all") return true;
    if (folderFilter === "none") return !file.folder_id;
    return String(file.folder_id) === folderFilter;
  });

  return (
    <div className="media-library-page">
      <PageHeader
        title="Multimedia"
        description="Subí imágenes, organizalas por carpeta y copiá sus URLs para reutilizarlas en páginas, SEO y configuración."
      />

      <AdminCard className="media-upload">
        <SectionHeader
          title="Subir imagen"
          description="Se sirven imágenes optimizadas cuando están disponibles."
        />

        <FormLayout columns={2} onSubmit={handleUpload}>
          <AdminAlert variant="error">{uploadError}</AdminAlert>

          <Field
            label="Imagen"
            type="file"
            name="image"
            inputRef={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            error={uploadError}
            helpText="Formatos aceptados: JPG, PNG, WebP o GIF. Tamaño máximo: 10MB."
            span
          />

          <Field
            label="Texto alternativo"
            name="alt_text"
            value={form.alt_text}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, alt_text: event.target.value }))
            }
            placeholder="Descripción breve de la imagen"
            helpText="Usalo para describir la imagen a lectores de pantalla y buscadores."
          />

          <Field
            label="Carpeta"
            type="select"
            name="folder_id"
            value={form.folder_id}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, folder_id: event.target.value }))
            }
          >
            <option value="">Sin carpeta / General</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </Field>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              <FaUpload />
              {uploading ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </FormLayout>
      </AdminCard>

      <AdminCard className="media-folders">
        <SectionHeader
          title="Carpetas"
          description="Usá carpetas para separar contenido editorial, institucional o de páginas específicas."
        />

        <form className="form form--inline" onSubmit={handleCreateFolder}>
          <Field
            label="Nueva carpeta"
            name="folder_name"
            value={folderForm.name}
            onChange={(event) => setFolderForm({ name: event.target.value })}
            placeholder="Ej. Ministerio joven"
          />
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={actionLoading === "create-folder"}
          >
            Crear carpeta
          </button>
        </form>
      </AdminCard>

      <div className="media-library-filter">
        <label className="label">
          Filtrar por carpeta
          <select
            className="select"
            value={folderFilter}
            onChange={(event) => setFolderFilter(event.target.value)}
          >
            <option value="all">Todas</option>
            <option value="none">Sin carpeta / General</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AdminAlert variant="error">{error}</AdminAlert>

      {loading ? (
        <LoadingStateAdmin label="Cargando multimedia..." />
      ) : filteredFiles.length === 0 ? (
        <EmptyStateAdmin
          title="No hay imágenes para este filtro"
          description="Subí una imagen o cambiá el filtro de carpeta para ver otros archivos."
        />
      ) : (
        <div className="media-grid">
          {filteredFiles.map((file) => {
            const previewUrl = resolveMediaUrl(file.thumbnail_url || file.public_url);
            const originalDimensions = formatDimensions(file.width, file.height);
            const optimizedDimensions = formatDimensions(
              file.optimized_width,
              file.optimized_height,
            );
            const optimizationStatus = file.optimization_status || "legacy";

            return (
              <article className="media-card" key={file.id}>
                <div className="media-card__preview">
                  <img src={previewUrl} alt={file.alt_text || file.original_name} />
                </div>

                <div className="media-card__body">
                  <h3 title={file.original_name}>{file.original_name}</h3>
                  <p>{file.mime_type} · original {formatSize(file.size_bytes)}</p>
                  {originalDimensions && <p>Original: {originalDimensions}</p>}
                  {optimizedDimensions && <p>Optimizada: {optimizedDimensions}</p>}
                  <StatusBadge
                    variant={getOptimizationVariant(optimizationStatus)}
                    className="media-card__status"
                  >
                    {OPTIMIZATION_LABELS[optimizationStatus] || optimizationStatus}
                  </StatusBadge>
                  <span className="media-card__folder">
                    {file.folder_name || "Sin carpeta / General"}
                  </span>

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
