"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import type { Course } from "@/components/types";

export function AddCourseDialog({
  open,
  onClose,
  existingCourses,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  existingCourses: Course[];
  onAdd: (course: Course) => void;
}) {
  const [code, setCode] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [semesters, setSemesters] = React.useState("1");
  const [credits, setCredits] = React.useState("3");
  const [prereqs, setPrereqs] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
  }, [open]);

  function resetFields() {
    setCode("");
    setTitle("");
    setSemesters("1");
    setCredits("3");
    setPrereqs("");
    setNotes("");
    setError(null);
  }

  function handleClose() {
    resetFields();
    onClose();
  }

  function handleAdd() {
    setError(null);
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Course code is required.");
      return;
    }
    const trimmedTitle = title.trim() || trimmedCode;
    const prereqList = prereqs
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const course: Course = {
      code: trimmedCode,
      title: trimmedTitle,
      semesters: Number(semesters) || 1,
      credits: Number(credits) || 0,
      prereqs: prereqList,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    onAdd(course);
    resetFields();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add a course"
      description="Adds a course to your library. You can then drag it into the plan area and choose a term."
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Library</Badge>
            <span className="text-xs text-zinc-600">Custom courses (any school)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAdd}>Add course</Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Course code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., CS 101" />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Programming"
            />
          </div>

          <div className="space-y-1.5">
            <Label># of semesters</Label>
            <Select value={semesters} onChange={(e) => setSemesters(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Credits</Label>
            <Input
              inputMode="numeric"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="e.g., 3"
            />
            <p className="text-[11px] text-zinc-500">Shown on course cards.</p>
          </div>

          <div className="space-y-1.5">
            <Label>Quick-add a prereq</Label>
            <Select
              value={""}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                setPrereqs((prev) => {
                  const list = prev
                    .split(",")
                    .map((p) => p.trim())
                    .filter(Boolean);
                  if (list.includes(v)) return prev;
                  return [...list, v].join(", ");
                });
              }}
            >
              <option value="">Select from existing courses…</option>
              {existingCourses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Prereqs (comma-separated)</Label>
            <Input
              value={prereqs}
              onChange={(e) => setPrereqs(e.target.value)}
              placeholder="e.g., CS 100, MATH 101"
            />
            <p className="text-[11px] text-zinc-500">
              This stays flexible for any school — just type the course codes you want.
            </p>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Credits, requirements, etc." />
          </div>
        </div>
      </div>
    </Modal>
  );
}
