"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, ClipboardCheck, FileCheck2, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { SectionCard } from "@/components/dashboard/section-card";

type QuickAction = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const actions: QuickAction[] = [
  {
    href: "/modules",
    label: "Kelola Konten",
    description: "Buka modul aktif dan lanjutkan authoring.",
    icon: FileText,
  },
  {
    href: "/review-kuis",
    label: "Review Kuis",
    description: "Periksa attempt terbaru yang menunggu keputusan.",
    icon: FileCheck2,
  },
  {
    href: "/review-tugas",
    label: "Review Tugas",
    description: "Selesaikan penilaian tugas dan feedback dosen.",
    icon: ClipboardCheck,
  },
  {
    href: "/progress",
    label: "Progres Mahasiswa",
    description: "Lihat kelas yang memerlukan perhatian khusus.",
    icon: Users,
  },
];

export function QuickActions() {
  return (
    <SectionCard
      title="Aksi cepat"
      description="Akses workflow utama dosen tanpa harus berpindah terlalu jauh."
      variant="accent"
      padding="compact"
    >
      <div className="grid gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04 }}
            >
              <Link
                href={action.href}
                className="group flex items-start gap-3 rounded-[18px] border border-[rgba(90,97,214,0.12)] bg-[rgba(255,255,255,0.84)] px-3.5 py-3 transition hover:border-[rgba(90,97,214,0.24)] hover:bg-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--page-ink)]">
                    {action.label}
                    <ArrowRight className="h-4 w-4 text-[var(--muted-ink)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                  </span>
                  <span className="mt-1 block text-[13px] leading-5 text-[var(--muted-ink)]">
                    {action.description}
                  </span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </SectionCard>
  );
}
