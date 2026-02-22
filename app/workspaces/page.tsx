"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { PlanItLogo } from "@/components/branding/PlanItLogo";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  Plus,
  ArrowRight,
  Pencil,
  Copy,
  Trash2,
  Cloud,
} from "lucide-react";
import {
  createWorkspace,
  deleteWorkspace,
  duplicateWorkspace,
  listWorkspaces,
  migrateLegacyPlanIfNeeded,
  renameWorkspace,
  setWorkspaceCreditGoal,
  type WorkspaceMeta,
} from "@/components/workspaces/workspacesStorage";
import { onStorageScopeChange } from "@/components/storage/storageScope";

function formatUpdatedAt(ts: number) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = React.useState<WorkspaceMeta[]>([]);

  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState<string>("");
  const [creditGoalValue, setCreditGoalValue] = React.useState<string>("120");

  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    setWorkspaces(listWorkspaces());
  }, []);

  React.useEffect(() => {
    migrateLegacyPlanIfNeeded();
    refresh();
  }, [refresh]);

  React.useEffect(() => {
    // If the auth state flips (e.g., SessionProvider resolves), refresh the list.
    return onStorageScopeChange(() => refresh());
  }, [refresh]);

  const openRename = React.useCallback((ws: WorkspaceMeta) => {
    setRenameId(ws.id);
    setRenameValue(ws.name);
    setCreditGoalValue(String(ws.creditGoal ?? 120));
    setRenameOpen(true);
  }, []);

  const onCreate = React.useCallback(() => {
    const ws = createWorkspace({ name: "Untitled plan" });
    refresh();
    router.push(`/planner/${ws.id}`);
  }, [refresh, router]);

  const onDuplicate = React.useCallback(
    (id: string) => {
      const ws = duplicateWorkspace(id);
      refresh();
      router.push(`/planner/${ws.id}`);
    },
    [refresh, router]
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-zinc-100" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-fuchsia-200/30 to-emerald-200/30 blur-3xl" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <Link href="/" aria-label="Back to landing page" className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-transparent shadow-soft">
              <PlanItLogo size={40} className="h-10 w-10" priority />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Plan-it</span>
                <Badge variant="info">Workspaces</Badge>
              </div>
              <p className="text-xs text-zinc-600">Create, save, and switch between plans</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {status === "authenticated" ? (
              <>
                <div className="hidden items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-soft sm:flex">
                  {session?.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-5 w-5 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="h-5 w-5 rounded-full bg-zinc-200" />
                  )}
                  <span className="max-w-[180px] truncate">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <ButtonLink variant="secondary" size="sm" href="/login">
                  Log in
                </ButtonLink>
                <ButtonLink variant="default" size="sm" href="/signup">
                  Sign up
                </ButtonLink>
              </>
            )}
            <ThemeToggle size="sm" />
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="success">Saved in this browser</Badge>
                {status === "authenticated" ? (
                  <Badge variant="info">Linked to Google account</Badge>
                ) : (
                  <Badge variant="neutral">Local profile</Badge>
                )}
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Workspaces
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-700 md:text-base">
                Each workspace is a separate planner. Changes autosave. When you sign in with Google,
                workspaces are stored under your Google account on this device.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {status === "authenticated" ? (
                <div className="inline-flex h-10 items-center gap-2 rounded-2xl border border-zinc-200 bg-white/70 px-4 text-sm text-zinc-700 shadow-soft">
                  <Cloud className="h-4 w-4" />
                  Google account linked
                </div>
              ) : (
                <GoogleSignInButton
                  callbackUrl="/workspaces"
                  label="Sign in with Google"
                  className="h-10 w-auto px-4 text-sm"
                />
              )}
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4" />
                New workspace
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-14">
          {workspaces.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-zinc-700">
                  No workspaces yet. Create one to start planning.
                </p>
                <div className="mt-4">
                  <Button onClick={onCreate}>
                    <Plus className="h-4 w-4" />
                    Create your first workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {workspaces.map((ws) => (
                <Card key={ws.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{ws.name}</CardTitle>
                        <p className="mt-1 text-xs text-zinc-600">
                          Updated {formatUpdatedAt(ws.updatedAt)}
                        </p>
                        <p className="mt-1 text-xs text-zinc-600">Goal {ws.creditGoal} credits</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ws.provider === "google" ? "info" : "success"}>
                          {ws.provider === "google" ? "Google" : "Local"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="default"
                        onClick={() => router.push(`/planner/${ws.id}`)}
                      >
                        Open
                        <ArrowRight className="h-4 w-4" />
                      </Button>

                      <Button variant="secondary" onClick={() => openRename(ws)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button variant="secondary" onClick={() => onDuplicate(ws.id)}>
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </Button>

                      <Button variant="secondary" onClick={() => setDeleteId(ws.id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal
        open={renameOpen}
        onClose={() => {
          setRenameOpen(false);
          setRenameId(null);
        }}
        title="Workspace settings"
        description="Rename the workspace and set a credit goal for the progress bar."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setRenameOpen(false);
                setRenameId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!renameId) return;
                renameWorkspace(renameId, renameValue);
                const parsed = Number(creditGoalValue);
                if (Number.isFinite(parsed)) setWorkspaceCreditGoal(renameId, parsed);
                setRenameOpen(false);
                setRenameId(null);
                refresh();
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="workspace-name">
            Workspace name
          </label>
          <Input
            id="workspace-name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="e.g., CS degree plan"
          />

          <label className="mt-2 text-sm font-medium" htmlFor="workspace-credit-goal">
            Credit goal
          </label>
          <Input
            id="workspace-credit-goal"
            type="number"
            min={0}
            step={1}
            value={creditGoalValue}
            onChange={(e) => setCreditGoalValue(e.target.value)}
            placeholder="120"
          />
          <p className="text-xs text-zinc-600">Used to compute the progress bar percentage.</p>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete workspace?"
        description="This permanently removes the workspace and its saved planner state from this browser."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={() => {
          if (!deleteId) return;
          deleteWorkspace(deleteId);
          setDeleteId(null);
          refresh();
        }}
      />
    </div>
  );
}
