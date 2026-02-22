import "./globals.css";
import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  title: "Plan-it",
  description: "Prerequisite-aware semester planner and course mapping workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set initial theme ASAP to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {\n  try {\n    const t = localStorage.getItem('planit_theme');\n    if (t === 'dark') document.documentElement.classList.add('dark');\n  } catch {}\n})();`,
          }}
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
