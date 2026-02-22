"use client";

import * as React from "react";

/**
 * Minimal "presence" helper: keeps a component mounted long enough to
 * play an exit animation after `open` flips to false.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [present, setPresent] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }

    // When closing, stay mounted until the CSS exit animation finishes.
    const t = window.setTimeout(() => setPresent(false), exitMs);
    return () => window.clearTimeout(t);
  }, [open, exitMs]);

  return present;
}
