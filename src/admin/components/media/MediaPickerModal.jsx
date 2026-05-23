import { useEffect, useState } from "react";
import { listMediaFiles } from "../../services/mediaService";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;

    let ignore = false;

    async function loadFiles() {
      try {
        setLoading(true);
        const res = await listMediaFiles();

        if (ignore) return;

        if (res.success === false) {
          setError(res.message || "No se pudo cargar Multimedia");
          setFiles([]);
          return;
        }

        setFiles(res.media_files ?? []);
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

        {!loading && !error && files.length === 0 && (
          <p>No hay imágenes cargadas. Subí una imagen desde Sitio Web → Multimedia.</p>
        )}

        {!loading && !error && files.length > 0 && (
          <div className="media-picker__grid">
            {files.map((file) => (
              <article className="media-picker__item" key={file.id}>
                <div className="media-picker__preview">
                  <img
                    src={getMediaPreviewUrl(file.public_url)}
                    alt={file.alt_text || file.original_name}
                  />
                </div>

                <div className="media-picker__body">
                  <h3 title={file.original_name}>{file.original_name}</h3>
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
