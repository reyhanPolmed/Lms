"use client";

import { Bell, LogOut, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

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
      <header className="sticky top-0 z-40 flex min-h-[56px] items-center justify-between border-b border-[#c7c4d9] bg-white/80 px-5 py-3 backdrop-blur-md sm:px-8">
        <label className="relative block w-full max-w-[390px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-full border-0 bg-[#eff4ff] pl-10 pr-4 text-sm text-[#0b1c30] outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Search courses, resources..."
            type="search"
          />
        </label>

        <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-4">
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-indigo-50 hover:text-[#564ffd]"
            type="button"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#ba1a1a]" />
          </button>

          <button
            aria-label={`Profil ${profile?.fullName || 'Student'}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#eff4ff] bg-[#ffdcc5] text-xs font-bold text-[#703800] shadow-sm"
            type="button"
          >
            {getInitials(profile?.fullName || "Siswa")}
          </button>

          <button
            aria-label="Logout"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-[#564ffd] sm:flex"
            onClick={() => setShowLogoutModal(true)}
            type="button"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <LogOut className="h-6 w-6 text-red-500 ml-1" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">Konfirmasi Keluar</h3>
            <p className="mb-6 text-sm text-slate-500">
              Apakah Anda yakin ingin keluar dari aplikasi Akara LMS?
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                className="flex flex-1 items-center justify-center rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={handleLogoutConfirm}
              >
                {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ya, Keluar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
