import Link from "next/link";
import type { ReactNode } from "react";

import { PageTitle } from "@/components/dashboard/page-title";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <PageTitle
      eyebrow="Dosen Workspace"
      title={title}
      description={description}
      aside={
        actionHref && actionLabel ? (
          <Button asChild variant="secondary">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null
      }
    />
  );
}

export function Surface({
  title,
  description,
  action,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SectionCard title={title} description={description} action={action}>
      {children}
    </SectionCard>
  );
}

export function Badge({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}

export function MiniInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#66708f]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn("control-surface h-10 w-full px-3 text-[13px]")}
      />
    </label>
  );
}

export function MiniSelect({
  label,
  options,
  placeholder = "Semua",
  value,
  onChange,
}: {
  label: string;
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#66708f]">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className={cn("control-surface h-10 w-full px-3 text-[13px]")}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
