"use client";

import { motion } from "framer-motion";
import {
  Archive,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AppIcon, IconBadge } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

type SidebarProps = {
  pathname: string;
  onLogout: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
};

const navGroups = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/modules", label: "Mata Pelajaran", icon: Archive },
      { href: "/review-kuis", label: "Review Kuis", icon: FileCheck2 },
      { href: "/review-tugas", label: "Review Tugas", icon: ClipboardCheck },
      { href: "/monitoring/quizzes", label: "Monitoring Kuis", icon: ClipboardList },
      { href: "/progress", label: "Progres Siswa", icon: Users },
    ],
  },
  {
    title: "Akun",
    items: [
      { href: "/profile", label: "Profil Guru", icon: User },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  onNavigate,
  onLogout,
}: Pick<SidebarProps, "pathname" | "onNavigate" | "onLogout">) {
  return (
    <div className="space-y-3">
      {navGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">
            {group.title}
          </p>
          <nav className="space-y-1" aria-label={group.title}>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-2.5 overflow-hidden rounded-2xl px-3 py-2.5 text-[13px] font-medium text-[var(--muted-ink)] transition hover:text-[var(--page-ink)]",
                    active && "text-[var(--page-ink)]"
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="teacher-sidebar-active"
                      className="absolute inset-0 rounded-2xl border border-[rgba(90,97,214,0.14)] bg-[linear-gradient(135deg,rgba(238,242,255,0.98),rgba(255,255,255,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_28px_rgba(90,97,214,0.10)]"
                    />
                  ) : null}
                  <IconBadge
                    icon={Icon}
                    size="sm"
                    tone={active ? "accent" : "ghost"}
                    className={cn(
                      "relative group-hover:border-[rgba(90,97,214,0.12)] group-hover:bg-[var(--surface-subtle)]",
                      active && "border-[rgba(90,97,214,0.14)] bg-[rgba(90,97,214,0.08)]"
                    )}
                    iconClassName={cn(active && "text-[var(--accent)]")}
                  />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="border-t border-[rgba(219,227,239,0.92)] pt-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          className="h-9 w-full justify-start gap-2.5 rounded-2xl px-3 text-[13px] text-[#b4234f] hover:bg-[var(--danger-soft)] hover:text-[#b4234f]"
        >
          <AppIcon icon={LogOut} size="sm" />
          Keluar
        </Button>
      </div>
    </div>
  );
}

export function AppSidebar({
  pathname,
  onLogout,
  onNavigate,
  mobile = false,
}: SidebarProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        mobile
          ? "bg-[var(--surface)]"
          : "border-r border-[rgba(219,227,239,0.92)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))]"
      )}
    >
      <div className="border-b border-[rgba(219,227,239,0.92)] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <IconBadge icon={GraduationCap} size="lg" tone="brand" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">
              Akara LMS
            </p>
            <p className="text-lg font-semibold tracking-[var(--tracking-tight)] text-[var(--page-ink)]">
              Teacher Hub
            </p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 px-3 py-2.5",
          mobile ? "no-scrollbar overflow-y-auto" : "overflow-hidden"
        )}
      >
        <SidebarNav pathname={pathname} onNavigate={onNavigate} onLogout={onLogout} />
      </div>
    </div>
  );
}
