"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendarDays, Home, Link2, LayoutGrid, RotateCcw, Share2 } from "lucide-react";
import { springs } from "@/components/motion/tokens";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useRouter } from "next/navigation";

export type AdminTab = "builder" | "export";

export function AdminTopNav({
  tab,
  onChangeTab,
  onOpenShare,
  onReset,
}: {
  tab: AdminTab;
  onChangeTab: (t: AdminTab) => void;
  onOpenShare: () => void;
  onReset: () => void;
}) {
  const router = useRouter();
  return (
    <motion.header
      className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.soft}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="default"
              onClick={() => router.push("/")}
              aria-label="Go to home"
              title="Home"
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold">Plan-it</h1>
                <Badge variant="neutral">Admin</Badge>
              </div>
              <p className="text-xs text-zinc-600">Create templates & generate import codes</p>
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
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={tab === "builder" ? "default" : "secondary"}
            onClick={() => onChangeTab("builder")}
          >
            <LayoutGrid className="h-4 w-4" />
            Template builder
          </Button>
          <Button
            size="sm"
            variant={tab === "export" ? "default" : "secondary"}
            onClick={() => onChangeTab("export")}
          >
            <Link2 className="h-4 w-4" />
            Export code
          </Button>

          <div className="flex-1" />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (typeof window !== "undefined") window.location.href = "/planner";
            }}
          >
            <Home className="h-4 w-4" />
            Student view
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
