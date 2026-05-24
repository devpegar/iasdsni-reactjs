import { createElement } from "react";
import "./ContentCard.scss";

export default function ContentCard({
  as: Component = "article",
  children,
  className = "",
  interactive = false,
  ...props
}) {
  const classes = ["ui-content-card", interactive ? "ui-content-card--interactive" : "", className]
    .filter(Boolean)
    .join(" ");

  return createElement(Component, { className: classes, ...props }, children);
}
