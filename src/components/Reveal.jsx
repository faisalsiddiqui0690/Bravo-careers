import useReveal from '../hooks/useReveal';

/**
 * Wraps any element in a scroll-reveal container.
 * direction: "up" | "left" | "right" | "fade"
 * delay: "100" | "150" | "200" | "250" | "300" | "350" | "400" | "500"
 */
export default function Reveal({ children, direction = 'up', delay, className = '', as: Tag = 'div' }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      data-reveal={direction}
      data-delay={delay}
      className={className}
    >
      {children}
    </Tag>
  );
}
