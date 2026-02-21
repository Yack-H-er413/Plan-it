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
};

export function Sidebar({ courses }: Props) {
  const [openAdd, setOpenAdd] = React.useState(false);

  return (
    <aside className="flex h-full flex-col border-r border-zinc-200 bg-white">
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Course Library</h2>
            <p className="text-xs text-zinc-600">Add courses, then drag to the plan</p>
          </div>
          <Button size="icon" aria-label="Add course" onClick={() => setOpenAdd(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input className="pl-9" placeholder="Search courses (UI only)" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="space-y-3">
          {courses.map((c) => (
            <Card key={c.code} className="p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 text-zinc-400">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">{c.code}</div>
                    <Badge variant="neutral">{c.semesters} sem</Badge>
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
                        {c.prereqs.length > 3 ? <Badge variant="neutral">+{c.prereqs.length - 3}</Badge> : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
          <div className="flex items-start gap-2 text-xs text-zinc-600">
            <Info className="mt-0.5 h-4 w-4 text-zinc-500" />
            <div>
              <div className="font-medium text-zinc-800">Demo hint</div>
              <p className="mt-0.5">
                Drag a course card into the planner. If a term isn't selected, a popup will prompt for one.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddCourseDialog open={openAdd} onClose={() => setOpenAdd(false)} />
    </aside>
  );
}
