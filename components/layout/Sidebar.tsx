"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, GripVertical, Info } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { Course } from "@/components/types";
import { AddCourseDialog } from "@/components/modals/AddCourseDialog";

type Props = {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onOpenShare: () => void;
};

export function Sidebar({ courses, onAddCourse, onOpenShare }: Props) {
  const [openAdd, setOpenAdd] = React.useState(false);

  const getCredits = React.useCallback((c: Course) => {
    if (typeof c.credits === "number" && !Number.isNaN(c.credits) && c.credits > 0) return c.credits;
    const m = (c.notes ?? "").match(/(\d+(?:\.\d+)?)\s*credits?/i);
    if (m) return Number(m[1]);
    return null;
  }, []);

  return (
    <aside className="flex h-full flex-col border-r border-zinc-200 bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Course Library</h2>
            <p className="text-xs text-zinc-600">Add courses, then drag them into the plan area</p>
          </div>
          <Button size="icon" aria-label="Add course" onClick={() => setOpenAdd(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input className="pl-9" placeholder="Search courses (not wired)" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
            <div className="text-sm font-semibold">No courses yet</div>
            <p className="mt-1 text-sm text-zinc-600">
              Start from a blank slate: add your own courses, or import a shared schedule link.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setOpenAdd(true)}>
                <Plus className="h-4 w-4" />
                Add a course
              </Button>
              <Button variant="ghost" onClick={onOpenShare}>
                Import
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((c) => (
              <Card
                key={c.code}
                className="p-3 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => {
                  // HTML5 drag-drop: put the course code on the dataTransfer payload.
                  // Consumers can read either text/plain or this custom mime type.
                  e.dataTransfer.setData("text/plain", c.code);
                  e.dataTransfer.setData("application/x-planit-course", c.code);
                  e.dataTransfer.effectAllowed = "copy";
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 text-zinc-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-semibold">{c.code}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">{c.semesters} sem</Badge>
                        {getCredits(c) != null ? <Badge variant="neutral">{getCredits(c)} cr</Badge> : null}
                      </div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-zinc-600">{c.title}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.prereqs.length === 0 ? (
                        <Badge variant="success">No prereqs</Badge>
                      ) : (
                        <>
                          <Badge variant="warn">Prereqs</Badge>
                          {c.prereqs.slice(0, 3).map((p) => (
                            <Badge key={p} variant="neutral">{p}</Badge>
                          ))}
                          {c.prereqs.length > 3 ? (
                            <Badge variant="neutral">+{c.prereqs.length - 3}</Badge>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
          <div className="flex items-start gap-2 text-xs text-zinc-600">
            <Info className="mt-0.5 h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium text-zinc-800">Demo hint</div>
              <p className="mt-0.5">
                Add a term column, then use the (+) button in a term to place courses. Use “Share / Import”
                in the top bar to copy a link or load someone else’s schedule.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddCourseDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        existingCourses={courses}
        onAdd={(course) => {
          onAddCourse(course);
          setOpenAdd(false);
        }}
      />
    </aside>
  );
}
