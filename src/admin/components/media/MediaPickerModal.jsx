import { useEffect, useState } from "react";
import { listMediaFiles } from "../../services/mediaService";
import { listMediaFolders } from "../../services/mediaFoldersService";
import "./MediaPickerModal.scss";

export function getMediaPreviewUrl(path) {
  if (!path) return "";

  if (/^(https?:|data:|blob:)/i.test(path)) {
    return path;
  }

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiUrl}${normalizedPath}`;
}

export default function MediaPickerModal({ open, onClose, onSelect }) {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderFilter, setFolderFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadFiles() {
      try {
        setLoading(true);
        const [filesRes, foldersRes] = await Promise.all([
          listMediaFiles(),
          listMediaFolders(),
        ]);

        if (ignore) return;

        if (filesRes.success === false) {
          setError(filesRes.message || "No se pudo cargar Multimedia");
          setFiles([]);
          return;
        }

        setFiles(filesRes.media_files ?? []);
        setFolders(foldersRes.folders ?? []);
        setError(null);
      } catch (err) {
        if (!ignore) {
          setError(err.message || "No se pudo cargar Multimedia");
          setFiles([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadFiles();

    return () => {
      ignore = true;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSelect = (file) => {
    onSelect(file.public_url, file);
    onClose();
  };

  const filteredFiles = files.filter((file) => {
    if (folderFilter === "all") return true;
    if (folderFilter === "none") return !file.folder_id;
    return String(file.folder_id) === folderFilter;
  });

  return (
    <div className="media-picker" role="dialog" aria-modal="true">
      <div className="media-picker__backdrop" onClick={onClose} />

      <div className="media-picker__panel">
        <div className="media-picker__header">
          <h2>Seleccionar imagen</h2>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {loading && <p>Cargando imágenes...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="media-picker__filters">
            <label className="label">
              Carpeta
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
        )}

        {!loading && !error && filteredFiles.length === 0 && (
          <p>No hay imágenes cargadas. Subí una imagen desde Sitio Web → Multimedia.</p>
        )}

        {!loading && !error && filteredFiles.length > 0 && (
          <div className="media-picker__grid">
            {filteredFiles.map((file) => (
              <article className="media-picker__item" key={file.id}>
                <div className="media-picker__preview">
                  <img
                    src={getMediaPreviewUrl(file.public_url)}
                    alt={file.alt_text || file.original_name}
                  />
                </div>

                <div className="media-picker__body">
                  <h3 title={file.original_name}>{file.original_name}</h3>
                  <span>{file.folder_name || "Sin carpeta / General"}</span>
                  <p title={file.public_url}>{file.public_url}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSelect(file)}
                  >
                    Seleccionar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
