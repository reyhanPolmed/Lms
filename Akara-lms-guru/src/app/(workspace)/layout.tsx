import type { ReactNode } from "react";

import { WorkspaceShell } from "@/components/workspace/shell";
import { ToastProvider } from "@/components/workspace/toast";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </ToastProvider>
  );
}
