"use client";

import * as React from "react";
import type { Course, Term } from "@/components/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CourseChip } from "@/components/planner/CourseChip";
import { Plus, Trash2 } from "lucide-react";

function sumCredits(courses: Course[]): number {
  return courses.reduce((acc, c) => {
    if (typeof c.credits === "number" && !Number.isNaN(c.credits)) return acc + c.credits;
    const m = (c.notes ?? "").match(/(\d+(?:\.\d+)?)\s*credits?/i);
    if (m) return acc + Number(m[1]);
    return acc;
  }, 0);
}

export function DropPlanArea({
  terms,
  onCourseDropped,
  onAddTerm,
  onRemoveCourseFromTerm,
  onClearTerm,
}: {
  terms: Term[];
  onCourseDropped: (courseCode: string) => void;
  onAddTerm: (label: string) => void;
  onRemoveCourseFromTerm: (termId: string, courseCode: string) => void;
  onClearTerm: (termId: string) => void;
}) {
  const [newTermLabel, setNewTermLabel] = React.useState("");

  return (
    <section className="relative flex h-full flex-col bg-zinc-50">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <h2 className="text-sm font-semibold">Plan Area</h2>
          <p className="text-xs text-zinc-600">
            Drag a course from the left and drop it anywhere in this area. You&apos;ll then choose the term.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="h-9 w-[180px] rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            placeholder="Add term (optional)"
            value={newTermLabel}
            onChange={(e) => setNewTermLabel(e.target.value)}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const t = newTermLabel.trim();
              if (!t) return;
              onAddTerm(t);
              setNewTermLabel("");
            }}
          >
            <Plus className="h-4 w-4" />
            Add term
          </Button>
        </div>
      </div>

      {/* Drop target */}
      <div
        className="flex-1 overflow-auto px-4 pb-6"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const code =
            e.dataTransfer.getData("application/x-planit-course") ||
            e.dataTransfer.getData("text/plain");
          if (!code) return;
          onCourseDropped(code);
        }}
      >
        {terms.length === 0 ? (
          <div className="grid h-full place-items-center">
            <div className="max-w-lg rounded-3xl border border-dashed border-zinc-300 bg-white p-6 text-center shadow-soft">
              <div className="text-sm font-semibold">Drop courses here</div>
              <p className="mt-2 text-sm text-zinc-600">
                Start by dragging a course from the Course Library (left). After you drop it, you&apos;ll be
                asked which term it belongs to.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="neutral">Prereqs are enforced</Badge>
                <Badge variant="neutral">No same-term prereqs</Badge>
                <Badge variant="neutral">Credits shown</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {terms.map((t) => (
              <Card key={t.id} className="rounded-3xl bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.label}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="neutral">
                        {t.courses.length} course{t.courses.length === 1 ? "" : "s"}
                      </Badge>
                      <Badge variant="neutral">{sumCredits(t.courses)} cr</Badge>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Clear ${t.label}`}
                    onClick={() => onClearTerm(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 space-y-3">
                  {t.courses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-600">
                      No courses in this term yet.
                    </div>
                  ) : null}
                  {t.courses.map((c) => (
                    <CourseChip
                      key={c.code}
                      course={c}
                      onRemove={() => onRemoveCourseFromTerm(t.id, c.code)}
                    />
                  ))}
                </div>
              </Card>
            ))}

            <Card className="rounded-3xl border-dashed bg-white p-4 shadow-soft">
              <div className="text-sm font-semibold">Tip</div>
              <p className="mt-1 text-sm text-zinc-600">
                Drop a course anywhere on this right panel. You&apos;ll pick a term in a popup. If prereqs
                aren&apos;t satisfied in earlier terms, the app will block it.
              </p>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
