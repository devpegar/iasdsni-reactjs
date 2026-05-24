import clsx from "clsx";
import { useId } from "react";

export default function Field({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 3,
  span = false,
  error,
  helpText,
  inputRef,
  children,
  ...inputProps
}) {
  const generatedId = useId();
  const fieldId = id || name || generatedId;
  const messageId = `${fieldId}-message`;
  const message = error || helpText;
  const fieldClass = clsx({
    "full-span": span,
    "label--error": Boolean(error),
  });
  const controlProps = {
    id: fieldId,
    name,
    value,
    onChange,
    required,
    placeholder,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": message ? messageId : undefined,
    ...inputProps,
  };

  return (
    <div className={clsx("label", fieldClass)}>
      {label && (
        <label className="label__text" htmlFor={fieldId}>
          {label}
          {required && <span className="label__required"> *</span>}
        </label>
      )}

      {type === "textarea" && (
        <textarea
          {...controlProps}
          className="textarea"
          rows={rows}
        />
      )}

      {type === "select" && (
        <select
          {...controlProps}
          className="select"
        >
          {children}
        </select>
      )}

      {type !== "textarea" && type !== "select" && (
        <input
          {...controlProps}
          ref={inputRef}
          className="input"
          type={type}
        />
      )}

      {message && (
        <p
          id={messageId}
          className={clsx("field-message", {
            "field-message--error": Boolean(error),
          })}
        >
          {message}
        </p>
      )}
    </div>
  );
}
