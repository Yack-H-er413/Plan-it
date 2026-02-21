"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PlannerState } from "@/components/share/plannerShare";
import { encodePlannerStateToUrl } from "@/components/share/plannerShare";
import template from "@/templates/umass-cs-demo.json";

type Props = {
  open: boolean;
  onClose: () => void;
  state: PlannerState;
  onImport: (urlOrToken: string) => boolean;
  onReset: () => void;
};

export function ShareImportDialog({ open, onClose, state, onImport, onReset }: Props) {
  const [importValue, setImportValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
    setCopied(null);
  }, [open]);

  const shareUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    return encodePlannerStateToUrl(state, { absolute: true });
  }, [state]);

  const demoUrl = React.useMemo(() => {
    if (typeof window === "undefined") return "";
    const demoState = {
      courseLibrary: (template as any).uiOnly.courseLibrary,
      terms: (template as any).uiOnly.terms,
    } as PlannerState;
    return encodePlannerStateToUrl(demoState, { absolute: true });
  }, []);

  async function copyToClipboard(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setError("Could not copy to clipboard. You can still manually select the URL and copy it.");
    }
  }

  function handleImport(value: string) {
    setError(null);
    const ok = onImport(value);
    if (!ok) {
      setError("That link doesn't look like a valid Plan-it share URL.");
      return;
    }
    setImportValue("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share / Import"
      description="Share your current schedule as a single URL, or import someone else’s plan by pasting their link."
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={onReset}>
            Reset to blank slate
          </Button>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        {/* Share */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">Share your schedule</div>
              <p className="mt-0.5 text-xs text-zinc-600">Anyone with the link can import your plan.</p>
            </div>
            <Badge variant={copied === "share" ? "success" : "neutral"}>
              {copied === "share" ? "Copied" : "URL"}
            </Badge>
          </div>

          <div className="mt-3 grid gap-2">
            <Label>Share link</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly />
              <Button variant="secondary" onClick={() => copyToClipboard(shareUrl, "share")}>
                Copy
              </Button>
            </div>
          </div>
        </Card>

        {/* Import */}
        <Card className="p-4">
          <div className="text-sm font-semibold">Import a schedule</div>
          <p className="mt-0.5 text-xs text-zinc-600">Paste a Plan-it share link to load it into your workspace.</p>

          <div className="mt-3 grid gap-2">
            <Label>Link</Label>
            <div className="flex gap-2">
              <Input
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                placeholder="https://…/planner?s=…"
              />
              <Button onClick={() => handleImport(importValue)} disabled={!importValue.trim()}>
                Import
              </Button>
            </div>
          </div>
        </Card>

        {/* Demo */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">Demo link (Ivanka’s current courses)</div>
              <p className="mt-0.5 text-xs text-zinc-600">UMass CS template moved into a shareable URL.</p>
            </div>
            <Badge variant={copied === "demo" ? "success" : "info"}>
              {copied === "demo" ? "Copied" : "Demo"}
            </Badge>
          </div>

          <div className="mt-3 grid gap-2">
            <Label>Demo share link</Label>
            <div className="flex gap-2">
              <Input value={demoUrl} readOnly />
              <Button variant="secondary" onClick={() => copyToClipboard(demoUrl, "demo")}>
                Copy
              </Button>
              <Button onClick={() => handleImport(demoUrl)}>Load</Button>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
