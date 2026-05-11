import type { ReactNode } from "react";
import "./globals.css";

/**
 * Root layout: passes through to `[locale]` (which owns `<html>` / `<body>`).
 * Required so a root `not-found.tsx` can render a full document when needed.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
