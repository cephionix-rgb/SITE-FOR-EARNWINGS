import { useEffect, useRef } from "react";

/**
 * Fades a block up once, the first time it scrolls into view. One shared
 * IntersectionObserver for the page; only opacity and transform change, so it
 * stays on the compositor. Under reduced motion the CSS transition is ~0 ms.
 */
let io: IntersectionObserver | null = null;
function observer() {
  if (io || typeof window === "undefined") return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io!.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return io;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    const o = observer();
    if (!el || !o) return;
    o.observe(el);
    return () => o.unobserve(el);
  }, []);
  return ref;
}
