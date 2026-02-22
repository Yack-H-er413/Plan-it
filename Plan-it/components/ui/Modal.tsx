"use client";

import * as React from "react";
import { cn } from "./cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn("relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-soft")}>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">{title}</h2>
              {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
        {footer ? <div className="border-t border-zinc-200 p-4">{footer}</div> : null}
      </div>
    </div>
  );
}
