"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { cn } from "@/components/ui/cn";

export function GoogleSignInButton({
  callbackUrl = "/workspaces",
  label = "Continue with Google",
  className,
}: {
  callbackUrl?: string;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          setLoading(true);
          await signIn("google", { callbackUrl });
        } finally {
          setLoading(false);
        }
      }}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 text-base font-medium text-zinc-900 shadow-soft transition hover:bg-zinc-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      disabled={loading}
      aria-busy={loading}
    >
      <GoogleIcon className="h-5 w-5" />
      {loading ? "Redirecting…" : label}
    </button>
  );
}
