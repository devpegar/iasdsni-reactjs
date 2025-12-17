import { useState, useRef, useEffect } from "react";
import "../styles/tagSelect.scss";

export default function TagMultiSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const toggleOption = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id)); // quitar
    } else {
      onChange([...value, id]); // agregar
    }
  };

  return (
    <div className="tag-select" ref={containerRef}>
      <div className="tag-select-input" onClick={() => setOpen(!open)}>
        {value.length === 0 && <span className="placeholder">Seleccione</span>}

        {value.map((id) => {
          const item = options.find((opt) => opt.id === id);
          return (
            <span className="tag" key={id}>
              {item?.name}
              <button
                type="button"
                className="remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((v) => v !== id));
                }}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      {open && (
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`item ${value.includes(opt.id) ? "selected" : ""}`}
              onClick={() => toggleOption(opt.id)}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
