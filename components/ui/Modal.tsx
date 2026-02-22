"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "./cn";
import { springs, tweens } from "@/components/motion/tokens";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={tweens.exit}
        >
          <motion.div
            className={cn(
              "absolute inset-0 bg-black/35 supports-[backdrop-filter]:bg-black/25",
              "backdrop-blur-[2px]"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={tweens.exit}
            onClick={onClose}
          />

          <motion.div
            className={cn(
              "relative w-full max-w-lg rounded-3xl border shadow-soft",
              // Liquid-glass surface
              "border-white/40 bg-white/70 supports-[backdrop-filter]:bg-white/55 backdrop-blur-xl"
            )}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={springs.pop}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">{title}</h2>
                  {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
                </div>
                <motion.button
                  onClick={onClose}
                  className={cn(
                    "rounded-xl p-2 text-zinc-700",
                    "transition-[background-color] duration-200 ease-ios",
                    "hover:bg-white/60",
                    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                  )}
                  whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  transition={springs.ui}
                  aria-label="Close"
                >
                  ✕
                </motion.button>
              </div>
              <div className="mt-4">{children}</div>
            </div>
            {footer ? <div className="border-t border-white/40 p-4">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
