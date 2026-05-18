"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileEdit, RefreshCw, Search, Users } from "lucide-react";
import { motion } from "framer-motion";

import { ActiveModulesTable } from "@/components/dashboard/active-modules-table";
import { PageTitle } from "@/components/dashboard/page-title";
import { RecentSubmissionsTable } from "@/components/dashboard/recent-submissions-table";
import { SectionCard } from "@/components/dashboard/section-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { teacherApi, type DashboardData } from "@/lib/api-client";
import { dashboardSnapshot } from "@/lib/teacher-mocks";

const KPI_DEFINITIONS = [
  {
    key: "activeModules",
    label: "Modul Aktif",
    helper: "Mata pelajaran yang sedang berjalan pada semester ini.",
    icon: BookOpen,
    tone: "indigo" as const,
  },
  {
    key: "activeClasses",
    label: "Kelas Aktif",
    helper: "Rombel yang saat ini membutuhkan monitoring rutin.",
    icon: Users,
    tone: "blue" as const,
  },
  {
    key: "draftItems",
    label: "Draft Item",
    helper: "Konten yang masih perlu diselesaikan sebelum dipublikasikan.",
    icon: FileEdit,
    tone: "amber" as const,
  },
  {
    key: "needReview",
    label: "Perlu Review",
    helper: "Attempt kuis atau tugas yang menunggu keputusan guru.",
    icon: Search,
    tone: "rose" as const,
  },
  {
    key: "pendingRevision",
    label: "Menunggu Revisi",
    helper: "Siswa yang perlu tindak lanjut berdasarkan feedback terakhir.",
    icon: RefreshCw,
    tone: "emerald" as const,
  },
] as const;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherApi
      .getDashboard()
      .then(setData)
      .catch((e: unknown) => {
        setData(dashboardSnapshot);
        setError(
          e instanceof Error
            ? `Data live belum tersedia: ${e.message}. Menampilkan snapshot sementara dashboard.`
            : "Data live belum tersedia. Menampilkan snapshot sementara dashboard."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-4 pb-3"
    >
      {loading ? (
        <SectionCard
          title="Memuat dashboard guru"
          description="Sedang mengambil ringkasan operasional pengajaran terbaru."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-[24px] border border-[var(--line)] bg-[var(--surface-subtle)]"
              />
            ))}
          </div>
        </SectionCard>
      ) : !data ? (
        <SectionCard
          title="Dashboard belum dapat dimuat"
          description="Terjadi kendala saat mengambil data teacher dashboard."
          variant="accent"
        >
          <p className="rounded-[20px] border border-[rgba(244,63,94,0.16)] bg-[var(--danger-soft)] px-4 py-4 text-sm text-[#b4234f]">
            {error}
          </p>
        </SectionCard>
      ) : (
        <>
          {error ? (
            <SectionCard
              title="Menggunakan snapshot sementara"
              description="Koneksi data live sedang bermasalah. Dashboard tetap ditampilkan agar workflow tidak terputus."
              variant="accent"
              padding="compact"
            >
              <p className="rounded-[20px] border border-[rgba(245,158,11,0.18)] bg-[var(--warning-soft)] px-4 py-4 text-sm text-[#9a5b11]">
                {error}
              </p>
            </SectionCard>
          ) : null}
          <div className="w-full">
            <PageTitle
              eyebrow="Teacher Dashboard"
              title={`Selamat datang, ${data.teacher.name}`}
              description="Pantau modul aktif, review yang menunggu tindakan, dan kondisi progres siswa dari satu dashboard yang lebih fokus dan siap dipakai harian."
              meta={[data.teacher.department, `NIP ${data.teacher.nip}`]}
            />
          </div>

          <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {KPI_DEFINITIONS.map(({ key, label, helper, icon, tone }) => (
              <StatCard
                key={key}
                label={label}
                value={data.kpi[key]}
                helper={helper}
                icon={icon}
                tone={tone}
              />
            ))}
          </section>

          <ActiveModulesTable modules={data.modules} />
          <RecentSubmissionsTable submissions={data.recentSubmissions} />
        </>
      )}
    </motion.div>
  );
}
