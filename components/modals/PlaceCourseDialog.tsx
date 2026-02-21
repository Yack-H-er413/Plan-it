"use client";

import * as React from "react";
import type { Course, Term } from "@/components/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export type PlaceCourseSelection =
  | { kind: "existing"; termId: string }
  | { kind: "new"; termLabel: string };

function getCredits(course: Course): number | null {
  if (typeof course.credits === "number" && !Number.isNaN(course.credits) && course.credits > 0) return course.credits;
  const m = (course.notes ?? "").match(/(\d+(?:\.\d+)?)\s*credits?/i);
  if (m) return Number(m[1]);
  return null;
}

export function PlaceCourseDialog({
  open,
  onClose,
  course,
  terms,
  error,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  terms: Term[];
  error: string | null;
  onConfirm: (selection: PlaceCourseSelection) => void;
}) {
  const [mode, setMode] = React.useState<"existing" | "new">("existing");
  const [selectedTermId, setSelectedTermId] = React.useState<string>("");
  const [newTermLabel, setNewTermLabel] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    // default to first term if available
    setMode(terms.length > 0 ? "existing" : "new");
    setSelectedTermId(terms[0]?.id ?? "");
    setNewTermLabel(terms.length === 0 ? "Fall 2025" : "");
  }, [open, terms]);

  if (!course) {
    return (
      <Modal open={open} onClose={onClose} title="Place course" description="No course selected." />
    );
  }

  const credits = getCredits(course);

  const footer = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{course.semesters} sem</Badge>
        {credits != null ? <Badge variant="neutral">{credits} cr</Badge> : null}
        {course.prereqs.length ? <Badge variant="warn">Prereqs: {course.prereqs.join(", ")}</Badge> : <Badge variant="success">No prereqs</Badge>}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (mode === "new") {
              onConfirm({ kind: "new", termLabel: newTermLabel });
              return;
            }
            onConfirm({ kind: "existing", termId: selectedTermId });
          }}
        >
          Place course
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Place ${course.code}`}
      description="Choose which term to put this course in. Prereqs must be completed in an earlier term."
      footer={footer}
    >
      <div className="grid gap-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-sm font-semibold">Term selection</div>
          <p className="mt-1 text-sm text-zinc-600">
            If you pick a term that is too early, you&apos;ll get a prereq error. (Example: don&apos;t take CICS 210
            in the same term as CICS 160.)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
              <option value="existing">Choose existing term</option>
              <option value="new">Create new term</option>
            </Select>
          </div>

          {mode === "existing" ? (
            <div className="space-y-2">
              <Label>Existing term</Label>
              <Select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                disabled={terms.length === 0}
              >
                {terms.length === 0 ? (
                  <option value="">No terms yet — switch to “Create new term”</option>
                ) : null}
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>New term label</Label>
              <Input
                value={newTermLabel}
                onChange={(e) => setNewTermLabel(e.target.value)}
                placeholder="e.g., Fall 2026"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
