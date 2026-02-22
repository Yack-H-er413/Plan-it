import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Link2,
  ShieldCheck,
} from "lucide-react";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-zinc-50 to-zinc-100" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/50 via-fuchsia-200/30 to-emerald-200/30 blur-3xl" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <Link href="/" aria-label="Back to landing page" className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-200/70">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Plan-it</span>
              </div>
              <p className="text-xs text-zinc-600">
                Prerequisite-aware semester planner
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <ButtonLink variant="ghost" size="sm" href="/workspaces">
              Workspaces
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink variant="secondary" size="sm" href="/login">
              Log in
            </ButtonLink>
            <ButtonLink variant="default" size="sm" href="/signup">
              Get started
            </ButtonLink>
            <ThemeToggle size="sm" />
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="success">Works without an account</Badge>
                <Badge variant="info">Google sign-in available</Badge>
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Plan semesters with prerequisite checks built in.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base text-zinc-700 md:text-lg">
                Plan smarter. Graduate faster. <br />
                Mapping your degree, one class at a time.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/workspaces"
                  size="lg"
                  className="justify-center"
                >
                  Open workspaces
                  <ArrowRight className="h-5 w-5" />
                </ButtonLink>
                <ButtonLink
                  href="/signup"
                  variant="secondary"
                  size="lg"
                  className="justify-center"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </ButtonLink>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 shadow-soft">
                  Prereq checks
                </span>
                <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 shadow-soft">
                  Local autosave
                </span>
                <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1 shadow-soft">
                  Shareable link
                </span>
              </div>
            </div>

            {/* mock screenshot */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <Badge variant="neutral">Preview</Badge>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="h-10 rounded-2xl border border-zinc-200 bg-white" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-24 rounded-2xl border border-zinc-200 bg-white" />
                    <div className="col-span-2 h-24 rounded-2xl border border-zinc-200 bg-white" />
                  </div>
                  <div className="h-44 rounded-2xl border border-zinc-200 bg-white" />
                </div>
                <p className="mt-4 text-xs text-zinc-600">
                  Open the planner workspace to build a library, lay out terms,
                  and share.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* feature grid */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-14">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-4">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold">Course library</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Add courses for any school: code, title, credits, notes, and
                  prerequisites.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold">Prereq validation</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Prevents placing a course before its prerequisites (or in the
                  same term).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white shadow-soft">
                  <Link2 className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold">Share / import</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Copy a link to share your plan or import someone else’s in one
                  step.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-soft">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-base font-semibold">Ready to try it?</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Open the planner now. Sign in with Google to attach your identity.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <ButtonLink
                    href="/workspaces"
                  variant="secondary"
                  className="justify-center"
                >
                    Open workspaces
                  <ArrowRight className="h-5 w-5" />
                </ButtonLink>
                <ButtonLink href="/login" className="justify-center">
                  <GoogleIcon className="h-5 w-5" />
                  Log in with Google
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto w-full max-w-6xl px-4 pb-10">
          <div className="flex flex-col items-start justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Plan-it
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Next.js
              </span>
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Tailwind
              </span>
              <span className="rounded-full border border-zinc-200 bg-white/70 px-3 py-1">
                Google sign-in
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
