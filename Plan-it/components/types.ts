export type Course = {
  code: string;
  title: string;
  semesters: number;
  prereqs: string[];
  notes?: string;
};

export type Term = {
  id: string;
  label: string; // e.g., "Fall 2026"
  courses: Course[];
};
