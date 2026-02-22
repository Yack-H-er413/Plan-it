"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Modal } from "@/components/ui/Modal";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { ArrowRight, CalendarDays, CheckCircle2, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "signup";

export function AuthScreen({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [adminName, setAdminName] = React.useState("");
  const [adminError, setAdminError] = React.useState<string | null>(null);

  // If someone lands on /login?admin=1, open the admin modal automatically.
  React.useEffect(() => {
    if (!isLogin) return;
    const wantsAdmin = searchParams.get("admin") === "1";
    if (!wantsAdmin) return;
    setAdminError(null);
    setAdminOpen(true);
  }, [isLogin, searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-zinc-100" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-fuchsia-200/30 to-emerald-200/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center">
        {/* left */}
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Plan-it</span>
              </div>
              <p className="text-xs text-zinc-600">Course mapping & prereq planning</p>
            </div>
          </div>

          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-sm text-zinc-700 md:text-base">
            {isLogin
              ? "Sign in to continue working on your plan graphs and semester layout."
              : "Sign up to save and share course maps across devices."}
          </p>

          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-soft">
              <LockKeyhole className="mt-0.5 h-5 w-5 text-zinc-700" />
              <div>
                <p className="text-sm font-medium">Secure sign-in with Google</p>
                <p className="mt-0.5 text-sm text-zinc-600">
                  Use your Google account for fast, passwordless access.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-soft">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-zinc-700" />
              <div>
                <p className="text-sm font-medium">Shareable planning workspace</p>
                <p className="mt-0.5 text-sm text-zinc-600">
                  Save your plan, share a link, and import plans from teammates or advisors.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ButtonLink href="/" variant="ghost" size="sm">
              Back to landing
            </ButtonLink>
            <ButtonLink href="/planner" variant="secondary" size="sm">
              Open planner
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        {/* right */}
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-base">
              {isLogin ? "Log in" : "Sign up"}
            </CardTitle>
            <p className="text-sm text-zinc-600">
              {isLogin
                ? "Continue with Google to access your workspace."
                : "Continue with Google to create your account."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                type="button"
                variant="secondary"
                className="h-11 w-full justify-center text-base"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </Button>

              {isLogin ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={() => {
                    setAdminError(null);
                    setAdminName("");
                    setAdminOpen(true);
                  }}
                >
                  Administrator
                </Button>
              ) : null}

              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="text-zinc-600">
                  {isLogin ? "No account yet?" : "Already have an account?"}
                </p>
                <ButtonLink
                  href={isLogin ? "/signup" : "/login"}
                  variant="ghost"
                  size="sm"
                  className="px-0"
                >
                  {isLogin ? "Sign up" : "Log in"}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        title="Administrator access"
        description="Enter a username to open the admin workspace (for aesthetics only)."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setAdminOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const trimmed = adminName.trim();
                if (!trimmed) {
                  setAdminError("Please enter a username.");
                  return;
                }
                try {
                  sessionStorage.setItem("planit_admin_username", trimmed);
                } catch {
                  // ignore
                }
                setAdminOpen(false);
                router.push("/admin");
              }}
            >
              Continue
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          {adminError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {adminError}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label>Username</Label>
            <Input
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g., advisor01"
              autoFocus
            />
            <p className="text-xs text-zinc-600">
              This isn’t saved to a database yet — it’s just to personalize the admin view.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
