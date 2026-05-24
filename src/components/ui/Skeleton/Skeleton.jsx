import "./Skeleton.scss";

const SKELETON_VARIANTS = ["text", "card", "media", "circle"];

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  ...props
}) {
  const safeVariant = SKELETON_VARIANTS.includes(variant) ? variant : "text";
  const styles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
  const classes = ["ui-skeleton", `ui-skeleton--${safeVariant}`, className]
    .filter(Boolean)
    .join(" ");

  return <span aria-hidden="true" className={classes} style={styles} {...props} />;
}
