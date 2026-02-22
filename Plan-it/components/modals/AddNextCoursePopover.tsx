"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Plus } from "lucide-react";

export function AddNextCoursePopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 z-30 w-[280px]">
      <Card className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">Add course</div>
          <button className="rounded-xl px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100" onClick={onClose}>
            Close
          </button>
        </div>

        <p className="mt-1 text-xs text-zinc-600">
          Shows eligible courses based on prereqs (UI only).
        </p>

        <div className="mt-3 space-y-2">
          <OptionRow label="CICS 160" subtitle="Data Structures" />
          <OptionRow label="CICS 210" subtitle="Programming Methodology" />
          <OptionRow label="STAT 515" subtitle="Intro Statistics" />
        </div>

        <div className="mt-3 rounded-2xl bg-zinc-50 p-2">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Badge variant="info">Step 8</Badge>
            <span>Dropdown appears with possible classes.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function OptionRow({ label, subtitle }: { label: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200 p-2 hover:bg-zinc-50">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="truncate text-xs text-zinc-600">{subtitle}</div>
      </div>
      <Button size="icon" variant="secondary" aria-label={`Add ${label}`}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
