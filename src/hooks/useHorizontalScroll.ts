import { useRef, useEffect } from "react";

export function useHorizontalScroll() {
  const elementRef = useRef();

  useEffect(() => {
    const scroll = elementRef.current;
    if (scroll) {
      const onWheel = e => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        scroll.scrollTo({
          left: scroll.scrollLeft + e.deltaY,
          behaviour: "smooth"
        });
      };
      scroll.addEventListener("wheel", onWheel);
      return () => scroll.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elementRef;
}
