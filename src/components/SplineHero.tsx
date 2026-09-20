import { createElement, useEffect } from "react";

export default function SplineHero() {
  useEffect(() => {
    const scriptSrc =
      "https://unpkg.com/@splinetool/viewer@1.10.61/build/spline-viewer.js";
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = scriptSrc;
      document.head.appendChild(script);
    }
  }, []);

  return (
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
  );
}