export default function TableSelectField({
  value,
  onChange,
  disabled = false,
  children,
}) {
  return (
    <select
      className="select select--compact"
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {children}
    </select>
  );
}
