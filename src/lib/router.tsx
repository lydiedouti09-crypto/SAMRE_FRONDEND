import {
  Link as RouterLink,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import React from "react";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  prefetch?: boolean;
  replace?: boolean;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function Link({ to, href, prefetch, replace, ...props }: LinkProps) {
  const target = to || href || "";
  if (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:")
  ) {
    return (
      <a
        href={target}
        {...props}
      />
    );
  }
  return <RouterLink to={target} replace={replace} {...props} />;
}

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export { useParams, useSearchParams, useNavigate, useLocation };
export default Link;
