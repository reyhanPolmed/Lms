import type { ReactNode } from "react";

import { SectionCard } from "@/components/dashboard/section-card";

type DataTableProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DataTable({ title, description, action, children }: DataTableProps) {
  return (
    <SectionCard title={title} description={description} action={action} padding="none">
      {children}
    </SectionCard>
  );
}
