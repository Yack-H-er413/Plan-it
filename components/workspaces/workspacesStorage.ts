"use client";

export type WorkspaceProvider = "local" | "google";

export type WorkspaceMeta = {
  id: string;
  name: string;
  provider: WorkspaceProvider;
  /** Target total credits for the plan progress indicator. */
  creditGoal: number;
  createdAt: number;
  updatedAt: number;
};

const INDEX_KEY = "planit_workspaces_index_v1";
const LEGACY_SINGLE_KEY = "planit_state_v1";
const STATE_PREFIX = "planit_workspace_state_v1::";

const DEFAULT_CREDIT_GOAL = 120;

function now() {
  return Date.now();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeCreditGoal(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return DEFAULT_CREDIT_GOAL;
  // Allow 0, but avoid negative / absurdly large values.
  return Math.min(1000, Math.max(0, Math.round(n)));
}

function readIndex(): WorkspaceMeta[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<unknown>(localStorage.getItem(INDEX_KEY));
  if (!Array.isArray(parsed)) return [];

  return (parsed as any[])
    .filter((x) => x && typeof x.id === "string" && typeof x.name === "string")
    .map((x) => ({
      id: String(x.id),
      name: String(x.name),
      provider: (x.provider === "google" ? "google" : "local") as WorkspaceProvider,
      creditGoal: normalizeCreditGoal((x as any).creditGoal),
      createdAt: Number(x.createdAt) || now(),
      updatedAt: Number(x.updatedAt) || now(),
    }));
}

function writeIndex(items: WorkspaceMeta[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INDEX_KEY, JSON.stringify(items));
}

export function workspaceStateKey(id: string) {
  return `${STATE_PREFIX}${id}`;
}

export function listWorkspaces(): WorkspaceMeta[] {
  const all = readIndex();
  return [...all].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getWorkspace(id: string): WorkspaceMeta | null {
  const all = readIndex();
  return all.find((w) => w.id === id) ?? null;
}

export function ensureWorkspaceExists(id: string, opts?: { name?: string; creditGoal?: number }) {
  const existing = getWorkspace(id);
  if (existing) return existing;
  const createdAt = now();
  const meta: WorkspaceMeta = {
    id,
    name: (opts?.name ?? "Untitled plan").trim() || "Untitled plan",
    provider: "local",
    creditGoal: normalizeCreditGoal(opts?.creditGoal),
    createdAt,
    updatedAt: createdAt,
  };
  const next = [...readIndex(), meta];
  writeIndex(next);
  return meta;
}

export function createWorkspace(opts?: { name?: string; initialStateUrl?: string; creditGoal?: number }) {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${now()}-${Math.random().toString(16).slice(2)}`;

  const meta = ensureWorkspaceExists(id, {
    name: opts?.name,
    creditGoal: opts?.creditGoal,
  });

  if (opts?.initialStateUrl) {
    try {
      localStorage.setItem(workspaceStateKey(id), opts.initialStateUrl);
      touchWorkspace(id);
    } catch {
      // ignore
    }
  }

  return meta;
}

export function renameWorkspace(id: string, name: string) {
  const nextName = name.trim() || "Untitled plan";
  const all = readIndex();
  const next = all.map((w) => (w.id === id ? { ...w, name: nextName, updatedAt: now() } : w));
  writeIndex(next);
}

export function setWorkspaceCreditGoal(id: string, creditGoal: number) {
  const goal = normalizeCreditGoal(creditGoal);
  const all = readIndex();
  const next = all.map((w) => (w.id === id ? { ...w, creditGoal: goal, updatedAt: now() } : w));
  writeIndex(next);
}

export function deleteWorkspace(id: string) {
  const all = readIndex();
  writeIndex(all.filter((w) => w.id !== id));
  try {
    localStorage.removeItem(workspaceStateKey(id));
  } catch {
    // ignore
  }
}

export function duplicateWorkspace(id: string) {
  const src = getWorkspace(id);
  const raw = getWorkspaceStateUrl(id);
  const next = createWorkspace({
    name: src ? `${src.name} (copy)` : "Copy",
    initialStateUrl: raw ?? undefined,
    creditGoal: src?.creditGoal,
  });
  return next;
}

export function touchWorkspace(id: string) {
  const all = readIndex();
  const next = all.map((w) => (w.id === id ? { ...w, updatedAt: now() } : w));
  writeIndex(next);
}

export function getWorkspaceStateUrl(id: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(workspaceStateKey(id));
  } catch {
    return null;
  }
}

export function setWorkspaceStateUrl(id: string, url: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(workspaceStateKey(id), url);
    touchWorkspace(id);
  } catch {
    // ignore
  }
}

export function clearWorkspaceState(id: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(workspaceStateKey(id));
    touchWorkspace(id);
  } catch {
    // ignore
  }
}

/**
 * One-time migration:
 * - Previous versions stored a single plan under LEGACY_SINGLE_KEY.
 * - If no workspaces exist yet, create one "My plan" and move the saved state.
 */
export function migrateLegacyPlanIfNeeded() {
  if (typeof window === "undefined") return;

  const existing = readIndex();
  if (existing.length > 0) return;

  const legacy = localStorage.getItem(LEGACY_SINGLE_KEY);
  if (!legacy) return;

  const ws = createWorkspace({ name: "My plan", initialStateUrl: legacy });
  // Keep legacy key for safety, but it's now effectively superseded.
  // (Removing it would be safe but makes rollback harder.)
  return ws;
}
