import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/api";

interface AppLogoImageProps {
  src?: string | null;
  alt?: string;
  name?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  roundedClassName?: string;
}

export function AppLogoImage({
  src,
  alt = "App",
  name = "",
  className = "h-14 w-14 min-w-[56px] rounded-2xl bg-white border border-slate-100 p-1 shadow-2xs",
  imageClassName = "h-full w-full object-contain rounded-xl",
  fallbackClassName = "bg-gradient-to-tr from-[#FB682E] to-amber-500 text-white font-extrabold text-base",
  roundedClassName = "rounded-xl",
}: AppLogoImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const resolvedUrl = !hasError && src ? getImageUrl(src) : "";
  const label = (name || alt || "A").trim();
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {resolvedUrl ? (
        <img
          src={resolvedUrl}
          alt={alt}
          className={`${imageClassName} ${hasError ? "hidden" : "block"}`}
          onError={() => setHasError(true)}
        />
      ) : null}

      {(!resolvedUrl || hasError) && (
        <div
          className={`flex h-full w-full items-center justify-center ${roundedClassName} ${fallbackClassName}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
