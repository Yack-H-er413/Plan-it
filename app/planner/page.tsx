"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createWorkspace, migrateLegacyPlanIfNeeded } from "@/components/workspaces/workspacesStorage";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Page() {
  const router = useRouter();
  const search = useSearchParams();

  React.useEffect(() => {
    migrateLegacyPlanIfNeeded();

    const token = search.get("s");
    if (token) {
      const ws = createWorkspace({ name: "Imported plan", initialStateUrl: `?s=${token}` });
      router.replace(`/planner/${ws.id}`);
      return;
    }

    router.replace("/workspaces");
  }, [router, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100 p-4">
      <div className="mx-auto w-full max-w-lg pt-16">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Planner</Badge>
              <Badge variant="neutral">Redirecting</Badge>
            </div>
            <p className="mt-3 text-sm text-zinc-700">
              Taking you to your workspaces…
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
