"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createWorkspace, migrateLegacyPlanIfNeeded } from "@/components/workspaces/workspacesStorage";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CalendarDays } from "lucide-react";

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
      <header className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 pt-4">
        <Link
          href="/"
          aria-label="Back to landing page"
          className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70"
        >
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Plan-it</div>
            <p className="text-xs text-zinc-600">Planner</p>
          </div>
        </Link>
        <ThemeToggle size="sm" />
      </header>
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
