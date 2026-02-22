import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PlanItLogo } from "@/components/branding/PlanItLogo";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";

type Mode = "login" | "signup";

export function AuthScreen({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-zinc-100" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-fuchsia-200/30 to-emerald-200/30 blur-3xl" />


      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <Link
            href="/"
            aria-label="Back to landing page"
            className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70"
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-transparent shadow-soft">
              <PlanItLogo size={40} className="h-10 w-10" priority />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Plan-it</span>
                <Badge variant="info">{isLogin ? "Log in" : "Sign up"}</Badge>
              </div>
              <p className="text-xs text-zinc-600">Course mapping & prereq planning</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <ThemeToggle size="sm" />
            <ButtonLink href="/workspaces" variant="ghost" size="sm">
              Workspaces
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </nav>
        </div>
      </header>
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center">
        {/* left */}
        <div>
          <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-sm text-zinc-700 md:text-base">
            {isLogin
              ? "Sign in to continue working on your plan graphs and semester layout."
              : "Sign in with Google to keep workspaces tied to your account on this device and share plans with an importable link."}
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
                  Autosave your plan, share a link, and import plans from classmates or advisors.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ButtonLink href="/" variant="ghost" size="sm">
              Back to landing
            </ButtonLink>
            <ButtonLink href="/workspaces" variant="secondary" size="sm">
              Open workspaces
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
                ? "Continue with Google to access your workspaces."
                : "Continue with Google to get started."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <GoogleSignInButton callbackUrl="/workspaces" />

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
    </div>
  );
}
