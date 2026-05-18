import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ModuleSummary } from "@/lib/types";

export function ModuleCard({ module }: { module: ModuleSummary }) {
  return (
    <Link
      className="surface-card block overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_24px_58px_-46px_rgba(15,23,42,0.28)]"
      href={`/modules/${module.id}`}
    >
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${module.accent ?? "#155DFC"} 0%, rgba(15,23,42,0.94) 100%)`
        }}
      />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">{module.bannerLabel ?? module.department}</p>
            <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
              {module.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{module.teacherName ?? "Pengajar belum tersedia"}</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700">
            {module.completionRate ?? 0}%
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Departemen</p>
            <p className="mt-2 font-medium text-slate-800">{module.department}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Item belajar</p>
            <p className="mt-2 font-medium text-slate-800">{module.totalItems ?? 0}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Progress modul</span>
            <span>{module.completionRate ?? 0}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900"
              style={{ width: `${module.completionRate ?? 0}%` }}
            />
          </div>
        </div>

        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-600">
          Lanjutkan dari {module.nextItemTitle ?? "item berikutnya"}.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          Buka detail modul
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
