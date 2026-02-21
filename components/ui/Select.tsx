import * as React from "react";
import { cn } from "./cn";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none",
        "focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
