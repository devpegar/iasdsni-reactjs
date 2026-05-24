import "./Badge.scss";

const BADGE_VARIANTS = ["default", "primary", "accent", "muted"];

export default function Badge({ children, variant = "default", className = "", ...props }) {
  const safeVariant = BADGE_VARIANTS.includes(variant) ? variant : "default";
  const classes = ["ui-badge", `ui-badge--${safeVariant}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
