import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="mx-auto max-w-xl p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Start your plan</h3>
          <p className="mt-1 text-sm text-zinc-600">
            Add a course from the sidebar and drag it into a term column. If a term can’t be inferred,
            you’ll be prompted to pick one.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button>
              <Plus className="h-4 w-4" />
              Add first course
            </Button>
            <Button variant="secondary">Choose a template</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
