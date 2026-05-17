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
    <header className="panel-surface rounded-[18px] px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.02] tracking-[-0.03em] text-[#1b2342]">
            {title}
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-[#505978]">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="rounded-[12px] border border-[#6d5dfc]/50 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#5f52d4]"
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
    <section className="panel-surface flex h-full min-h-0 flex-col overflow-hidden rounded-[18px] bg-white p-4">
      <div className="mb-4 shrink-0 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[#1f2747]">{title}</h2>
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
    returned: "bg-[#fff1d8] text-[#e69a2a]",
    graded: "bg-[#e5f8ee] text-[#39b16a]",
    retake: "bg-[#fff1d8] text-[#e69a2a]",
    revision: "bg-[#fff1d8] text-[#e69a2a]",
    approved: "bg-[#e5f8ee] text-[#39b16a]",
    late: "bg-[#ffe9ef] text-[#ea5570]",
    rendah: "bg-[#e5f8ee] text-[#39b16a]",
    sedang: "bg-[#fff1d8] text-[#e69a2a]",
    tinggi: "bg-[#ffe9ef] text-[#ea5570]",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${toneMap[status] ?? "bg-[#eceef4] text-[#70789c]"}`}
    >
      {status}
    </span>
  );
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
      <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.16em] text-[#66708f]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white px-3.5 text-[13px] text-[#37405f] outline-none"
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
      <span className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.16em] text-[#66708f]">
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white px-3.5 text-[13px] text-[#37405f] outline-none"
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
