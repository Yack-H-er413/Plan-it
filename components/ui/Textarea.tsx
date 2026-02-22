import * as React from "react";
import { cn } from "./cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[96px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none",
          "focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100",
          "transition-[border-color,box-shadow] duration-200 ease-ios",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
