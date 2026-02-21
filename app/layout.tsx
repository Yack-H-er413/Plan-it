import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan-it (UI only)",
  description: "Hackathon planner UI mock (no logic attached).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
