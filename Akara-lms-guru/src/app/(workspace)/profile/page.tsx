"use client";

import { useEffect, useState } from "react";
import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { BookOpen, Loader2, Mail, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/workspace/toast";
import { Button } from "@/components/ui/button";
import { teacherApi, type DashboardData } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { toast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    teacherApi.getDashboard().then(setData).catch(console.error);
  }, []);

  const initials = data?.teacher?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "T";

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua field password harus diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true
      });

      if (error) {
        throw new Error(error.message || "Gagal mengubah password.");
      }

      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat mengganti password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="Profil Guru"
        description="Lihat informasi profil Anda dan kelola keamanan akun."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <Surface title="Informasi Profil">
          <div className="flex h-full flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[24px] border border-[rgba(79,70,199,0.14)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
              <span className="text-[28px] font-semibold">{initials}</span>
            </div>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--page-ink)]">
              {data?.teacher?.name || "Memuat..."}
            </h3>
            <p className="mb-5 mt-2 rounded-full border border-[rgba(79,70,199,0.14)] bg-[var(--accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              {data?.teacher?.department || "Guru"}
            </p>
            
            <div className="w-full space-y-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] p-5 text-left text-sm text-[var(--muted-ink)]">
              <div className="flex items-center gap-4 border-b border-[var(--line)] pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">NIP</p>
                  <p className="font-semibold text-[var(--page-ink)]">{data?.teacher?.nip || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Mata Pelajaran</p>
                  <p className="font-semibold text-[var(--page-ink)]">{data?.teacher?.department || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <Surface 
          title="Keamanan & Password"
          action={<ShieldCheck className="h-5 w-5 text-[var(--accent)]" />}
        >
          <div className="flex h-full flex-col p-1">
            <div className="mb-4 rounded-[16px] border border-[rgba(245,158,11,0.18)] bg-[var(--warning-soft)] px-4 py-3 text-[var(--warning)]">
              <p className="text-[12px] leading-6">
                Untuk menjaga keamanan akun Anda, pastikan password baru memiliki minimal 8 karakter, kombinasi angka, dan huruf kapital.
              </p>
            </div>

            <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto no-scrollbar">
              <MiniInput 
                label="Password Lama" 
                placeholder="Masukkan password lama" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <MiniInput 
                label="Password Baru" 
                placeholder="Masukkan password baru" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <MiniInput 
                label="Konfirmasi Password Baru" 
                placeholder="Ulangi password baru" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="mt-4 flex shrink-0 justify-end">
              <Button 
                type="button"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isChangingPassword ? "Memproses..." : "Ganti Password"}
              </Button>
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
