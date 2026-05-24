import "./Button.scss";

const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost"];
const BUTTON_SIZES = ["sm", "md", "lg"];

function getButtonClasses({ variant, size, className }) {
  const safeVariant = BUTTON_VARIANTS.includes(variant) ? variant : "primary";
  const safeSize = BUTTON_SIZES.includes(size) ? size : "md";

  return ["ui-button", `ui-button--${safeVariant}`, `ui-button--${safeSize}`, className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={getButtonClasses({ variant, size, className })}
      type={type}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled = false,
  href,
  ...props
}) {
  const classes = [
    getButtonClasses({ variant, size, className }),
    disabled ? "ui-button--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      aria-disabled={disabled || undefined}
      className={classes}
      href={disabled ? undefined : href}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

export default Button;
