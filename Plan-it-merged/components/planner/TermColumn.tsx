"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CourseChip } from "@/components/planner/CourseChip";
import type { Course, Term } from "@/components/types";
import { Plus } from "lucide-react";
import { AddNextCoursePopover } from "@/components/modals/AddNextCoursePopover";
import { springs } from "@/components/motion/tokens";

export function TermColumn({
  term,
  courseLibrary,
  onAddCourse,
  onRemoveCourse,
}: {
  term: Term;
  courseLibrary: Course[];
  onAddCourse: (courseCode: string) => void;
  onRemoveCourse: (courseCode: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <section className="w-[320px] shrink-0">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{term.label}</div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="neutral">{term.courses.length} course{term.courses.length === 1 ? "" : "s"}</Badge>
            <Badge variant="info">Editable</Badge>
          </div>
        </div>

        <div className="relative">
          <Button size="icon" variant="secondary" aria-label="Add next course" onClick={() => setOpen((v) => !v)}>
            <Plus className="h-4 w-4" />
          </Button>
          <AddNextCoursePopover
            open={open}
            onClose={() => setOpen(false)}
            courseLibrary={courseLibrary}
            existingCodes={term.courses.map((c) => c.code)}
            onAdd={(code) => {
              onAddCourse(code);
              setOpen(false);
            }}
          />
        </div>
      </div>

      <div className="mt-3 space-y-3 rounded-3xl border border-zinc-200 bg-white p-3 shadow-soft">
        <AnimatePresence mode="popLayout">
          {term.courses.map((c) => (
            <CourseChip key={c.code} course={c} onRemove={() => onRemoveCourse(c.code)} />
          ))}
        </AnimatePresence>

        <motion.div
          layout
          className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.soft}
        >
          <p className="text-xs text-zinc-600">
            Use the (+) button to add courses from your library into this term.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
