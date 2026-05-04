import Link from "next/link";
import type { ReactNode } from "react";

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
    <header className="panel-surface rounded-[18px] px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-[1.05] text-[#1f2548]">{title}</h1>
          <p className="mt-1 text-[11px] text-[#6f759a]">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="rounded-[10px] border border-[#6d5dfc]/50 bg-white px-3 py-2 text-[11px] font-semibold text-[#6d5dfc]"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </header>
  );
}

export function Surface({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel-surface min-h-0 overflow-hidden rounded-[18px] bg-white p-3.5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[16px] text-[#23284a]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Badge({ status }: { status: string }) {
  const toneMap: Record<string, string> = {
    draft: "bg-[#fff1d8] text-[#e69a2a]",
    published: "bg-[#e5f8ee] text-[#39b16a]",
    scheduled: "bg-[#e8f3ff] text-[#5896df]",
    archived: "bg-[#eceef4] text-[#70789c]",
    submitted: "bg-[#e7f1ff] text-[#488de2]",
    revision: "bg-[#fff1d8] text-[#e69a2a]",
    approved: "bg-[#e5f8ee] text-[#39b16a]",
    late: "bg-[#ffe9ef] text-[#ea5570]",
    rendah: "bg-[#e5f8ee] text-[#39b16a]",
    sedang: "bg-[#fff1d8] text-[#e69a2a]",
    tinggi: "bg-[#ffe9ef] text-[#ea5570]",
  };

  return (
    <span
      className={`rounded-md px-2 py-1 text-[9px] font-semibold ${toneMap[status] ?? "bg-[#eceef4] text-[#70789c]"}`}
    >
      {status}
    </span>
  );
}

export function MiniInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
      />
    </label>
  );
}
