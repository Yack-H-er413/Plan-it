"use client";

import { getStorageScope, storagePrefixForScope, type StorageScope } from "@/components/storage/storageScope";

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

// New storage layout:
//   planit::local::<suffix>
//   planit::google::<google-sub>::<suffix>
const INDEX_SUFFIX = "workspaces_index_v1";
const STATE_PREFIX_SUFFIX = "workspace_state_v1::";

// Legacy keys (pre-account scoping).
const LEGACY_UNSCOPED_INDEX_KEY = "planit_workspaces_index_v1";
const LEGACY_UNSCOPED_STATE_PREFIX = "planit_workspace_state_v1::";
const LEGACY_SINGLE_KEY = "planit_state_v1";

const DEFAULT_CREDIT_GOAL = 120;

let didMigrateUnscopedToLocal = false;

function activeScope(): StorageScope {
  return getStorageScope();
}

function activeProvider(): WorkspaceProvider {
  return activeScope().provider === "google" ? "google" : "local";
}

function prefixForScope(scope: StorageScope) {
  return storagePrefixForScope(scope);
}

function activePrefix() {
  return prefixForScope(activeScope());
}

function indexKey(prefix: string) {
  return `${prefix}${INDEX_SUFFIX}`;
}

function stateKey(prefix: string, id: string) {
  return `${prefix}${STATE_PREFIX_SUFFIX}${id}`;
}

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

function readIndexFor(prefix: string, provider: WorkspaceProvider): WorkspaceMeta[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<unknown>(localStorage.getItem(indexKey(prefix)));
  if (!Array.isArray(parsed)) return [];

  return (parsed as any[])
    .filter((x) => x && typeof x.id === "string" && typeof x.name === "string")
    .map((x) => ({
      id: String(x.id),
      name: String(x.name),
      // Provider is derived from the active namespace to keep it consistent.
      provider,
      creditGoal: normalizeCreditGoal((x as any).creditGoal),
      createdAt: Number(x.createdAt) || now(),
      updatedAt: Number(x.updatedAt) || now(),
    }));
}

function writeIndexFor(prefix: string, items: WorkspaceMeta[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(indexKey(prefix), JSON.stringify(items));
}

export function workspaceStateKey(id: string) {
  return stateKey(activePrefix(), id);
}

function ensureLocalMigrations() {
  if (typeof window === "undefined") return;
  if (didMigrateUnscopedToLocal) return;
  didMigrateUnscopedToLocal = true;

  const localPrefix = prefixForScope({ provider: "local" });

  // Migrate legacy unscoped multi-workspace storage → scoped local.
  try {
    const hasLocalIndex = !!localStorage.getItem(indexKey(localPrefix));
    const legacyIndexRaw = localStorage.getItem(LEGACY_UNSCOPED_INDEX_KEY);

    if (!hasLocalIndex && legacyIndexRaw) {
      const parsed = safeParse<any[]>(legacyIndexRaw);
      if (Array.isArray(parsed)) {
        const migrated: WorkspaceMeta[] = parsed
          .filter((x) => x && typeof x.id === "string" && typeof x.name === "string")
          .map((x) => ({
            id: String(x.id),
            name: String(x.name),
            provider: "local",
            creditGoal: normalizeCreditGoal((x as any).creditGoal),
            createdAt: Number((x as any).createdAt) || now(),
            updatedAt: Number((x as any).updatedAt) || now(),
          }));
        writeIndexFor(localPrefix, migrated);

        for (const ws of migrated) {
          const legacyStateKey = `${LEGACY_UNSCOPED_STATE_PREFIX}${ws.id}`;
          const nextStateKey = stateKey(localPrefix, ws.id);
          if (localStorage.getItem(nextStateKey)) continue;
          const raw = localStorage.getItem(legacyStateKey);
          if (raw) localStorage.setItem(nextStateKey, raw);
        }
      }
    }
  } catch {
    // ignore
  }

  // Migrate the oldest legacy single-plan storage → scoped local workspace.
  try {
    const existingLocal = readIndexFor(localPrefix, "local");
    if (existingLocal.length === 0) {
      const legacy = localStorage.getItem(LEGACY_SINGLE_KEY);
      if (legacy) {
        const ws = createWorkspaceInPrefix(localPrefix, "local", { name: "My plan", initialStateUrl: legacy });
        // Keep the legacy key for safety.
        void ws;
      }
    }
  } catch {
    // ignore
  }
}

function createWorkspaceInPrefix(
  prefix: string,
  provider: WorkspaceProvider,
  opts?: { name?: string; initialStateUrl?: string; creditGoal?: number }
) {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${now()}-${Math.random().toString(16).slice(2)}`;

  const createdAt = now();
  const meta: WorkspaceMeta = {
    id,
    name: (opts?.name ?? "Untitled plan").trim() || "Untitled plan",
    provider,
    creditGoal: normalizeCreditGoal(opts?.creditGoal),
    createdAt,
    updatedAt: createdAt,
  };

  const next = [...readIndexFor(prefix, provider), meta];
  writeIndexFor(prefix, next);

  if (opts?.initialStateUrl) {
    try {
      localStorage.setItem(stateKey(prefix, id), opts.initialStateUrl);
    } catch {
      // ignore
    }
  }

  return meta;
}

function markAccountInitialized(prefix: string) {
  try {
    localStorage.setItem(`${prefix}account_initialized_v1`, "1");
  } catch {
    // ignore
  }
}

function isAccountInitialized(prefix: string) {
  try {
    return localStorage.getItem(`${prefix}account_initialized_v1`) === "1";
  } catch {
    return false;
  }
}

function claimLocalIntoGoogleIfEmpty(googleUserKey: string) {
  if (!googleUserKey) return;
  if (typeof window === "undefined") return;
  ensureLocalMigrations();

  const localPrefix = prefixForScope({ provider: "local" });
  const googlePrefix = prefixForScope({ provider: "google", userKey: googleUserKey });

  if (isAccountInitialized(googlePrefix)) return;

  const existingGoogle = readIndexFor(googlePrefix, "google");
  if (existingGoogle.length > 0) {
    markAccountInitialized(googlePrefix);
    return;
  }

  const local = readIndexFor(localPrefix, "local");
  if (local.length === 0) {
    markAccountInitialized(googlePrefix);
    return;
  }

  const migrated: WorkspaceMeta[] = local.map((w) => ({ ...w, provider: "google" }));
  writeIndexFor(googlePrefix, migrated);

  for (const ws of migrated) {
    const src = stateKey(localPrefix, ws.id);
    const dst = stateKey(googlePrefix, ws.id);
    if (localStorage.getItem(dst)) continue;
    const raw = localStorage.getItem(src);
    if (raw) localStorage.setItem(dst, raw);
  }

  markAccountInitialized(googlePrefix);
}

/**
 * One-time bootstrap/migrations.
 *
 * - Migrates older unscoped keys into the scoped local namespace.
 * - If a Google user key is provided and the account namespace is empty, it
 *   copies the local namespace into that account namespace exactly once.
 */
export function bootstrapWorkspacesStorage(opts?: { googleUserKey: string | null }) {
  if (typeof window === "undefined") return;
  ensureLocalMigrations();
  if (opts?.googleUserKey) claimLocalIntoGoogleIfEmpty(opts.googleUserKey);
}

export function listWorkspaces(): WorkspaceMeta[] {
  ensureLocalMigrations();
  const all = readIndexFor(activePrefix(), activeProvider());
  return [...all].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getWorkspace(id: string): WorkspaceMeta | null {
  ensureLocalMigrations();
  const all = readIndexFor(activePrefix(), activeProvider());
  return all.find((w) => w.id === id) ?? null;
}

export function ensureWorkspaceExists(id: string, opts?: { name?: string; creditGoal?: number }) {
  ensureLocalMigrations();
  const existing = getWorkspace(id);
  if (existing) return existing;
  const createdAt = now();
  const meta: WorkspaceMeta = {
    id,
    name: (opts?.name ?? "Untitled plan").trim() || "Untitled plan",
    provider: activeProvider(),
    creditGoal: normalizeCreditGoal(opts?.creditGoal),
    createdAt,
    updatedAt: createdAt,
  };
  const prefix = activePrefix();
  const provider = activeProvider();
  const next = [...readIndexFor(prefix, provider), meta];
  writeIndexFor(prefix, next);
  return meta;
}

export function createWorkspace(opts?: { name?: string; initialStateUrl?: string; creditGoal?: number }) {
  ensureLocalMigrations();
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
  ensureLocalMigrations();
  const nextName = name.trim() || "Untitled plan";
  const prefix = activePrefix();
  const provider = activeProvider();
  const all = readIndexFor(prefix, provider);
  const next = all.map((w) => (w.id === id ? { ...w, name: nextName, updatedAt: now() } : w));
  writeIndexFor(prefix, next);
}

export function setWorkspaceCreditGoal(id: string, creditGoal: number) {
  ensureLocalMigrations();
  const goal = normalizeCreditGoal(creditGoal);
  const prefix = activePrefix();
  const provider = activeProvider();
  const all = readIndexFor(prefix, provider);
  const next = all.map((w) => (w.id === id ? { ...w, creditGoal: goal, updatedAt: now() } : w));
  writeIndexFor(prefix, next);
}

export function deleteWorkspace(id: string) {
  ensureLocalMigrations();
  const prefix = activePrefix();
  const provider = activeProvider();
  const all = readIndexFor(prefix, provider);
  writeIndexFor(prefix, all.filter((w) => w.id !== id));
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
  ensureLocalMigrations();
  const prefix = activePrefix();
  const provider = activeProvider();
  const all = readIndexFor(prefix, provider);
  const next = all.map((w) => (w.id === id ? { ...w, updatedAt: now() } : w));
  writeIndexFor(prefix, next);
}

export function getWorkspaceStateUrl(id: string): string | null {
  ensureLocalMigrations();
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(workspaceStateKey(id));
  } catch {
    return null;
  }
}

export function setWorkspaceStateUrl(id: string, url: string) {
  ensureLocalMigrations();
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(workspaceStateKey(id), url);
    touchWorkspace(id);
  } catch {
    // ignore
  }
}

export function clearWorkspaceState(id: string) {
  ensureLocalMigrations();
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
  // Deprecated entrypoint kept for backwards compatibility.
  // All legacy migration is now handled inside bootstrapWorkspacesStorage().
  bootstrapWorkspacesStorage({ googleUserKey: null });
}
