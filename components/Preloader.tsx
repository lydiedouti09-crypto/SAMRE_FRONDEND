"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";

export default function Preloader({ children }: { children?: ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (sessionStorage.getItem("samre-loaded")) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        sessionStorage.setItem("samre-loaded", "1");
        return;
      }

      setShowOverlay(true);
    } catch (_) {
      // If sessionStorage is inaccessible (e.g. security sandbox), do not block rendering
    }
  }, []);

  useEffect(() => {
    if (!showOverlay) return;

    const counter = counterRef.current;
    const overlay = overlayRef.current;
    if (!counter || !overlay) return;

    try {
      const obj = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            scale: 1.03,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
              try {
                sessionStorage.setItem("samre-loaded", "1");
              } catch (_) {}
              setShowOverlay(false);
            },
          });
        },
      });

      tl.to(obj, {
        value: 100,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          if (counter) {
            counter.textContent = String(Math.round(obj.value));
          }
        },
      });

      return () => {
        tl.kill();
      };
    } catch (_) {
      try {
        sessionStorage.setItem("samre-loaded", "1");
      } catch (_) {}
      setShowOverlay(false);
    }
  }, [showOverlay]);

  return (
    <>
      {showOverlay && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950 select-none"
          aria-hidden="true"
        >
          <div className="flex items-baseline gap-1 font-display text-white">
            <span ref={counterRef} className="text-6xl font-bold tabular-nums">
              0
            </span>
            <span className="text-2xl font-semibold text-brand-orange">%</span>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
