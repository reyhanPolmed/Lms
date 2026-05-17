"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ProgressRow } from "@/lib/api-client";
import { buildClassCards, normalizeProgressRows } from "./progress-view-models";

export default function StudentProgressPage() {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    teacherApi
      .getStudentProgress()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  const classCards = useMemo(
    () => buildClassCards(normalizeProgressRows(rows)),
    [rows]
  );

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Progres Siswa"
        description="Mulai dari kelas terlebih dahulu. Pilih kelas untuk membuka daftar siswa yang perlu dipantau."
      />

      <Surface title="Daftar Kelas">
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat data kelas...</p>
        ) : error ? (
          <p className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[12px] text-[#ba4b64]">
            {error}
          </p>
        ) : classCards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[14px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Belum ada data kelas untuk ditampilkan.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {classCards.map((item) => (
              <article
                key={item.className}
                className="rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[17px] font-semibold text-[#23284a]">{item.className}</p>
                    <p className="mt-1 text-[13px] text-[#71789e]">
                      {item.studentCount} siswa • {item.subjectCount} mapel aktif
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f4f2ff] px-2.5 py-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#715ed7]">
                    kelas
                  </span>
                </div>

                <Link
                  href={`/progress/class/${encodeURIComponent(item.className)}`}
                  className="mt-4 flex w-full items-center justify-center rounded-[12px] bg-[#715ed7] px-3 py-2 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(113,94,215,0.22)] transition-all hover:opacity-92"
                >
                  Lihat Siswa
                </Link>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
