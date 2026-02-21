import * as React from "react";
import { cn } from "./cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none",
          "focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
