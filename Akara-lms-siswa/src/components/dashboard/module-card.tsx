import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ModuleSummary } from "@/lib/types";

export function ModuleCard({ module }: { module: ModuleSummary }) {
  return (
    <Link className="surface-card block overflow-hidden transition hover:-translate-y-1" href={`/modules/${module.id}`}>
      <div
        className="relative overflow-hidden px-6 py-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${module.accent} 0%, #081225 84%)`
        }}
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full border border-white/10" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{module.bannerLabel}</p>
          <h3 className="mt-4 font-heading text-2xl font-semibold">{module.title}</h3>
          <p className="mt-2 text-sm text-white/75">{module.teacherName}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Progress</span>
          <span>{module.completionRate}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-950"
            style={{ width: `${module.completionRate}%` }}
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {module.totalItems} item belajar. Berikutnya: {module.nextItemTitle}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-ocean">
          Buka detail
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
