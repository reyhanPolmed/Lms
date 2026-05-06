"use client";

import {
  Archive,
  Bell,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navGroups = [
  [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/modules", label: "Mata Pelajaran", icon: Archive },
    { href: "/reviews", label: "Review", icon: FileCheck2 },
    { href: "/monitoring/quizzes", label: "Monitoring Kuis", icon: ClipboardList },
    { href: "/progress", label: "Progres Siswa", icon: Users },
  ],
  [
    { href: "/notifications", label: "Inbox", icon: Bell },
    { href: "/profile", label: "Profil", icon: User },
    { href: "/", label: "Keluar", icon: LogOut },
  ],
];

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="h-dvh overflow-hidden px-2 py-2 text-[var(--page-ink)] lg:px-3 lg:py-3">
      <div className="mx-auto grid h-full min-h-0 max-w-[1800px] gap-2 rounded-[28px] border border-[rgba(113,94,215,0.12)] bg-white/60 p-2 shadow-[0_24px_80px_rgba(101,91,199,0.16)] xl:grid-cols-[138px_minmax(0,1fr)] 2xl:grid-cols-[148px_minmax(0,1fr)]">
        <aside className="panel-surface hidden h-full overflow-hidden rounded-[24px] px-2.5 py-4 xl:flex xl:flex-col">
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#aaa3ff] via-[#7b68f6] to-[#6d5dfc] shadow-[0_14px_30px_rgba(109,93,252,.32)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b85b4]">
              Akara LMS
            </p>
            <p className="text-[13px] font-semibold text-[#2c325b]">Teacher Hub</p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between">
            {navGroups.map((group, idx) => (
              <nav key={idx} className={idx === 0 ? "space-y-1 text-[11px]" : "space-y-1 text-[11px]"}>
                {group.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 transition",
                        active
                          ? "bg-[#f0edff] text-[#6d5dfc] shadow-[0_8px_18px_rgba(109,93,252,.08)]"
                          : "text-[#73799e] hover:bg-[#f7f5ff]",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            ))}
          </div>

        </aside>

        <section className="panel-surface min-h-0 overflow-auto rounded-[24px] bg-[#fbfaff] p-2.5">
          {children}
        </section>
      </div>
    </main>
  );
}
