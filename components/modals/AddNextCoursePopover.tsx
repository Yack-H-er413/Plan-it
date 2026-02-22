"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/components/types";
import { Plus, Search } from "lucide-react";
import { springs } from "@/components/motion/tokens";

export function AddNextCoursePopover({
  open,
  onClose,
  courseLibrary,
  existingCodes,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  courseLibrary: Course[];
  existingCodes: string[];
  onAdd: (courseCode: string) => void;
}) {
  const [q, setQ] = React.useState("");

  const options = React.useMemo(() => {
    const set = new Set(existingCodes);
    const filtered = courseLibrary.filter((c) => !set.has(c.code));
    const query = q.trim().toLowerCase();
    if (!query) return filtered;
    return filtered.filter((c) =>
      `${c.code} ${c.title}`.toLowerCase().includes(query)
    );
  }, [courseLibrary, existingCodes, q]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute right-0 top-12 z-30 w-[280px]"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={springs.pop}
        >
        <Card className="p-3 border-white/40 bg-white/70 supports-[backdrop-filter]:bg-white/55 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">Add course</div>
          <motion.button
            className="rounded-xl px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
            onClick={onClose}
            whileTap={{ scale: 0.98 }}
            transition={springs.ui}
          >
            Close
          </motion.button>
        </div>

        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
              placeholder="Search courses…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 max-h-[220px] space-y-2 overflow-auto">
          {courseLibrary.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
              Your course library is empty. Add courses in the left sidebar first.
            </div>
          ) : options.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
              No matching courses to add.
            </div>
          ) : (
            options.map((c) => (
              <OptionRow
                key={c.code}
                label={c.code}
                subtitle={c.title}
                onAdd={() => onAdd(c.code)}
              />
            ))
          )}
        </div>

        <div className="mt-3 rounded-2xl bg-zinc-50 p-2">
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <Badge variant="info">Tip</Badge>
            <span>Share this whole schedule via the top “Share / Import” button.</span>
          </div>
        </div>
        </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function OptionRow({
  label,
  subtitle,
  onAdd,
}: {
  label: string;
  subtitle: string;
  onAdd: () => void;
}) {
  return (
    <motion.div
      className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200 p-2 hover:bg-zinc-50"
      whileHover={{ y: -0.5 }}
      whileTap={{ scale: 0.99 }}
      transition={springs.ui}
    >
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{label}</div>
        <div className="truncate text-xs text-zinc-600">{subtitle}</div>
      </div>
      <Button size="icon" variant="secondary" aria-label={`Add ${label}`} onClick={onAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
