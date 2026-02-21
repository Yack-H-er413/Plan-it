import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Workspace } from "@/components/planner/Workspace";
import { Inspector } from "@/components/layout/Inspector";
import type { Course, Term } from "@/components/types";
import template from "@/templates/umass-cs-demo.json";

const demoCourses = template.uiOnly.courseLibrary as unknown as Course[];
const demoTerms = template.uiOnly.terms as unknown as Term[];

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
