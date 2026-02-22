"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CalendarDays, Share2, RotateCcw, Settings2 } from "lucide-react";
import { springs } from "@/components/motion/tokens";

export function TopNav({
  onOpenShare,
  onReset,
}: {
  onOpenShare: () => void;
  onReset: () => void;
}) {
  return (
    <motion.header
      className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold">Plan-it</h1>
              <Badge variant="info">Planner</Badge>
            </div>
            <p className="text-xs text-zinc-600">Prerequisite-aware semester planner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenShare}>
            <Share2 className="h-4 w-4" />
            Share / Import
          </Button>
          <Button variant="secondary" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
