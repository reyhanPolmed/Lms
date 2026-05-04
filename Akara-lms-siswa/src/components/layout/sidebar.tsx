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
  { href: "/modules", label: "My Courses", icon: GraduationCap },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/library", label: "Resource Library", icon: BookOpen },
];

const footerNavItems = [
  { href: "/dashboard", label: "Support", icon: HelpCircle },
  { href: "/profile", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-[#c7c4d9] bg-white px-6 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] lg:flex">
      <Link className="flex items-center gap-3 pl-1" href="/dashboard">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#564ffd] text-sm font-bold text-white">
          E
        </div>
        <div className="leading-none">
          <p className="font-heading text-xl font-bold text-[#564ffd]">EduRefine</p>
          <p className="mt-1 text-xs font-semibold text-[#464556]">Premium Learning</p>
        </div>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href) && item.label !== "Schedule";

          return (
            <Link
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition",
                active
                  ? "border-l-4 border-[#564ffd] bg-indigo-50 text-[#564ffd]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              )}
              href={item.href}
            >
              <Icon className="h-4 w-4" fill={active ? "currentColor" : "none"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#c7c4d9] pt-6">
        <div className="flex flex-col gap-2">
          {footerNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
