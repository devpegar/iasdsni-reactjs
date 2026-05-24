import clsx from "clsx";

export default function FormLayout({
  columns = 2,
  compact = false,
  inline = false,
  className,
  onSubmit,
  children,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        "form",
        {
          [`form--cols-${columns}`]: !inline,
          "form--compact": compact,
          "form--inline": inline,
        },
        className
      )}
    >
      {children}
    </form>
  );
}
