"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLogoutMutation } from "@/hooks/use-lms-data";
import { ProfileDetail } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export function Topbar({ profile }: { profile: ProfileDetail }) {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logout berhasil");
      router.replace("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal logout");
    }
  };

  return (
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
          aria-label={`Profil ${profile.fullName}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#eff4ff] bg-[#ffdcc5] text-xs font-bold text-[#703800] shadow-sm"
          type="button"
        >
          {getInitials(profile.fullName)}
        </button>

        <button
          aria-label="Logout"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-[#564ffd] sm:flex"
          disabled={logoutMutation.isPending}
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
