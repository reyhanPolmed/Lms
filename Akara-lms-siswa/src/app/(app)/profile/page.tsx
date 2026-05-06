"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { LoadingState } from "@/components/ui/loading-state";
import {
  usePasswordChangeMutation,
  useProfileQuery,
  useProfileUpdateMutation
} from "@/hooks/use-lms-data";

export default function ProfilePage() {
  const profileQuery = useProfileQuery();
  const updateMutation = useProfileUpdateMutation();
  const passwordMutation = usePasswordChangeMutation();

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

    try {
      await passwordMutation.mutateAsync(passwordForm);
      toast.success("Password berhasil diubah");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengganti password");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <section className="surface-card p-8">
        <p className="eyebrow">Profile</p>
        <h1 className="section-title mt-2">Informasi akun siswa</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Data profil diambil dari backend dan perubahan dikirim ke endpoint profil siswa.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nama</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
                defaultValue={profile.fullName}
                name="fullName"
                required
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
                defaultValue={profile.phone ?? ""}
                name="phone"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">NISN</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                defaultValue={profile.nisn ?? "-"}
                disabled
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Bio</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
              defaultValue={profile.bio ?? ""}
              maxLength={500}
              name="bio"
            />
          </label>

          <button
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            disabled={updateMutation.isPending}
            type="submit"
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan profil"}
          </button>
        </form>
      </section>

      <section className="surface-card p-8">
        <p className="eyebrow">Security</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">Ganti password</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Perubahan password akan divalidasi dan diproses langsung oleh backend.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handlePasswordSubmit}>
          {[
            ["currentPassword", "Password saat ini"],
            ["newPassword", "Password baru"],
            ["confirmPassword", "Konfirmasi password baru"]
          ].map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
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
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
            disabled={passwordMutation.isPending}
            type="submit"
          >
            {passwordMutation.isPending ? "Memproses..." : "Ubah password"}
          </button>
        </form>
      </section>
    </div>
  );
}
