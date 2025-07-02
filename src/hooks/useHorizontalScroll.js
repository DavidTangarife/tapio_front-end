import { useState } from "react";
import { useRef, useEffect } from "react";

export function useHorizontalScroll() {
  const elementRef = useRef();
  const [activator, setActivator] = useState(true);

  useEffect(() => {
    const scroll = elementRef.current;
    if (scroll && activator) {
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
  }, [activator]);
  return { elementRef, setActivator };
}
