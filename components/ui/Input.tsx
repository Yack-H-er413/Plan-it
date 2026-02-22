import * as React from "react";
import { cn } from "./cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none",
          "focus-visible:border-zinc-400 focus-visible:ring-4 focus-visible:ring-zinc-100",
          "transition-[border-color,box-shadow] duration-200 ease-ios",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
