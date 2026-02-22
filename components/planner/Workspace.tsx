"use client";

import * as React from "react";
import type { Course, Term } from "@/components/types";
import { TermColumn } from "@/components/planner/TermColumn";
import { Button } from "@/components/ui/Button";
import { AddTermDialog } from "@/components/modals/AddTermDialog";
import { EmptyState } from "@/components/planner/EmptyState";
import { Plus, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function Workspace({
  terms,
  courseLibrary,
  onAddTerm,
  onAddCourseToTerm,
  onRemoveCourseFromTerm,
  onOpenShare,
}: {
  terms: Term[];
  courseLibrary: Course[];
  onAddTerm: (label: string) => void;
  onAddCourseToTerm: (termId: string, courseCode: string) => void;
  onRemoveCourseFromTerm: (termId: string, courseCode: string) => void;
  onOpenShare: () => void;
}) {
  const [openAddTerm, setOpenAddTerm] = React.useState(false);

  return (
    <section className="relative flex h-full flex-col bg-zinc-50">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <h2 className="text-sm font-semibold">Planner</h2>
          <p className="text-xs text-zinc-600">
            Blank slate by default. Add terms and courses, then share/import via URL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenShare}>
            <Share2 className="h-4 w-4" />
            Share / Import
          </Button>
          <Button size="sm" onClick={() => setOpenAddTerm(true)}>
            <Plus className="h-4 w-4" />
            Add term
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-6">
        {terms.length === 0 ? (
          <div className="grid h-full place-items-center">
            <EmptyState onAddTerm={() => setOpenAddTerm(true)} onOpenShare={onOpenShare} />
          </div>
        ) : (
          <div className="flex min-w-full gap-4">
            {terms.map((t) => (
              <TermColumn
                key={t.id}
                term={t}
                courseLibrary={courseLibrary}
                onAddCourse={(courseCode) => onAddCourseToTerm(t.id, courseCode)}
                onRemoveCourse={(courseCode) => onRemoveCourseFromTerm(t.id, courseCode)}
              />
            ))}

            <Card className="w-[320px] shrink-0 border-dashed bg-white p-4">
              <div className="text-sm font-semibold">Add more terms</div>
              <p className="mt-1 text-sm text-zinc-600">E.g., Summer sessions, Year 2, etc.</p>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => setOpenAddTerm(true)}>
                  <Plus className="h-4 w-4" />
                  Add term
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <AddTermDialog
        open={openAddTerm}
        onClose={() => setOpenAddTerm(false)}
        onAdd={(label) => {
          onAddTerm(label);
          setOpenAddTerm(false);
        }}
      />
    </section>
  );
}
