import "./globals.css";
import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Plan-it",
  description: "Prerequisite-aware semester planner and course mapping workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <AuthProvider>{children}</AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
