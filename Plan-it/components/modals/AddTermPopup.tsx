"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";

export function AddTermPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add term for this course"
      description="Mock of the “we can’t predict what term to sort this into” popup from the sketches."
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="warn">Step 6</Badge>
            <span className="text-xs text-zinc-600">Term required</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>Confirm</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-1.5">
        <Label>Select term</Label>
        <Select defaultValue="fall-2026">
          <option value="fall-2026">Fall 2026</option>
          <option value="spring-2027">Spring 2027</option>
          <option value="fall-2027">Fall 2027</option>
        </Select>
      </div>
    </Modal>
  );
}
