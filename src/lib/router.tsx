import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import React from "react";

export interface LinkProps extends Omit<RouterLinkProps, "to"> {
  to?: string;
  href?: string;
  prefetch?: boolean;
  replace?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Link({ to, href, ...props }: LinkProps) {
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
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }
  return <RouterLink to={target} {...props} />;
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
