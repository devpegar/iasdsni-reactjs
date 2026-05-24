import clsx from "clsx";
import { useId } from "react";

export default function SwitchField({
  id,
  label,
  checked = false,
  onChange,
  span = false,
  hint,
  helpText,
  disabled = false,
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const message = helpText || hint;

  return (
    <div className={clsx({ "full-span": span })}>
      <label className="settings-switch">
        <input
          id={fieldId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-describedby={message ? `${fieldId}-message` : undefined}
          onChange={(e) => onChange?.(e.target.checked)}
        />

        <span className="switch-slider" />

        <span className="switch-label">
          {label}
          {message && <small id={`${fieldId}-message`}> {message}</small>}
        </span>
      </label>
    </div>
  );
}
