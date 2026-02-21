"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GripVertical, ArrowRight, X } from "lucide-react";
import type { Course } from "@/components/types";

export function CourseChip({ course, onRemove }: { course: Course; onRemove?: () => void }) {
  const credits = (() => {
    if (typeof course.credits === "number" && !Number.isNaN(course.credits) && course.credits > 0) return course.credits;
    const m = (course.notes ?? "").match(/(\d+(?:\.\d+)?)\s*credits?/i);
    if (m) return Number(m[1]);
    return null;
  })();

  return (
    <Card className="p-3">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-zinc-400">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-semibold">{course.code}</div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral">{course.semesters} sem</Badge>
              {credits != null ? <Badge variant="neutral">{credits} cr</Badge> : null}
              {onRemove ? (
                <button
                  type="button"
                  onClick={onRemove}
                  className="grid h-8 w-8 place-items-center rounded-xl text-zinc-600 hover:bg-zinc-100"
                  aria-label={`Remove ${course.code}`}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-0.5 truncate text-xs text-zinc-600">{course.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {course.prereqs.length === 0 ? (
              <Badge variant="success">No prereqs</Badge>
            ) : (
              <>
                <Badge variant="warn">Prereq</Badge>
                <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                  {course.prereqs[0]}
                  <ArrowRight className="h-3.5 w-3.5" />
                  {course.code}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
