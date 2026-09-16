"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   Timing & easing constants
   ───────────────────────────────────────────── */

/** Organic "weighted" cubic-bezier — slow settle, tiny overshoot feel */
const ORGANIC_EASE: [number, number, number, number] = [0.45, 0.05, 0.18, 1.0];

/** Front phone float cycle (seconds) */
const FRONT_DURATION = 4.6;
/** Back phone float cycle — intentionally desynced from front */
const BACK_DURATION = 5.8;

/** Entrance animation */
const REVEAL_DURATION = 1.1;
const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]; // expo-out
const FRONT_REVEAL_DELAY = 0;
const BACK_REVEAL_DELAY = 0.12; // tight stagger for choreographed feel
const GLOW_REVEAL_DELAY = 0.6;

/** Parallax config */
const MAX_TILT_DEG = 3; // maximum tilt in degrees
const PARALLAX_SPRING = { stiffness: 80, damping: 20, mass: 0.8 };

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isTouch;
}

/* ─────────────────────────────────────────────
   Float keyframes generator
   Produces a multi-step keyframe set that avoids
   the mechanical back-and-forth of a simple
   two-step alternate animation.
   ───────────────────────────────────────────── */

interface FloatConfig {
  /** Y-axis travel range in percent */
  yRange: [number, number];
  /** Rotation range in degrees */
  rotRange: [number, number];
  /** Scale breathing range */
  scaleRange: [number, number];
  /** Shadow config — [blur-min, blur-max, opacity-min, opacity-max] */
  shadow: [number, number, number, number];
  /** Cycle duration in seconds */
  duration: number;
}

function buildFloatVariants(cfg: FloatConfig) {
  const { yRange, rotRange, scaleRange, shadow, duration } = cfg;
  const [yMin, yMax] = yRange;
  const [rMin, rMax] = rotRange;
  const [sMin, sMax] = scaleRange;
  const [blMin, blMax, opMin, opMax] = shadow;

  // 5 waypoints for organic, non-symmetric movement
  const yMid = (yMin + yMax) / 2;
  const rMid = (rMin + rMax) / 2;
  const sMid = (sMin + sMax) / 2;
  const blMid = (blMin + blMax) / 2;
  const opMid = (opMin + opMax) / 2;

  return {
    animate: {
      y: [
        `${yMin}%`,
        `${yMax * 0.7}%`,
        `${yMid * 0.3}%`,
        `${yMax}%`,
        `${yMin}%`,
      ],
      rotate: [rMin, rMax * 0.8, rMid, rMin * 0.9, rMin],
      scale: [sMin, sMax, sMid, sMax * 0.98, sMin],
      filter: [
        `drop-shadow(1rem 3rem ${blMin}rem rgba(0,0,0,${opMax}))`,
        `drop-shadow(1rem 2.5rem ${blMid}rem rgba(0,0,0,${opMid}))`,
        `drop-shadow(1rem 3.5rem ${blMax}rem rgba(0,0,0,${opMin}))`,
        `drop-shadow(1rem 2.8rem ${blMid}rem rgba(0,0,0,${opMid}))`,
        `drop-shadow(1rem 3rem ${blMin}rem rgba(0,0,0,${opMax}))`,
      ],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: ORGANIC_EASE,
      times: [0, 0.28, 0.52, 0.78, 1],
    } as Transition,
  };
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

export default function FloatingDevices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useIsTouchDevice();
  const enableParallax = !prefersReducedMotion && !isTouch;

  /* ── Parallax motion values ── */
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, PARALLAX_SPRING);
  const mouseY = useSpring(rawMouseY, PARALLAX_SPRING);

  // Front phone tilts in one direction
  const frontRotateY = useTransform(mouseX, [-1, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const frontRotateX = useTransform(mouseY, [-1, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]);
  // Back phone tilts in the *opposite* direction for depth illusion
  const backRotateY = useTransform(mouseX, [-1, 1], [-MAX_TILT_DEG * 0.6, MAX_TILT_DEG * 0.6]);
  const backRotateX = useTransform(mouseY, [-1, 1], [MAX_TILT_DEG * 0.6, -MAX_TILT_DEG * 0.6]);

  const handleMouseMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enableParallax || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalise -1 → +1 relative to container center
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      rawMouseX.set(nx);
      rawMouseY.set(ny);
    },
    [enableParallax, rawMouseX, rawMouseY]
  );

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  /* ── Float configs ── */
  const frontFloat = buildFloatVariants({
    yRange: [-3.5, 1],
    rotRange: [-6, -2.5],
    scaleRange: [1, 1.015],
    shadow: [3.5, 4.5, 0.4, 0.5],
    duration: FRONT_DURATION,
  });

  const backFloat = buildFloatVariants({
    yRange: [0, 3.5],
    rotRange: [5.5, 9.5],
    scaleRange: [1, 1.008],
    shadow: [3, 4, 0.32, 0.42],
    duration: BACK_DURATION,
  });

  /* ── Reveal variants ── */
  const revealInitial = {
    opacity: 0,
    scale: 0.82,
    y: "10%",
  };

  const frontRevealAnimate = {
    opacity: 1,
    scale: 1,
    y: "0%",
  };

  const backRevealAnimate = {
    opacity: 0.92,
    scale: 1,
    y: "0%",
  };

  const frontRevealTransition: Transition = {
    duration: REVEAL_DURATION,
    delay: FRONT_REVEAL_DELAY,
    ease: REVEAL_EASE,
  };

  const backRevealTransition: Transition = {
    duration: REVEAL_DURATION + 0.15,
    delay: BACK_REVEAL_DELAY,
    ease: REVEAL_EASE,
  };

  /* ── Reduced-motion: static reveal only ── */
  const staticReveal = {
    opacity: 1,
    scale: 1,
    y: "0%",
  };

  return (
    <>
      <div
        ref={containerRef}
        className="hero-phones-container pointer-events-auto relative z-[2]"
        style={{ "--aspect": "697/821" } as React.CSSProperties}
        onPointerMove={enableParallax ? handleMouseMove : undefined}
        onPointerLeave={enableParallax ? handleMouseLeave : undefined}
      >
        {/* ── Phone arrière-plan ── */}
        <motion.div
          className="phone-back"
          initial={prefersReducedMotion ? staticReveal : revealInitial}
          animate={
            prefersReducedMotion
              ? { ...staticReveal, opacity: 0.92 }
              : backRevealAnimate
          }
          transition={prefersReducedMotion ? { duration: 0 } : backRevealTransition}
          style={
            enableParallax
              ? {
                  rotateY: backRotateY,
                  rotateX: backRotateX,
                  transformPerspective: 800,
                }
              : undefined
          }
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : backFloat.animate}
            transition={prefersReducedMotion ? undefined : backFloat.transition}
            className="phone-back-inner"
          >
            <Image
              src="/samre4.png"
              alt="Application SAMRE – Logo"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 60vw, 32vw"
              priority
            />
          </motion.div>
        </motion.div>

        {/* ── Phone avant-plan ── */}
        <motion.div
          className="phone-front"
          initial={prefersReducedMotion ? staticReveal : revealInitial}
          animate={prefersReducedMotion ? staticReveal : frontRevealAnimate}
          transition={prefersReducedMotion ? { duration: 0 } : frontRevealTransition}
          style={
            enableParallax
              ? {
                  rotateY: frontRotateY,
                  rotateX: frontRotateX,
                  transformPerspective: 1000,
                }
              : undefined
          }
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : frontFloat.animate}
            transition={prefersReducedMotion ? undefined : frontFloat.transition}
            className="phone-front-inner"
          >
            <Image
              src="/samre3.png"
              alt="Application SAMRE – Accueil"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 70vw, 38vw"
              priority
            />
          </motion.div>
        </motion.div>

        {/* ── Glow overlay ── */}
        <motion.div
          className="phone-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.8,
            delay: GLOW_REVEAL_DELAY,
            ease: "easeOut",
          }}
        />
      </div>

      <style jsx global>{`
        /* ─── Container ─── */
        .hero-phones-container {
          position: relative;
          width: 100%;
          aspect-ratio: var(--aspect);
          pointer-events: auto;
          touch-action: none;
        }
        @media (min-width: 1024px) {
          .hero-phones-container {
            position: absolute;
            z-index: -1;
            top: calc(50% + 35px);
            transform: translateY(-50%);
            right: 0;
            width: 45vw;
          }
        }
        @media (min-width: 1280px) {
          .hero-phones-container {
            right: 1vw;
            width: 42vw;
          }
        }
        .hero-phones-container img {
          max-width: none !important;
        }

        /* ─── Phone front wrapper ─── */
        .phone-front {
          position: absolute;
          z-index: 3;
          top: 0%;
          left: 2%;
          width: 72%;
          aspect-ratio: var(--aspect);
          will-change: transform, opacity;
        }
        .phone-front-inner {
          position: relative;
          width: 100%;
          height: 100%;
          filter: drop-shadow(1rem 3rem 4rem rgba(0, 0, 0, 0.45));
          will-change: transform, filter;
        }

        /* ─── Phone back wrapper ─── */
        .phone-back {
          position: absolute;
          z-index: 1;
          top: 28%;
          right: 0%;
          width: 59%;
          aspect-ratio: var(--aspect);
          will-change: transform, opacity;
        }
        .phone-back-inner {
          position: relative;
          width: 100%;
          height: 100%;
          filter: drop-shadow(1rem 3rem 3.5rem rgba(0, 0, 0, 0.38));
          will-change: transform, filter;
        }

        /* ─── Glow overlay ─── */
        .phone-glow {
          position: absolute;
          z-index: 2;
          inset: 0;
          mix-blend-mode: screen;
          background: radial-gradient(
            ellipse at 40% 30%,
            rgba(242, 129, 29, 0.08) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        /* ─── Reduced motion ─── */
        @media (prefers-reduced-motion: reduce) {
          .phone-front,
          .phone-back,
          .phone-front-inner,
          .phone-back-inner,
          .phone-glow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}