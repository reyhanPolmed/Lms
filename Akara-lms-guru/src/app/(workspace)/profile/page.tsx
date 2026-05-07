"use client";

import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { Mail, Phone, BookOpen, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/workspace/toast";

export default function ProfilePage() {
  const { toast } = useToast();

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-3">
      <PageHeader
        title="Profil Guru"
        description="Lihat informasi profil Anda dan kelola keamanan akun."
      />

      <section className="grid min-h-0 gap-4 md:grid-cols-2">
        
        {/* Left Column: Preview Profile */}
        <Surface title="Informasi Profil">
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-[#765df5] to-[#a89bf8] text-white shadow-xl ring-4 ring-[#f0edff]">
              <span className="text-[40px] font-bold">EL</span>
            </div>
            <h3 className="text-[22px] font-extrabold text-[#2b325b]">Emma Lee</h3>
            <p className="mb-6 mt-1 rounded-full bg-[#f0edff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6d5dfc]">Guru Matematika & Sains</p>
            
            <div className="w-full space-y-4 rounded-[16px] border border-[rgba(113,94,215,0.08)] bg-[#faf9ff] p-5 text-[12px] text-[#4e5378] shadow-sm">
              <div className="flex items-center gap-4 border-b border-[rgba(113,94,215,0.08)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white shadow-sm border border-[rgba(113,94,215,0.05)]">
                  <Mail className="h-4 w-4 text-[#715ed7]" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#a5aecf] mb-0.5">Email</p>
                  <p className="font-bold text-[#2b325b]">emma.lee@akara.sch.id</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-[rgba(113,94,215,0.08)] pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white shadow-sm border border-[rgba(113,94,215,0.05)]">
                  <Phone className="h-4 w-4 text-[#715ed7]" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#a5aecf] mb-0.5">Nomor HP</p>
                  <p className="font-bold text-[#2b325b]">+62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white shadow-sm border border-[rgba(113,94,215,0.05)]">
                  <BookOpen className="h-4 w-4 text-[#715ed7]" />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#a5aecf] mb-0.5">Mata Pelajaran</p>
                  <p className="font-bold text-[#2b325b]">Matematika, Sains</p>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        {/* Right Column: Keamanan & Password */}
        <Surface 
          title="Keamanan & Password"
          action={<ShieldCheck className="h-5 w-5 text-[#8a92ba]" />}
        >
          <div className="flex h-full flex-col p-2">
            <div className="mb-6 rounded-[12px] border border-[#f0b16b]/30 bg-[#fff8ef] p-4 text-[#c1782c]">
              <p className="text-[11px] font-medium leading-relaxed">
                Untuk menjaga keamanan akun Anda, pastikan password baru memiliki minimal 8 karakter, kombinasi angka, dan huruf kapital.
              </p>
            </div>

            <div className="grid gap-4">
              <MiniInput label="Password Lama" placeholder="Masukkan password lama" type="password" />
              <MiniInput label="Password Baru" placeholder="Masukkan password baru" type="password" />
              <MiniInput label="Konfirmasi Password Baru" placeholder="Ulangi password baru" type="password" />
            </div>
            
            <div className="mt-auto flex justify-end pt-8">
              <button 
                onClick={() => toast.success("Password berhasil diubah")}
                className="cursor-pointer rounded-[10px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-6 py-2.5 text-[11px] font-bold tracking-wide text-white transition-all hover:opacity-90 hover:shadow-[0_4px_12px_rgba(113,94,215,0.25)] active:scale-[0.98]"
              >
                Ganti Password
              </button>
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
