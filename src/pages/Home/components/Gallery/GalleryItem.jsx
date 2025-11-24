import useInViewAnimation from "../../../../hooks/useInViewAnimation";

export default function GalleryItem({ img, onClick }) {
  const { ref, isVisible } = useInViewAnimation(0.25);

  return (
    <div
      ref={ref}
      className={`gallery__item ${isVisible ? "visible" : ""}`}
      onClick={onClick}
    >
      <img src={img.thumbnail} alt={img.description} loading="lazy" />
    </div>
  );
}
