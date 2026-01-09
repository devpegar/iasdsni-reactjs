import clsx from "clsx";

export default function Field({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 3,
  span = false,
  children,
}) {
  const fieldClass = clsx({
    "full-span": span,
  });

  return (
    <label className={clsx("label", fieldClass)}>
      {label}

      {type === "textarea" && (
        <textarea
          className="textarea"
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          required={required}
          placeholder={placeholder}
        />
      )}

      {type === "select" && (
        <select
          className="select"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {children}
        </select>
      )}

      {type !== "textarea" && type !== "select" && (
        <input
          className="input"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
