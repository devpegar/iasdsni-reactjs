import { useState } from "react";

export default function DescriptionPreview({
  text,
  children,
  title = "Descripción completa",
  maxWidth = 520,
}) {
  const [open, setOpen] = useState(false);

  if (!text) return children;

  return (
    <>
      <span
        className="description-preview-trigger"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </span>

      {open && (
        <div className="description-preview-overlay">
          <div
            className="description-preview"
            style={{ maxWidth }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <h4>{title}</h4>
            <p>{text}</p>
          </div>
        </div>
      )}
    </>
  );
}
