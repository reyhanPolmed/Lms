import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";

export default function ProfilePage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Profil Guru"
        description="Kelola identitas guru dan mapel yang diajar."
      />

      <section className="grid min-h-0 gap-2">
        <Surface title="Profil Dasar">
          <div className="grid gap-2">
            <MiniInput label="Nama" placeholder="Emma Lee" />
            <MiniInput label="Email" placeholder="emma.lee@akara.sch.id" />
            <MiniInput label="Nomor HP" placeholder="+62..." />
            <MiniInput label="Bio Singkat" placeholder="Guru mapel Matematika & Sains" />
            <MiniInput label="Mapel yang Diajar" placeholder="Matematika, Sains" />
            <button className="mt-2 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-[10px] font-semibold text-white transition-opacity hover:opacity-90">
              Simpan Profil
            </button>
          </div>
        </Surface>
      </section>
    </div>
  );
}
