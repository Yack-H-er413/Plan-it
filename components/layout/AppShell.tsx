import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Workspace } from "@/components/planner/Workspace";
import { Inspector } from "@/components/layout/Inspector";
import type { Course, Term } from "@/components/types";

const demoCourses: Course[] = [
  { code: "CICS 110", title: "Intro to Programming", semesters: 1, prereqs: [] },
  { code: "CICS 160", title: "Data Structures", semesters: 1, prereqs: ["CICS 110"] },
  { code: "CICS 210", title: "Programming Methodology", semesters: 1, prereqs: ["CICS 110"] },
  { code: "MATH 131", title: "Calculus I", semesters: 1, prereqs: [] },
  { code: "STAT 515", title: "Intro Statistics", semesters: 1, prereqs: ["MATH 131"] },
];

const demoTerms: Term[] = [
  {
    id: "fall-2026",
    label: "Fall 2026",
    courses: [
      { code: "CICS 110", title: "Intro to Programming", semesters: 1, prereqs: [] },
    ],
  },
  {
    id: "spring-2027",
    label: "Spring 2027",
    courses: [
      { code: "CICS 160", title: "Data Structures", semesters: 1, prereqs: ["CICS 110"] },
    ],
  },
];

export function AppShell() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-0 lg:grid-cols-[360px_1fr_340px]">
        <div className="h-[calc(100vh-57px)]">
          <Sidebar courses={demoCourses} />
        </div>
        <div className="h-[calc(100vh-57px)]">
          <Workspace terms={demoTerms} />
        </div>
        <div className="h-[calc(100vh-57px)]">
          <Inspector />
        </div>
      </main>
    </div>
  );
}
