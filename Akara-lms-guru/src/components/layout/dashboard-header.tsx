"use client";

import { CalendarDays, PanelLeft } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  onOpenSidebar: () => void;
};

export function DashboardHeader({ onOpenSidebar }: DashboardHeaderProps) {
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(244,247,251,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="xl:hidden"
            onClick={onOpenSidebar}
            aria-label="Buka navigasi"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.74)] px-3.5 py-1.5 text-[13px] text-[var(--muted-ink)] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
            <span className="capitalize">{todayLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
