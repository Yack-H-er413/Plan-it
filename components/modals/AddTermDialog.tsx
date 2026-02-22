"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function AddTermDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (label: string) => void;
}) {
  const [label, setLabel] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
  }, [open]);

  function handleClose() {
    setLabel("");
    setError(null);
    onClose();
  }

  function handleAdd() {
    const trimmed = label.trim();
    if (!trimmed) {
      setError("Term label is required.");
      return;
    }
    onAdd(trimmed);
    setLabel("");
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add a term"
      description="Creates a new column in your planner (e.g., “Fall 2026”, “Year 2 — Spring”)."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add term</Button>
        </div>
      }
    >
      <div className="grid gap-3">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label>Term label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., Fall 2026" />
          <p className="text-[11px] text-zinc-500">This is intentionally free-form so any school can use it.</p>
        </div>
      </div>
    </Modal>
  );
}
