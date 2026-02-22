"use client";

import * as React from "react";
import { motion } from "motion/react";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Course, Term } from "@/components/types";
import { ShareImportDialog } from "@/components/modals/ShareImportDialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { DropPlanArea } from "@/components/planner/DropPlanArea";
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

const STORAGE_KEY = "planit_state_v1";

function makeId(prefix: string) {
  // crypto.randomUUID is widely supported in modern browsers.
  // Fall back to a time-based id if unavailable.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return `${prefix}-${(crypto as any).randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AppShell() {
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

  // Drag/drop placement modal state
  const [placeOpen, setPlaceOpen] = React.useState(false);
  const [pendingCourseCode, setPendingCourseCode] = React.useState<string | null>(null);
  const [placeError, setPlaceError] = React.useState<string | null>(null);

  const plannerState: PlannerState = React.useMemo(
    () => ({ courseLibrary: courses, terms }),
    [courses, terms]
  );

  // Initial load: URL state wins; else localStorage; else blank.
  React.useEffect(() => {
    const fromUrl = decodePlannerStateFromUrl(window.location.href);
    if (fromUrl) {
      setCourses(fromUrl.courseLibrary);
      setTerms(fromUrl.terms);
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const restored = decodePlannerStateFromUrl(raw);
    if (restored) {
      setCourses(restored.courseLibrary);
      setTerms(restored.terms);
    }
  }, []);

  // Autosave (as a self-contained importable URL string).
  React.useEffect(() => {
    try {
      const url = encodePlannerStateToUrl(plannerState, { absolute: false });
      localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // ignore storage errors
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
    // Clear share param from the current URL (if any)
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("s");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, []);

  const requestReset = React.useCallback(() => {
    setResetConfirmOpen(true);
  }, []);

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
    setTerms((prev) => [...prev, { id: makeId("term"), label: trimmed, courses: [] }]);
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
  }, []);

  function validatePlacement(nextCourse: Course, targetTermId: string, snapshotTerms: Term[]) {
    const targetIndex = snapshotTerms.findIndex((t) => t.id === targetTermId);
    if (targetIndex === -1) {
      return { ok: false, message: "That term no longer exists. Try again." } as const;
    }

    // Block duplicates anywhere in the plan.
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
      // Friendly explanation for the "same term" case.
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

      // Decide the destination term.
      let targetTermId: string | null = null;

      if (selection.kind === "existing") {
        targetTermId = selection.termId;
      } else {
        const label = selection.termLabel.trim();
        if (!label) {
          setPlaceError("Please enter a term label (e.g., Fall 2026). ");
          return;
        }
        // Avoid creating duplicate labels. If label exists, reuse it.
        const existing = terms.find((t) => t.label.trim().toLowerCase() === label.toLowerCase());
        if (existing) {
          targetTermId = existing.id;
        } else {
          // New term is appended to the end of the plan.
          const id = makeId("term");
          // Validate against the term that will exist at the end.
          const nextTermsSnapshot: Term[] = [...terms, { id, label, courses: [] }];
          const v = validatePlacement(course, id, nextTermsSnapshot);
          if (!v.ok) {
            setPlaceError(v.message);
            return;
          }
          setTerms((prev) => [...prev, { id, label, courses: [course] }]);
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

      // Place into the chosen existing term.
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
    setTerms(restored.terms);

    // Update the current URL so refresh keeps the imported state.
    try {
      const absoluteUrl = encodePlannerStateToUrl(restored, { absolute: true });
      window.history.replaceState({}, "", absoluteUrl);
    } catch {
      // ignore
    }
    return true;
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springs.soft}
    >
      <TopNav onOpenShare={() => setShareOpen(true)} onReset={requestReset} />
      <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
        <div className="h-[calc(100vh-57px)]">
          <Sidebar courses={courses} onAddCourse={addCourse} onOpenShare={() => setShareOpen(true)} />
        </div>
        <div className="h-[calc(100vh-57px)]">
          <DropPlanArea
            terms={terms}
            onCourseDropped={beginPlaceCourse}
            onAddTerm={addTerm}
            onRemoveCourseFromTerm={removeCourseFromTerm}
            onDeleteTerm={requestDeleteTerm}
          />
        </div>
      </main>

      <ShareImportDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        state={plannerState}
        onImport={importFromUrl}
        onReset={requestReset}
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
