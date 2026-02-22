"use client";

import * as React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { setStorageScope } from "@/components/storage/storageScope";
import { bootstrapWorkspacesStorage } from "@/components/workspaces/workspacesStorage";

function StorageScopeBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Establish the storage namespace before other components run their effects.
  React.useLayoutEffect(() => {
    // Always bootstrap/migrate storage first (idempotent).
    bootstrapWorkspacesStorage({
      googleUserKey: status === "authenticated" ? session?.user?.planitUserKey ?? null : null,
    });

    if (status === "authenticated" && session?.user?.planitUserKey) {
      setStorageScope({ provider: "google", userKey: session.user.planitUserKey });
      return;
    }
    if (status === "unauthenticated") {
      setStorageScope({ provider: "local" });
    }
  }, [status, session?.user?.planitUserKey]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StorageScopeBridge>{children}</StorageScopeBridge>
    </SessionProvider>
  );
}
