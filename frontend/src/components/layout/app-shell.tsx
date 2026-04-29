"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LoadingState } from "@/components/ui/loading-state";
import { useProfileQuery } from "@/hooks/use-lms-data";
import { isUnauthorizedError } from "@/lib/api/http";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profileQuery = useProfileQuery();

  useEffect(() => {
    if (isUnauthorizedError(profileQuery.error)) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, profileQuery.error, router]);

  if (profileQuery.isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <LoadingState label="Memeriksa sesi login..." />
      </div>
    );
  }

  if (isUnauthorizedError(profileQuery.error)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <LoadingState label="Mengalihkan ke halaman login..." />
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="surface-card p-6 text-sm text-rose-600">
          {profileQuery.error instanceof Error
            ? profileQuery.error.message
            : "Gagal memuat sesi pengguna"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <Sidebar />
      <div className="min-h-screen lg:pl-64">
        <Topbar profile={profileQuery.data} />
        <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
