import { useState, useEffect } from 'react';

export function useScrollBlur(threshold = 100) {
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxBlur = 20; // Maximum blur in pixels
      const progress = Math.min(scrolled / threshold, 1);
      setBlurAmount(progress * maxBlur);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return blurAmount;
}
