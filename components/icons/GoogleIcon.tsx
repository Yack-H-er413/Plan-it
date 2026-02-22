import * as React from "react";
import { cn } from "@/components/ui/cn";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * Minimal Google "G" mark for auth buttons.
 */
export function GoogleIcon({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.55 32.657 29.163 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.657 15.108 18.975 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.681 0-14.343 4.326-17.694 10.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.16 35.091 26.715 36 24 36c-5.142 0-9.515-3.318-11.268-7.946l-6.52 5.026C9.522 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.57l.003-.002 6.19 5.238C36.983 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  );
}
