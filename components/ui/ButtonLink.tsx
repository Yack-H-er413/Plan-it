import * as React from "react";
import Link from "next/link";
import { cn } from "./cn";

type Props = React.ComponentPropsWithoutRef<typeof Link> & {
  variant?: "default" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function ButtonLink({
  className,
  variant = "default",
  size = "md",
  ...props
}: Props) {
  const base =
    [
      "inline-flex items-center justify-center gap-2 rounded-2xl font-medium",
      "transition-[transform,background-color,border-color,box-shadow,opacity] duration-200 ease-ios",
      "will-change-transform",
      "hover:translate-y-[-0.5px] hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]",
      // Respect user's reduced motion preference
      "motion-reduce:transform-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
      "disabled:opacity-50 disabled:pointer-events-none",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70",
    ].join(" ");
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    default: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-soft",
    secondary:
      "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-soft",
    ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-soft",
  };
  const sizes: Record<NonNullable<Props["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
    icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
  };

  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
