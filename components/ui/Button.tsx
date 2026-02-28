"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "./cn";
import { springs } from "@/components/motion/tokens";

type Props = HTMLMotionProps<"button"> & {
  variant?: "default" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({
  className,
  variant = "default",
  size = "md",
  type,
  ...props
}: Props) {
  const reduceMotion = useReducedMotion();
  const base =
    [
      "inline-flex items-center justify-center gap-2 rounded-2xl font-medium",
      "transition-[background-color,border-color,box-shadow,opacity] duration-200 ease-ios",
      "will-change-transform",
      "hover:opacity-95",
      // Consistent keyboard focus across the app
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70",
      "disabled:opacity-50 disabled:pointer-events-none",
    ].join(" ");
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    default: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-soft hover:translate-y-[-0.5px]",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-soft hover:translate-y-[-0.5px]",
    ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-soft hover:translate-y-[-0.5px]",
  };
  const sizes: Record<NonNullable<Props["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
    // Icon-only controls should meet accessible hit target size
    icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
  };

  return (
    <motion.button
      type={type ?? "button"}
      whileHover={
        props.disabled || reduceMotion
          ? undefined
          : {
              y: -0.75,
              scale: 1.01,
            }
      }
      whileTap={
        props.disabled || reduceMotion
          ? undefined
          : {
              y: 0,
              scale: 0.985,
            }
      }
      transition={springs.ui}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
