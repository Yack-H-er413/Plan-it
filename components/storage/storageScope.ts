"use client";

export type StorageScope =
  | { provider: "local" }
  | { provider: "google"; userKey: string };

const SCOPE_EVENT = "planit:storage-scope";

let activeScope: StorageScope = { provider: "local" };

export function getStorageScope(): StorageScope {
  return activeScope;
}

export function setStorageScope(next: StorageScope) {
  // Normalize empty keys to local.
  if ((next as any).provider === "google" && !(next as any).userKey) {
    activeScope = { provider: "local" };
  } else {
    activeScope = next;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SCOPE_EVENT, { detail: activeScope }));
  }
}

export function onStorageScopeChange(cb: (scope: StorageScope) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail as StorageScope | undefined;
    if (detail) cb(detail);
  };
  window.addEventListener(SCOPE_EVENT, handler);
  return () => window.removeEventListener(SCOPE_EVENT, handler);
}

export function storagePrefixForScope(scope: StorageScope): string {
  if (scope.provider === "google") {
    // Encode to keep the key localStorage-safe.
    const encoded = encodeURIComponent(scope.userKey);
    return `planit::google::${encoded}::`;
  }
  return "planit::local::";
}
