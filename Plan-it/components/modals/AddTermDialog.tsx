"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";

export function AddTermDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a term"
      description="UI-only. In the real app this would create a new semester column."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Add term</Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Season</Label>
          <Select defaultValue="fall">
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Year</Label>
          <Input placeholder="e.g., 2026" />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label>Label preview</Label>
          <Input defaultValue="Fall 2026" />
        </div>
      </div>
    </Modal>
  );
}
