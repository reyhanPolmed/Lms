import Link from "next/link";

import { PageHeader, Surface } from "@/components/workspace/ui";

const links = [
  { href: "/editor/lesson", label: "Editor Lesson" },
  { href: "/editor/quiz", label: "Editor Kuis" },
  { href: "/editor/task", label: "Editor Tugas" },
  { href: "/monitoring/quizzes", label: "Monitoring Kuis" },
  { href: "/progress", label: "Progres Siswa" },
];

export default function SettingsPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Settings Workspace"
        description="Halaman utilitas dan navigasi cepat ke semua workflow utama guru."
      />
      <Surface title="Shortcut Workflow">
        <div className="grid gap-2 md:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white px-3 py-3 text-[11px] font-semibold text-[#505987] hover:bg-[#f9f7ff]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Surface>
    </div>
  );
}
