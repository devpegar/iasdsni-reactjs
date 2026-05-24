import clsx from "clsx";

export default function StatusBadge({ children, variant = "neutral", className }) {
  return (
    <span className={clsx("status-badge", `status-badge--${variant}`, className)}>
      {children}
    </span>
  );
}
