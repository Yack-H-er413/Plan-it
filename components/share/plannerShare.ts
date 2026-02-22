"use client";

import type { Course, Term } from "@/components/types";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "@/components/share/lzString";

export type PlannerState = {
  courseLibrary: Course[];
  terms: Term[];
};

type PayloadV1 = { v: 1; state: PlannerState };

export function encodePlannerStateToToken(state: PlannerState): string {
  const payload: PayloadV1 = { v: 1, state };
  const json = JSON.stringify(payload);
  return compressToEncodedURIComponent(json);
}

export function decodePlannerStateFromToken(token: string): PlannerState | null {
  try {
    const json = decompressFromEncodedURIComponent(token.trim());
    if (!json) return null;
    const payload = JSON.parse(json) as PayloadV1;
    if (!payload || payload.v !== 1 || !payload.state) return null;
    const { courseLibrary, terms } = payload.state;
    if (!Array.isArray(courseLibrary) || !Array.isArray(terms)) return null;
    return { courseLibrary, terms };
  } catch {
    return null;
  }
}

function extractToken(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // If user pasted just the token.
  if (!trimmed.includes("http") && !trimmed.includes("?")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return url.searchParams.get("s");
  } catch {
    // If it's not a valid URL, fall back to a best-effort parse.
    const match = trimmed.match(/[?&]s=([^&#]+)/);
    return match?.[1] ?? null;
  }
}

/**
 * Accepts:
 * - a full URL containing `?s=<token>`
 * - a raw `?s=<token>` string
 * - a bare token string
 */
export function decodePlannerStateFromUrl(urlOrToken: string): PlannerState | null {
  const token = extractToken(urlOrToken);
  if (!token) return null;
  return decodePlannerStateFromToken(token);
}

export function encodePlannerStateToUrl(
  state: PlannerState,
  opts: { absolute: boolean }
): string {
  const token = encodePlannerStateToToken(state);
  if (!opts.absolute) return `?s=${token}`;
  return `${window.location.origin}/planner?s=${token}`;
}
