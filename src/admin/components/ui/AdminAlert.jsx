import clsx from "clsx";

export default function AdminAlert({ children, className, variant = "info" }) {
  if (!children) return null;

  return (
    <div className={clsx("admin-alert", `admin-alert--${variant}`, className)} role="alert">
      {children}
    </div>
  );
}
