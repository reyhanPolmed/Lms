"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { LoadingState } from "@/components/ui/loading-state";
import {
  useProfileQuery,
  useProfileUpdateMutation
} from "@/hooks/use-lms-data";

export default function ProfilePage() {
  const profileQuery = useProfileQuery();
  const updateMutation = useProfileUpdateMutation();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  if (profileQuery.isLoading) {
    return <LoadingState label="Memuat profil..." />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {profileQuery.error instanceof Error ? profileQuery.error.message : "Profil tidak ditemukan"}
      </div>
    );
  }

  const profile = profileQuery.data;

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await updateMutation.mutateAsync({
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        bio: String(formData.get("bio") ?? "")
      });
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil");
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { changePassword } = await import("@/lib/auth-client");
      const { data, error } = await changePassword({
        newPassword: passwordForm.newPassword,
        currentPassword: passwordForm.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message || "Gagal mengganti password");
      }

      toast.success("Password berhasil diubah");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Gagal mengganti password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section className="surface-card p-6 sm:p-7">
        <p className="eyebrow">Profil mahasiswa</p>
        <h1 className="section-title mt-2">Informasi akun mahasiswa</h1>

        <form className="mt-8 space-y-4" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama</span>
              <input
                className="w-full rounded-2xl text-xs border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                defaultValue={profile.fullName}
                name="fullName"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-2xl text-xs border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                defaultValue={profile.email}
                name="email"
                required
                type="email"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">No. Telepon</span>
              <input
                className="w-full rounded-2xl text-xs border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                defaultValue={profile.phone ?? ""}
                name="phone"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">NIM</span>
              <input
                className="w-full rounded-2xl text-xs border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                defaultValue={profile.nisn ?? "-"}
                disabled
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Bio</span>
            <textarea
              className="min-h-32 w-full text-xs rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
              defaultValue={profile.bio ?? ""}
              maxLength={500}
              name="bio"
            />
          </label>

          <button
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            disabled={updateMutation.isPending}
            type="submit"
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan profil"}
          </button>
        </form>
      </section>

      <section className="surface-card p-6 sm:p-7">
        <p className="eyebrow">Keamanan akun</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Ganti password</h2>

        <form className="mt-8 space-y-4" onSubmit={handlePasswordSubmit}>
          {[
            ["currentPassword", "Password saat ini"],
            ["newPassword", "Password baru"],
            ["confirmPassword", "Konfirmasi password baru"]
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                minLength={field === "currentPassword" ? 1 : 8}
                onChange={(event) =>
                  setPasswordForm((current) => ({
                    ...current,
                    [field]: event.target.value
                  }))
                }
                required
                type="password"
                value={passwordForm[field as keyof typeof passwordForm]}
              />
            </label>
          ))}

          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
            disabled={isChangingPassword}
            type="submit"
          >
            {isChangingPassword ? "Memproses..." : "Ubah password"}
          </button>
        </form>
      </section>
    </div>
  );
}
