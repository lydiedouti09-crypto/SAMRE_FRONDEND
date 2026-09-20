import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (_) {}
}

export default function ParallaxImage({
  src,
  speed = 0.15,
  className = "",
  children,
}: {
  src?: string;
  speed?: number;
  className?: string;
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    try {
      gsap.registerPlugin(ScrollTrigger);

      // Subtle travel range: ~40px * speed, preventing empty edge exposure
      const travel = Math.min(Math.max(speed * 60, 10), 80);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          img,
          { y: -travel },
          {
            y: travel,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, wrap);

      return () => ctx.revert();
    } catch (_) {
      // Degrade gracefully without console crashes
    }
  }, [speed]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        ref={imgRef}
        className="absolute inset-x-0 -top-[12%] h-[124%] w-full bg-cover bg-center will-change-transform"
        style={src ? { backgroundImage: `url('${src}')` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
