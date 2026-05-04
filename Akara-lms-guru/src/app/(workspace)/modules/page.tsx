import { Layers3 } from "lucide-react";
import Link from "next/link";

import { Badge, MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { modules } from "@/lib/teacher-mocks";

export default function ModulesPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Daftar Modul / Mata Pelajaran"
        description="Daftar modul yang didaftarkan admin dan dapat dilengkapi kontennya oleh guru."
      />

      <Surface title="Input & Filter Modul">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniInput label="Nama Modul" placeholder="Contoh: Matematika Inti" />
          <MiniInput label="Mata Pelajaran" placeholder="Matematika / Sains / ..." />
          <MiniInput label="Kelas Target" placeholder="Kelas 8A, 9B, dst" />
          <MiniInput label="Status" placeholder="published / scheduled" />
        </div>
      </Surface>

      <Surface title="List Modul dari Admin">
        <div className="grid min-h-0 gap-2 md:grid-cols-2 2xl:grid-cols-4">
          {modules.map((module) => (
            <article
              key={module.id}
              className="rounded-[14px] border border-[rgba(113,94,215,0.12)] bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[#2b325b]">{module.name}</p>
                <Badge status={module.status} />
              </div>
              <p className="mt-1 text-[10px] text-[#6f759a]">{module.subject} - {module.grade}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[9.5px] text-[#70769a]">
                <Metric label="Bab" value={String(module.chapters)} />
                <Metric label="Materi" value={String(module.lessons)} />
                <Metric label="Kuis" value={String(module.quizzes)} />
                <Metric label="Tugas" value={String(module.tasks)} />
              </div>
              <div className="mt-3">
                <p className="text-[9px] text-[#7e84a8]">Completion Rate {module.completionRate}%</p>
                <div className="mt-1 h-1.5 rounded-full bg-[#ece9ff]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6d5dfc] to-[#8571ff]"
                    style={{ width: `${module.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-1.5 text-[9px] font-semibold">
                <ActionButton
                  href={`/modules/${module.id}/builder`}
                  label="Detail Module"
                  icon={<Layers3 className="h-3.5 w-3.5" />}
                />
              </div>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[9px] bg-[#f8f6ff] px-2 py-1.5">
      <p className="text-[8.5px] uppercase tracking-[0.14em]">{label}</p>
      <p className="text-[11px] font-semibold text-[#4e5378]">{value}</p>
    </div>
  );
}

function ActionButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center gap-1 rounded-[8px] border border-[rgba(113,94,215,0.14)] bg-white px-2 py-1.5 text-[#5a6090]"
    >
      {icon}
      {label}
    </Link>
  );
}
