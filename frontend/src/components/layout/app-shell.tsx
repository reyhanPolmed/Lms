"use client";

import { ProtectedShell } from "@/components/layout/protected-shell";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
