import { createElement } from "react";
import "./SectionContainer.scss";

const SECTION_SIZES = ["sm", "md", "lg", "xl"];

export default function SectionContainer({
  as: Component = "section",
  children,
  className = "",
  size = "lg",
  padded = true,
  ...props
}) {
  const safeSize = SECTION_SIZES.includes(size) ? size : "lg";
  const classes = [
    "ui-section-container",
    `ui-section-container--${safeSize}`,
    padded ? "ui-section-container--padded" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(Component, { className: classes, ...props }, children);
}
