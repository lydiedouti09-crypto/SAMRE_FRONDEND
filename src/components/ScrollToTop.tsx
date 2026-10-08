import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Remonte automatiquement en haut de page lors de chaque changement de route
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
