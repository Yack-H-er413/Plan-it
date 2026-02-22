import * as React from "react";
import { cn } from "./cn";

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "neutral" | "info" | "warn" | "success" }) {
  const variants = {
    neutral: "bg-zinc-100 text-zinc-700",
    info: "bg-blue-50 text-blue-700",
    warn: "bg-amber-50 text-amber-800",
    success: "bg-emerald-50 text-emerald-700",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
