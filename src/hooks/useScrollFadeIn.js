import { useState, useEffect } from 'react';

export function useScrollFadeIn(threshold = 0.1, triggerOnce = false) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(ref);
          }
        } else {
          // Fade out when element leaves viewport
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, threshold, triggerOnce]);

  return [setRef, isVisible];
}
