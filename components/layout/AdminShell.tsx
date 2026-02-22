"use client";

import * as React from "react";
import { motion } from "motion/react";
import type { Course, Term } from "@/components/types";
import { AdminTopNav, type AdminTab } from "@/components/layout/AdminTopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { DropPlanArea } from "@/components/planner/DropPlanArea";
import { ShareImportDialog } from "@/components/modals/ShareImportDialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  PlaceCourseDialog,
  type PlaceCourseSelection,
} from "@/components/modals/PlaceCourseDialog";
import {
  decodePlannerStateFromUrl,
  encodePlannerStateToUrl,
  type PlannerState,
} from "@/components/share/plannerShare";
import { springs } from "@/components/motion/tokens";

function sumCredits(courses: Course[]): number {
  return courses.reduce((acc, c) => {
    if (typeof c.credits === "number" && !Number.isNaN(c.credits)) return acc + c.credits;
    const m = (c.notes ?? "").match(/(\d+(?:\.\d+)?)\s*credits?/i);
    if (m) return acc + Number(m[1]);
    return acc;
  }, 0);
}

function normalizeTerms(input: Term[]): Term[] {
  return input.map((t) => ({ ...t, completed: !!t.completed }));
}

const STORAGE_KEY = "planit_admin_state_v1";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AdminShell() {
  const [tab, setTab] = React.useState<AdminTab>("builder");
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [terms, setTerms] = React.useState<Term[]>([]);
  const [shareOpen, setShareOpen] = React.useState(false);

  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false);
  const [deleteTermTarget, setDeleteTermTarget] = React.useState<
    | {
        id: string;
        label: string;
        courseCount: number;
      }
    | null
  >(null);

  const [placeOpen, setPlaceOpen] = React.useState(false);
  const [pendingCourseCode, setPendingCourseCode] = React.useState<string | null>(null);
  const [placeError, setPlaceError] = React.useState<string | null>(null);

  const [adminUsername, setAdminUsername] = React.useState<string>("");

  React.useEffect(() => {
    try {
      const u = sessionStorage.getItem("planit_admin_username") ?? "";
      setAdminUsername(u);
    } catch {
      // ignore
    }
  }, []);

  const plannerState: PlannerState = React.useMemo(
    () => ({ courseLibrary: courses, terms }),
    [courses, terms]
  );

  React.useEffect(() => {
    const fromUrl = decodePlannerStateFromUrl(window.location.href);
    if (fromUrl) {
      setCourses(fromUrl.courseLibrary);
      setTerms(normalizeTerms(fromUrl.terms));
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const restored = decodePlannerStateFromUrl(raw);
    if (restored) {
      setCourses(restored.courseLibrary);
      setTerms(normalizeTerms(restored.terms));
    }
  }, []);

  React.useEffect(() => {
    try {
      const url = encodePlannerStateToUrl(plannerState, { absolute: false });
      localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // ignore
    }
  }, [plannerState]);

  const resetToBlank = React.useCallback(() => {
    setCourses([]);
    setTerms([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("s");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, []);

  const requestReset = React.useCallback(() => setResetConfirmOpen(true), []);

  const addCourse = React.useCallback((course: Course) => {
    setCourses((prev) => {
      const normalized = course.code.trim().toLowerCase();
      const next = prev.filter((c) => c.code.trim().toLowerCase() !== normalized);
      next.push(course);
      return next;
    });
  }, []);

  const addTerm = React.useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTerms((prev) => [...prev, { id: makeId("term"), label: trimmed, courses: [], completed: false }]);
  }, []);

  const toggleTermCompleted = React.useCallback((termId: string) => {
    setTerms((prev) => prev.map((t) => (t.id === termId ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeCourseFromTerm = React.useCallback((termId: string, courseCode: string) => {
    setTerms((prev) =>
      prev.map((t) =>
        t.id !== termId ? t : { ...t, courses: t.courses.filter((c) => c.code !== courseCode) }
      )
    );
  }, []);

  const requestDeleteTerm = React.useCallback(
    (termId: string) => {
      const t = terms.find((x) => x.id === termId);
      if (!t) return;
      setDeleteTermTarget({ id: t.id, label: t.label, courseCount: t.courses.length });
    },
    [terms]
  );

  const deleteTerm = React.useCallback((termId: string) => {
    setTerms((prev) => prev.filter((t) => t.id !== termId));
    setDeleteTermTarget(null);
  }, []);

  function validatePlacement(nextCourse: Course, targetTermId: string, snapshotTerms: Term[]) {
    const targetIndex = snapshotTerms.findIndex((t) => t.id === targetTermId);
    if (targetIndex === -1) {
      return { ok: false, message: "That term no longer exists. Try again." } as const;
    }

    const alreadyIn = snapshotTerms.find((t) => t.courses.some((c) => c.code === nextCourse.code));
    if (alreadyIn) {
      return {
        ok: false,
        message: `${nextCourse.code} is already placed in ${alreadyIn.label}. Remove it first if you want to move it.`,
      } as const;
    }

    const completed = new Set<string>();
    for (let i = 0; i < targetIndex; i++) {
      for (const c of snapshotTerms[i].courses) completed.add(c.code);
    }

    const sameTermCodes = new Set(snapshotTerms[targetIndex].courses.map((c) => c.code));
    const missing = nextCourse.prereqs.filter((p) => !completed.has(p));
    const sameTermPrereqs = nextCourse.prereqs.filter((p) => sameTermCodes.has(p));

    if (missing.length > 0) {
      if (sameTermPrereqs.length > 0) {
        return {
          ok: false,
          message: `You can’t take ${nextCourse.code} in the same term as its prereq(s): ${sameTermPrereqs.join(", ")}. Put prereqs in an earlier term.`,
        } as const;
      }
      return {
        ok: false,
        message: `Missing prereq(s) for ${nextCourse.code}: ${missing.join(", ")}. Add them to an earlier term first.`,
      } as const;
    }

    return { ok: true, message: "" } as const;
  }

  const beginPlaceCourse = React.useCallback(
    (courseCode: string) => {
      const course = courses.find((c) => c.code === courseCode);
      if (!course) return;
      setPendingCourseCode(course.code);
      setPlaceError(null);
      setPlaceOpen(true);
    },
    [courses]
  );

  const confirmPlaceCourse = React.useCallback(
    (selection: PlaceCourseSelection) => {
      if (!pendingCourseCode) return;
      const course = courses.find((c) => c.code === pendingCourseCode);
      if (!course) return;

      let targetTermId: string | null = null;

      if (selection.kind === "existing") {
        targetTermId = selection.termId;
      } else {
        const label = selection.termLabel.trim();
        if (!label) {
          setPlaceError("Enter a term label (e.g., Fall 2026).");
          return;
        }
        const existing = terms.find((t) => t.label.trim().toLowerCase() === label.toLowerCase());
        if (existing) {
          targetTermId = existing.id;
        } else {
          const id = makeId("term");
          const nextTermsSnapshot: Term[] = [...terms, { id, label, courses: [], completed: false }];
          const v = validatePlacement(course, id, nextTermsSnapshot);
          if (!v.ok) {
            setPlaceError(v.message);
            return;
          }
          setTerms((prev) => [...prev, { id, label, courses: [course], completed: false }]);
          setPlaceOpen(false);
          setPendingCourseCode(null);
          return;
        }
      }

      if (!targetTermId) return;

      const v = validatePlacement(course, targetTermId, terms);
      if (!v.ok) {
        setPlaceError(v.message);
        return;
      }

      setTerms((prev) =>
        prev.map((t) => {
          if (t.id !== targetTermId) return t;
          if (t.courses.some((c) => c.code === course.code)) return t;
          return { ...t, courses: [...t.courses, course] };
        })
      );

      setPlaceOpen(false);
      setPendingCourseCode(null);
    },
    [courses, pendingCourseCode, terms]
  );

  const importFromUrl = React.useCallback((urlOrToken: string) => {
    const restored = decodePlannerStateFromUrl(urlOrToken);
    if (!restored) return false;
    setCourses(restored.courseLibrary);
    setTerms(normalizeTerms(restored.terms));
    try {
      const absoluteUrl = encodePlannerStateToUrl(restored, { absolute: true });
      window.history.replaceState({}, "", absoluteUrl);
    } catch {
      // ignore
    }
    return true;
  }, []);

  const shareUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    return encodePlannerStateToUrl(plannerState, { absolute: true });
  }, [plannerState]);

  const shareToken = React.useMemo(() => {
    try {
      const u = new URL(shareUrl);
      return u.searchParams.get("s") ?? "";
    } catch {
      return "";
    }
  }, [shareUrl]);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springs.soft}
    >
      <AdminTopNav
        tab={tab}
        onChangeTab={setTab}
        onOpenShare={() => setShareOpen(true)}
        onReset={() => setResetConfirmOpen(true)}
      />

      {tab === "builder" ? (
        <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
          <div className="h-[calc(100vh-116px)]">
            <Sidebar courses={courses} onAddCourse={addCourse} onOpenShare={() => setShareOpen(true)} />
          </div>
          <div className="h-[calc(100vh-116px)]">
            <DropPlanArea
              terms={terms}
              onCourseDropped={beginPlaceCourse}
              onAddTerm={addTerm}
              onRemoveCourseFromTerm={removeCourseFromTerm}
              onDeleteTerm={requestDeleteTerm}
              onToggleTermCompleted={toggleTermCompleted}
            />
          </div>
        </main>
      ) : (
        <main className="mx-auto w-full max-w-[980px] px-4 py-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="neutral">Admin</Badge>
            <Badge variant="info">Export</Badge>
            {adminUsername ? <Badge variant="success">Signed in as {adminUsername}</Badge> : null}
          </div>

          <Card className="p-5">
            <h2 className="text-base font-semibold">Export code for students</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Build a template in <span className="font-medium">Template builder</span>, then copy this link. Students can paste it into
              <span className="font-medium"> Share / Import</span> in the student planner.
            </p>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <Label>Share link (paste into student Import)</Label>
                <div className="flex gap-2">
                  <Input readOnly value={shareUrl} />
                  <Button variant="secondary" onClick={() => copy(shareUrl)}>
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Short export code (token)</Label>
                <div className="flex gap-2">
                  <Input readOnly value={shareToken} />
                  <Button variant="secondary" onClick={() => copy(shareToken)} disabled={!shareToken}>
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-zinc-600">
                  If you want, students can also paste the full link instead (recommended).
                </p>
              </div>
            </div>
          </Card>
        </main>
      )}

      <ShareImportDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        state={plannerState}
        onImport={importFromUrl}
        onReset={() => setResetConfirmOpen(true)}
      />

      <PlaceCourseDialog
        open={placeOpen}
        onClose={() => {
          setPlaceOpen(false);
          setPendingCourseCode(null);
          setPlaceError(null);
        }}
        course={pendingCourseCode ? courses.find((c) => c.code === pendingCourseCode) ?? null : null}
        terms={terms}
        error={placeError}
        onConfirm={confirmPlaceCourse}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        title="Reset everything?"
        description="This clears your course library, all terms, and any saved state in this browser. You can’t undo this unless you previously copied a share link."
        confirmLabel="Reset"
        confirmVariant="danger"
        onConfirm={() => {
          resetToBlank();
          setShareOpen(false);
          setPlaceOpen(false);
          setPendingCourseCode(null);
          setPlaceError(null);
          setResetConfirmOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!deleteTermTarget}
        onClose={() => setDeleteTermTarget(null)}
        title={deleteTermTarget ? `Delete "${deleteTermTarget.label}"?` : "Delete term?"}
        description={
          deleteTermTarget
            ? deleteTermTarget.courseCount > 0
              ? `This removes the term and unplaces ${deleteTermTarget.courseCount} course${
                  deleteTermTarget.courseCount === 1 ? "" : "s"
                }. Courses stay in your library.`
              : "This removes the term."
            : undefined
        }
        confirmLabel="Delete term"
        confirmVariant="danger"
        onConfirm={() => {
          if (!deleteTermTarget) return;
          deleteTerm(deleteTermTarget.id);
        }}
      />
    </motion.div>
  );
}
