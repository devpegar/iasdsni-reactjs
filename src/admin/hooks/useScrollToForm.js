import { useEffect } from "react";

export default function useScrollToForm(ref, trigger) {
  useEffect(() => {
    if (!trigger || !ref?.current) return;

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [trigger]);
}
