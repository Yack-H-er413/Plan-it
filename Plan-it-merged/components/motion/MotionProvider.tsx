"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";
import { springs } from "@/components/motion/tokens";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={springs.ui}>
      {children}
    </MotionConfig>
  );
}
