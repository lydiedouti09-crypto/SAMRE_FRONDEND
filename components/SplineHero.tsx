// components/SplineHero.tsx
"use client";
import Script from "next/script";
import { createElement } from "react";

export default function SplineHero() {
  return (
    <>
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.10.61/build/spline-viewer.js"
        strategy="afterInteractive"
      />
      <div className="h-full w-full">
        {createElement("spline-viewer", {
          url: "https://prod.spline.design/fsCm54LyyOnyJels/scene.splinecode",
          style: {
            display: "block",
            width: "100%",
            height: "100%",
            background: "transparent",
          },
        })}
      </div>
    </>
  );
}