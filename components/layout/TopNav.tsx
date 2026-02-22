"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { CalendarDays, Share2, RotateCcw, FolderOpen } from "lucide-react";
import { springs } from "@/components/motion/tokens";

type WorkspaceBadge = {
  id: string;
  name: string;
  provider: "local" | "google";
};

export function TopNav({
  onOpenShare,
  onReset,
  workspace,
  credits,
}: {
  onOpenShare: () => void;
  onReset: () => void;
  workspace?: WorkspaceBadge;
  credits?: { total: number; completed: number; goal: number };
}) {
  const goal = credits?.goal ?? 120;
  const total = Math.max(0, Math.round((credits?.total ?? 0) * 100) / 100);
  const completed = Math.max(0, Math.round((credits?.completed ?? 0) * 100) / 100);
  const pct = goal > 0 ? Math.min(100, Math.round((total / goal) * 100)) : 0;

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
              {workspace?.name ? <Badge variant="neutral">{workspace.name}</Badge> : null}
              {workspace ? (
                <Badge variant={workspace.provider === "google" ? "info" : "success"}>
                  {workspace.provider === "google" ? "Google" : "Local"}
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-zinc-600">Prerequisite-aware semester planner</p>
          </div>
        </div>

        {credits ? (
          <div className="hidden min-w-[280px] flex-1 items-center justify-center px-2 md:flex">
            <div className="w-full max-w-[360px] rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-soft">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="text-zinc-700">
                  <span className="font-semibold">{total}</span>
                  <span className="text-zinc-500"> / {goal} credits</span>
                  <span className="ml-2 text-zinc-500">(earned {completed})</span>
                </div>
                <div className="text-zinc-500">{pct}%</div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-900"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenShare}>
            <Share2 className="h-4 w-4" />
            Share / Import
          </Button>
          <Button variant="secondary" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <ButtonLink variant="ghost" size="icon" href="/workspaces" aria-label="Workspaces">
            <FolderOpen className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </motion.header>
  );
}
