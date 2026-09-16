"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef } from "react";
import type { ElementType, ReactElement, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (_) {}
}

function maskWords(text: string, keyPrefix: string) {
  // Split on whitespace but keep tokens
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.map((word, i) => (
    <span key={`${keyPrefix}-${i}`} className="inline-block overflow-hidden align-top">
      <span data-word className="inline-block will-change-transform">
        {word}
        {i < words.length - 1 ? "\u00A0" : ""}
      </span>
    </span>
  ));
}

/**
 * Walks React children recursively, splitting plain text nodes into masked words
 * while preserving elements (br, span, etc.) and nested styles (e.g. text-gradient).
 */
function processChildren(children: ReactNode, keyPrefix = "n"): ReactNode {
  return Children.map(children, (child, i) => {
    const key = `${keyPrefix}-${i}`;
    if (typeof child === "string") {
      return maskWords(child, key);
    }
    if (typeof child === "number") {
      return maskWords(String(child), key);
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      if (!el.props.children) return el;
      return cloneElement(el, {
        ...el.props,
        children: processChildren(el.props.children, key),
      });
    }
    return child;
  });
}

export default function RevealText({
  as: Component = "h2",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      words.forEach((w) => {
        w.style.transform = "none";
        w.style.opacity = "1";
      });
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          words,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }, el);

      return () => ctx.revert();
    } catch (_) {
      words.forEach((w) => {
        w.style.transform = "none";
        w.style.opacity = "1";
      });
    }
  }, []);

  return (
    <Component ref={ref as never} className={className}>
      {processChildren(children)}
    </Component>
  );
}
