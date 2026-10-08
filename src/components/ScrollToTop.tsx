import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Remonte automatiquement en haut de page lors de chaque changement de route
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
