"use client";

import {
  Archive,
  Bell,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const navGroups = [
  [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/modules", label: "Mata Pelajaran", icon: Archive },
    { href: "/reviews", label: "Review Kuis", icon: FileCheck2 },
    { href: "/review-tugas", label: "Review Tugas", icon: ClipboardCheck },
    { href: "/monitoring/quizzes", label: "Monitoring Kuis", icon: ClipboardList },
    { href: "/progress", label: "Progres Siswa", icon: Users },
  ],
  [
    { href: "/profile", label: "Profil", icon: User },
    { href: "#", label: "Keluar", icon: LogOut },
  ],
];

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      const { signOut } = await import("@/lib/auth-client");
      await signOut();
      
      setLogoutSuccess(true);
      
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Logout error", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="h-dvh overflow-hidden text-[var(--page-ink)] relative">
      <div className="grid h-full min-h-0 gap-2 border border-[rgba(113,94,215,0.12)] bg-white/60 shadow-[0_24px_80px_rgba(101,91,199,0.16)] xl:grid-cols-[138px_minmax(0,1fr)] 2xl:grid-cols-[148px_minmax(0,1fr)]">
        <aside className="panel-surface hidden h-full overflow-hidden px-2.5 py-2 xl:flex xl:flex-col">
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#aaa3ff] via-[#7b68f6] to-[#6d5dfc] shadow-[0_14px_30px_rgba(109,93,252,.32)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8b85b4]">
              Akara LMS
            </p>
            <p className="text-[13px] font-semibold text-[#2c325b]">Teacher Hub</p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between">
            {navGroups.map((group, idx) => (
              <nav key={idx} className={idx === 0 ? "space-y-1 text-[11px]" : "space-y-1 text-[11px]"}>
                {group.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  
                  if (item.label === "Keluar") {
                    return (
                      <button
                        key={item.label}
                        onClick={() => setShowLogoutModal(true)}
                        className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 transition text-[#73799e] hover:bg-[#ffeef1] hover:text-[#e04562]"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 transition",
                        active
                          ? "bg-[#f0edff] text-[#6d5dfc] shadow-[0_8px_18px_rgba(109,93,252,.08)]"
                          : "text-[#73799e] hover:bg-[#f7f5ff]",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            ))}
          </div>
        </aside>

        <section className="panel-surface min-h-0 overflow-auto bg-[#fbfaff] p-0">
          {children}
        </section>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-[24px] shadow-2xl p-6 w-[90%] max-w-[400px] border border-gray-100 flex flex-col items-center text-center">
            {logoutSuccess ? (
              <div className="py-6 flex flex-col items-center animate-fade-in-up">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil Logout</h3>
                <p className="text-gray-500 text-sm">Anda telah keluar dari sesi. Mengarahkan ke menu login...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-8 h-8 text-red-500 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Keluar</h3>
                <p className="text-gray-500 text-sm mb-8">
                  Apakah Anda yakin ingin keluar dari Teacher Hub Akara LMS? Anda perlu login kembali untuk mengakses data.
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleLogoutConfirm}
                    disabled={isLoggingOut}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ya, Keluar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
