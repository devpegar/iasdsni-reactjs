import clsx from "clsx";

export default function SwitchField({
  label,
  checked = false,
  onChange,
  span = false,
  hint,
  disabled = false,
}) {
  return (
    <div className={clsx({ "full-span": span })}>
      <label className="settings-switch">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />

        <span className="switch-slider" />

        <span className="switch-label">
          {label}
          {hint && <small> {hint}</small>}
        </span>
      </label>
    </div>
  );
}
