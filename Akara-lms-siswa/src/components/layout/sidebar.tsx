"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Gauge,
  GraduationCap,
  HelpCircle,
  Library,
  Settings
} from "lucide-react";

import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/modules", label: "Modul Saya", icon: GraduationCap },
  { href: "/schedule", label: "Jadwal", icon: CalendarDays },
  { href: "/library", label: "Pustaka", icon: BookOpen },
];

const footerNavItems = [
  { href: "/dashboard", label: "Bantuan", icon: HelpCircle },
  { href: "/profile", label: "Profil & Pengaturan", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col border-r border-slate-200/80 bg-white/92 px-5 py-5 shadow-[0_14px_42px_-38px_rgba(15,23,42,0.24)] backdrop-blur lg:flex">
      <Link className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3" href="/dashboard">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
          A
        </div>
        <div className="min-w-0 leading-none">
          <p className="font-heading text-lg font-semibold tracking-[-0.03em] text-slate-950">
            Akara LMS
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Portal belajar siswa</p>
        </div>
      </Link>

      <div className="mt-8 px-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigasi utama
        </p>
      </div>

      <nav className="mt-3 flex flex-1 flex-col gap-1.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.6)]"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
              href={item.href}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-3">
        <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Akun
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          {footerNavItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white text-slate-950 shadow-[0_12px_24px_-22px_rgba(15,23,42,0.34)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
