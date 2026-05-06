"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, ClipboardList, FolderOpen, Play, SquarePen } from "lucide-react";

import { LoadingState } from "@/components/ui/loading-state";
import { useDashboardQuery } from "@/hooks/use-lms-data";

const moduleImages = [
  "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
];

const categoryLabels = ["Design", "Engineering", "Data"];

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardQuery();

  if (isLoading) {
    return <LoadingState label="Memuat dashboard siswa..." />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-sm text-rose-600">
        {error instanceof Error ? error.message : "Gagal memuat dashboard"}
      </div>
    );
  }

  const firstName = data.user.fullName.split(" ").filter(Boolean)[0] ?? "Siswa";
  const pendingTasks = data.upcomingTasks.length;
  const stats = [
    {
      label: "Enrolled Courses",
      value: data.modules.length,
      icon: BookOpen,
      iconWrap: "bg-[#e2dfff] text-[#564ffd]"
    },
    {
      label: "Active Quizzes",
      value: data.upcomingQuizzes.length,
      icon: SquarePen,
      iconWrap: "bg-[#e8f8ee] text-[#007c3f]"
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      icon: ClipboardList,
      iconWrap: "bg-[#fff4ec] text-[#fd9c4c]"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2 pt-2">
        <h1 className="font-heading text-[28px] font-bold leading-tight text-[#0b1c30]">
          Welcome back, {firstName}!
        </h1>
        <p className="text-base leading-7 text-[#464556]">
          Here&apos;s a quick overview of your learning progress today.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-5 rounded-xl border border-[#c7c4d9] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition hover:border-[#c2c1ff]"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${item.iconWrap}`}>
                <Icon className="h-6 w-6" fill="currentColor" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm text-[#464556]">{item.label}</p>
                <p className="mt-1 font-heading text-[28px] font-bold leading-none text-[#0b1c30]">{item.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-[#0b1c30]">Daftar Jurusan</h2>
          <Link
            className="flex items-center gap-1 text-xs font-bold text-[#564ffd] transition hover:text-[#3b2fe5]"
            href="/modules"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.modules.map((module, index) => {
            const image = moduleImages[index % moduleImages.length];
            const category = categoryLabels[index % categoryLabels.length];

            return (
              <article
                key={module.id}
                className="group flex min-h-[292px] flex-col overflow-hidden rounded-xl border border-[#c7c4d9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-40 overflow-hidden bg-[#eff4ff]">
                  <Image
                    alt={module.title}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1280px) 352px, (min-width: 768px) 50vw, 100vw"
                    src={image}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3">
                    <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#564ffd]">
                      {category}
                    </span>
                  </div>

                  <h3 className="line-clamp-1 font-heading text-xl font-semibold text-[#0b1c30]">{module.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#464556]">
                    {module.department} bersama {module.teacher}. Lanjutkan dari {module.nextItemTitle}.
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-[#e5eeff] pt-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#464556]">
                      <FolderOpen className="h-4 w-4" />
                      {module.totalItems} Modules
                    </div>

                    <Link
                      aria-label={`Buka ${module.title}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#564ffd] text-white shadow-sm transition hover:bg-[#3b2fe5]"
                      href={`/modules/${module.id}`}
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
