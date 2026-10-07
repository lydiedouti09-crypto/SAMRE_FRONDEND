import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/api";

interface UserAvatarProps {
  photo?: string | null;
  name?: string | null;
  prenom?: string | null;
  nom?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
  ringClassName?: string;
}

const sizeClasses: Record<string, { container: string; text: string }> = {
  xs: { container: "h-7 w-7", text: "text-[10px]" },
  sm: { container: "h-8 w-8", text: "text-xs" },
  md: { container: "h-10 w-10", text: "text-sm" },
  lg: { container: "h-16 w-16", text: "text-xl" },
  xl: { container: "h-24 w-24", text: "text-3xl" },
};

export default function UserAvatar({
  photo,
  name,
  prenom,
  nom,
  size = "md",
  className = "",
  fallbackClassName = "",
  ringClassName = "",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Extraire les initiales
  const displayName = (
    name ||
    [prenom, nom].filter(Boolean).join(" ") ||
    "Testeur"
  ).trim();

  const initials = (
    ((prenom?.[0] || displayName[0] || "T") + (nom?.[0] || displayName.split(" ")[1]?.[0] || ""))
  ).toUpperCase();

  const photoUrl = getImageUrl(photo);

  useEffect(() => {
    setHasError(false);
  }, [photo]);

  const sizeStyle = sizeClasses[size] || sizeClasses.md;

  const showImage = Boolean(photoUrl) && !hasError;

  return (
    <div
      className={`relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-bold ${sizeStyle.container} ${ringClassName} ${className}`}
    >
      {showImage ? (
        <img
          src={photoUrl}
          alt={displayName}
          onError={() => setHasError(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#38BDF8] via-[#60A5FA] to-[#F97316] font-extrabold text-white shadow-2xs ${sizeStyle.text} ${fallbackClassName}`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
