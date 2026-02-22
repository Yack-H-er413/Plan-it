import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Sparkles, Share2 } from "lucide-react";

export function EmptyState({
  onAddTerm,
  onOpenShare,
}: {
  onAddTerm: () => void;
  onOpenShare: () => void;
}) {
  return (
    <Card className="mx-auto max-w-xl p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Start your plan</h3>
          <p className="mt-1 text-sm text-zinc-600">
            New users start with a blank slate. Create a term column, add courses to your library, then
            place them into terms.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onAddTerm}>
              <Plus className="h-4 w-4" />
              Add your first term
            </Button>
            <Button variant="secondary" onClick={onOpenShare}>
              <Share2 className="h-4 w-4" />
              Import a plan
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
