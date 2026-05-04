import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";

export default function ProfilePage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Profil Guru & Preferensi"
        description="Kelola identitas guru, mapel yang diajar, preferensi notifikasi, dan template feedback default."
      />

      <section className="grid min-h-0 gap-2 xl:grid-cols-[1fr_1fr]">
        <Surface title="Profil Dasar">
          <div className="grid gap-2">
            <MiniInput label="Nama" placeholder="Emma Lee" />
            <MiniInput label="Email" placeholder="emma.lee@akara.sch.id" />
            <MiniInput label="Nomor HP" placeholder="+62..." />
            <MiniInput label="Bio Singkat" placeholder="Guru mapel Matematika & Sains" />
            <MiniInput label="Mapel yang Diajar" placeholder="Matematika, Sains" />
          </div>
        </Surface>

        <Surface title="Preferensi">
          <div className="grid gap-2">
            <MiniInput label="Template Feedback Default" placeholder="Kerja bagus, lanjutkan di bagian..." />
            <MiniInput label="Notifikasi Submission" placeholder="email + inbox" />
            <MiniInput label="Notifikasi Deadline" placeholder="inbox + reminder pagi" />
            <MiniInput label="Notifikasi Kuis Gagal Massal" placeholder="aktif" />
            <button className="mt-2 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-[10px] font-semibold text-white">
              Simpan Preferensi
            </button>
          </div>
        </Surface>
      </section>
    </div>
  );
}
