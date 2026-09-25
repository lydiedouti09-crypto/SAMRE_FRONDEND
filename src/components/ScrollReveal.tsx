import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom';
  distance?: number;
  rootMargin?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  style = {},
  threshold = 0.05,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  distance = 35,
  rootMargin = '0px 0px 50px 0px',
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  // Initialise à true si rendu côté serveur ou dès qu'on est sur écran initial
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = domRef.current;
    if (!el) return;

    // Vérifie si déjà dans le viewport
    if (typeof window !== 'undefined') {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        setIsVisible(true);
      }
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    // Sécurité : s'assure que rien ne reste jamais invisible après 500ms
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [threshold, rootMargin]);

  const getHiddenTransform = () => {
    switch (direction) {
      case 'left':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(${distance}px, 0, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'zoom':
        return 'scale(0.95)';
      case 'fade':
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={domRef}
      className={`scroll-reveal-item ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0.05,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getHiddenTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
