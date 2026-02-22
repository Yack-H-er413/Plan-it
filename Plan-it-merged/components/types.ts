export type Course = {
  code: string;
  title: string;
  semesters: number;
  prereqs: string[];
  /** Credit value for the course (e.g., 3, 4). Optional for backwards-compat with older JSON. */
  credits?: number;
  notes?: string;
};

export type Term = {
  id: string;
  label: string; // e.g., "Fall 2026"
  courses: Course[];
  /** If true, this term's credits count as "earned" (previously taken). */
  completed?: boolean;
};
