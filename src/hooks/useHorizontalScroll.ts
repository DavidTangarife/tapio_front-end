import { useRef, useEffect, useState, MouseEvent } from "react";

export function useHorizontalScroll() {
  const elementRef = useRef();
  const [activator, setActivator] = useState(true);

  useEffect(() => {
    const scroll: HTMLDivElement = elementRef.current;
    console.log(scroll)
    if (scroll && activator) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        scroll.scrollTo({
          left: scroll.scrollLeft + e.deltaY,
          behavior: "smooth"
        });
      };
      scroll.addEventListener("wheel", onWheel);
      return () => scroll.removeEventListener("wheel", onWheel);
    }
  }, [activator]);
  return { elementRef, setActivator };
}
