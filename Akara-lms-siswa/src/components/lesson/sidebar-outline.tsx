"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  List,
  Lock,
  PlayCircle,
  SquarePen
} from "lucide-react";

import { SidebarEntry } from "@/lib/types";
import { getModuleItemIdentity } from "@/lib/learning-routes";
import { cn } from "@/lib/utils";

const typeMeta: Record<
  SidebarEntry["type"],
  {
    icon: typeof BookOpen;
    label: string;
  }
> = {
  lesson: { icon: BookOpen, label: "Text" },
  quiz: { icon: SquarePen, label: "Kuis" },
  task: { icon: List, label: "Tugas" },
  assignment: { icon: List, label: "Tugas" },
  material: { icon: BookOpen, label: "Materi" }
};

export function SidebarOutline({
  items,
  activeItemKey
}: {
  items: SidebarEntry[];
  activeItemKey: string;
}) {
  const groupedItems = items.reduce<Array<{ chapter: string; items: SidebarEntry[] }>>((acc, item) => {
    const currentGroup = acc[acc.length - 1];
    if (currentGroup && currentGroup.chapter === item.chapter) {
      currentGroup.items.push(item);
      return acc;
    }

    acc.push({ chapter: item.chapter, items: [item] });
    return acc;
  }, []);
  const activeBab = groupedItems.find((group) =>
    group.items.some((item) => getModuleItemIdentity(item) === activeItemKey)
  )?.chapter;
  const [openBab, setOpenBab] = useState<string | null>(activeBab ?? groupedItems[0]?.chapter ?? null);

  useEffect(() => {
    if (activeBab) {
      setOpenBab(activeBab);
    }
  }, [activeBab]);

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4">
        <div>
          <p className="eyebrow">Outline modul</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">Daftar materi</h3>
        </div>
        <List className="h-5 w-5 text-slate-400" />
      </div>

      {groupedItems.length === 0 ? (
        <div className="p-5 text-sm text-slate-500">Belum ada outline dari backend.</div>
      ) : (
        <div className="flex flex-col">
          {groupedItems.map((group, index) => {
            const expanded = openBab === group.chapter;
            // Use chapter + index as key to ensure uniqueness even if chapters repeat
            const groupKey = `${group.chapter}-${index}`;

            return (
              <div key={groupKey} className="border-b border-slate-100 last:border-0">
                <button
                  className="flex w-full items-center justify-between bg-white px-5 py-4 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  onClick={() => setOpenBab((current) => (current === group.chapter ? null : group.chapter))}
                  type="button"
                >
                  <span>{group.chapter}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded ? (
                  <div className="bg-slate-50/70">
                    {group.items.map((item, itemIndex) => (
                      <OutlineItem
                        activeItemKey={activeItemKey}
                        index={itemIndex}
                        item={item}
                        key={getModuleItemIdentity(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="px-5 pb-4 text-xs text-slate-400">Klik dropdown untuk buka isi bab.</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function OutlineItem({
  item,
  index,
  activeItemKey
}: {
  item: SidebarEntry;
  index: number;
  activeItemKey: string;
}) {
  const selected = getModuleItemIdentity(item) === activeItemKey;
  const meta = typeMeta[item.type];
  const MetaIcon = meta.icon;
  const stateIcon = item.isCompleted ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  ) : selected ? (
    <PlayCircle className="h-5 w-5 text-slate-900" />
  ) : (
    <Circle className="h-5 w-5 text-slate-400" />
  );
  const content = (
    <>
      {stateIcon}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            item.isCompleted
              ? "text-slate-500 line-through"
              : selected
                ? "text-slate-950"
                : "text-slate-700"
          )}
        >
          {index + 1}. {item.title}
        </p>
        <p className={cn("mt-0.5 flex items-center gap-1 text-xs", selected ? "text-slate-700" : "text-slate-500")}>
          <MetaIcon className="h-3.5 w-3.5" />
          {meta.label}
        </p>
        {item.isCompleted ? (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Complete
          </p>
        ) : null}
      </div>
      {item.isLocked ? <Lock className="h-4 w-4 text-slate-400" /> : null}
    </>
  );

  const className = cn(
    "flex items-center gap-3 border-l-2 px-5 py-3 pl-8 transition",
    selected ? "border-slate-900 bg-white" : "border-transparent hover:bg-white/80",
    item.isLocked ? "cursor-not-allowed opacity-60" : ""
  );

  if (item.isLocked) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link className={className} href={item.href}>
      {content}
    </Link>
  );
}
