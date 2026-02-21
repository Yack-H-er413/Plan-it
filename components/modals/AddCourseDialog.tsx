"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";

export function AddCourseDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a course"
      description="UI-only form (no persistence). Mirrors the hackathon flow: name, semesters, prereqs."
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Step 2</Badge>
            <span className="text-xs text-zinc-600">Clicked (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Add course</Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Course code / name</Label>
          <Input placeholder="e.g., CICS 110" />
        </div>

        <div className="space-y-1.5">
          <Label># of semesters</Label>
          <Select defaultValue="1">
            <option value="1">1</option>
            <option value="2">2</option>
          </Select>
          <p className="text-[11px] text-zinc-500">Mocked as a dropdown (scroll wheel in mockup).</p>
        </div>

        <div className="space-y-1.5">
          <Label>Prereqs</Label>
          <Select defaultValue="">
            <option value="">None / (empty if first course)</option>
            <option value="CICS 110">CICS 110</option>
            <option value="MATH 131">MATH 131</option>
            <option value="STAT 515">STAT 515</option>
          </Select>
          <p className="text-[11px] text-zinc-500">In the real app: multi-select + AND/OR blocks.</p>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Notes</Label>
          <Textarea placeholder="Optional notes (UI only)..." />
        </div>
      </div>
    </Modal>
  );
}
