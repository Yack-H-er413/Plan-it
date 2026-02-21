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
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none";
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
    icon: "h-10 w-10",
  };

  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
