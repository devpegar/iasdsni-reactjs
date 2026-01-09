import clsx from "clsx";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  required = false,
  span = false,
  disabled = false,
  children,
}) {
  return (
    <label className={clsx("label", { "full-span": span })}>
      {label}

      <select
        className="select"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        {children}
      </select>
    </label>
  );
}
