import { useState } from "react";
import { resolveMediaUrl } from "../../../utils/mediaUrl";
import MediaPickerModal from "./MediaPickerModal";

export default function ImageUrlField({
  label,
  name,
  value,
  onChange,
  placeholder,
  span = false,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (url) => {
    onChange({
      target: {
        name,
        value: url,
      },
    });
  };

  return (
    <div className={span ? "image-url-field full-span" : "image-url-field"}>
      <label className="label">
        {label}
        <div className="image-url-field__controls">
          <input
            className="input"
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setOpen(true)}
          >
            Seleccionar imagen
          </button>
        </div>
      </label>

      {value && (
        <div className="image-url-field__preview">
          <img src={resolveMediaUrl(value)} alt={label} />
        </div>
      )}

      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </div>
  );
}
