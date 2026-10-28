import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll-reveal hook.
 * Adds `data-revealed` to the element when it enters the viewport.
 * All animation is driven purely by CSS — no JS state updates on scroll.
 */
export default function useReveal(rootMargin = '0px 0px -60px 0px') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-revealed', '');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin, threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
