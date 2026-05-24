import { forwardRef } from "react";
import clsx from "clsx";

const AdminCard = forwardRef(function AdminCard(
  { as, className, children, ...props },
  ref,
) {
  const Element = as || "section";

  return (
    <Element ref={ref} className={clsx("admin-card", className)} {...props}>
      {children}
    </Element>
  );
});

export default AdminCard;
