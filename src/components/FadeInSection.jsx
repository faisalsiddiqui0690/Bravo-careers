import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

export default function FadeInSection({ children, className = '', delay = 0 }) {
  const [setRef, isVisible] = useScrollFadeIn(0.1);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

