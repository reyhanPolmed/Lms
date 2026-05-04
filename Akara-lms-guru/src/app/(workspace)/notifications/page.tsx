import { Bolt } from "lucide-react";
import Link from "next/link";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { notifications } from "@/lib/teacher-mocks";

export default function NotificationsPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Notifikasi / Inbox Kerja Guru"
        description="Satu inbox kerja untuk submission baru, deadline, revisi, dan alert performa kuis."
      />
      <Surface title="Inbox Aktivitas">
        <div className="space-y-2">
          {notifications.map((item) => (
            <article
              key={item.id}
              className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-[#2b325b]">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-[#6f759a]">{item.description}</p>
                  <p className="mt-1 text-[9px] text-[#8791bc]">{item.time}</p>
                </div>
                <Bolt className="h-4 w-4 text-[#6d5dfc]" />
              </div>
              <div className="mt-2">
                <Link href="/reviews" className="rounded-[8px] border border-[#bdb6f6] px-2 py-1 text-[9.5px] text-[#5b6191]">
                  {item.action}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
