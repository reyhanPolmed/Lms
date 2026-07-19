"use client";

import { Bell, Loader2, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ProfileDetail } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export function Topbar({ profile }: { profile: ProfileDetail }) {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);

    try {
      const { signOut } = await import("@/lib/auth-client");
      await signOut();

      toast.success("Berhasil logout!");
      setShowLogoutModal(false);

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Gagal logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/86 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-4">
          <div className="hidden min-w-0 lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Area mahasiswa
            </p>
            <p className="mt-1 truncate text-sm font-medium text-slate-700">
              {profile.className} | {profile.department}
            </p>
          </div>

          <label className="relative block w-full max-w-[420px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-2xl border border-slate-200/80 bg-slate-50/90 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
              placeholder="Cari mata kuliah, materi, atau pengumuman..."
              type="search"
            />
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              type="button"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <div className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 sm:flex">
              <div
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-xs font-semibold text-white"
              >
                {getInitials(profile.fullName || "Mahasiswa")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{profile.fullName}</p>
                <p className="truncate text-xs text-slate-500">{profile.email}</p>
              </div>
            </div>

            <button
              aria-label={`Profil ${profile.fullName || "Student"}`}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:hidden"
              type="button"
            >
              {getInitials(profile.fullName || "Mahasiswa")}
            </button>

            <button
              aria-label="Logout"
              className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900 sm:flex"
              onClick={() => setShowLogoutModal(true)}
              type="button"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {showLogoutModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_70px_-42px_rgba(15,23,42,0.34)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-rose-50">
              <LogOut className="ml-1 h-6 w-6 text-rose-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Konfirmasi keluar</h3>
            <p className="mb-6 text-sm leading-6 text-slate-500">
              Apakah Anda yakin ingin keluar dari aplikasi Akara LMS?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                type="button"
              >
                Batal
              </button>
              <button
                className="flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={handleLogoutConfirm}
                type="button"
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
