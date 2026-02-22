"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Trash2 } from "lucide-react";

export function Inspector() {
  return (
    <aside className="hidden h-full w-[340px] flex-col border-l border-zinc-200 bg-white lg:flex">
      <div className="p-4">
        <h2 className="text-sm font-semibold">Inspector</h2>
        <p className="text-xs text-zinc-600">Edit details for the selected item.</p>
      </div>

      <div className="flex-1 overflow-auto px-4 pb-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">COURSE 101</div>
                <Badge variant="info">Selected</Badge>
              </div>
              <div className="mt-1 text-xs text-zinc-600">Foundations</div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Course code</Label>
              <Input defaultValue="COURSE 101" />
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input defaultValue="Foundations" />
            </div>
            <div className="space-y-1.5">
              <Label>Semester count</Label>
              <Select defaultValue="1">
                <option value="1">1 semester</option>
                <option value="2">2 semesters</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Term</Label>
              <Select defaultValue="fall-2026">
                <option value="fall-2026">Fall 2026</option>
                <option value="spring-2027">Spring 2027</option>
                <option value="none">No term</option>
              </Select>
            </div>
          </div>
        </Card>

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-xs text-zinc-600">
            Select a course or requirement block on the canvas to view and edit its properties.
          </p>
        </div>
      </div>
    </aside>
  );
}
