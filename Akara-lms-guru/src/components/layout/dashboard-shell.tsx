"use client";

import { CheckCircle2, Loader2, LogOut, PanelLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppIcon, IconBadge } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isIntegrityCheckPage = pathname.includes("/integrity-check");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const openLogoutModal = () => {
    setMobileSidebarOpen(false);
    setShowLogoutModal(true);
  };

  return (
    <main className="min-h-screen h-dvh overflow-hidden bg-[var(--page-bg)] text-[var(--page-ink)]">
      <div
        className={cn(
          "grid h-full min-h-0",
          isIntegrityCheckPage ? "grid-cols-1" : "xl:grid-cols-[200px_minmax(0,1fr)]"
        )}
      >
        {!isIntegrityCheckPage ? (
          <aside className="hidden min-h-0 shrink-0 xl:sticky xl:top-0 xl:flex xl:h-dvh">
            <AppSidebar pathname={pathname} onLogout={openLogoutModal} />
          </aside>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
            <div
              className={cn(
                "w-full min-w-0",
                isIntegrityCheckPage
                  ? "px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4 xl:px-4"
                  : "px-3 py-3 sm:px-4 sm:py-4 lg:px-3 lg:py-4 xl:px-2"
              )}
            >
              {!isIntegrityCheckPage ? (
                <div className="mb-3 flex xl:hidden">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(true)}
                    aria-label="Buka navigasi"
                  >
                    <AppIcon icon={PanelLeft} size="sm" />
                  </Button>
                </div>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={!isIntegrityCheckPage && mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[min(88vw,20rem)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigasi Dosen Hub</SheetTitle>
            <SheetDescription>Menu utama untuk berpindah halaman workspace dosen.</SheetDescription>
          </SheetHeader>
          <AppSidebar
            pathname={pathname}
            onLogout={openLogoutModal}
            onNavigate={() => setMobileSidebarOpen(false)}
            mobile
          />
        </SheetContent>
      </Sheet>

      <Dialog
        open={showLogoutModal}
        onOpenChange={(open) => {
          if (!isLoggingOut || !logoutSuccess) {
            setShowLogoutModal(open);
          }
        }}
      >
        <DialogContent>
          {logoutSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <IconBadge icon={CheckCircle2} size="lg" tone="success" className="h-16 w-16 rounded-full" />
              <DialogHeader className="mt-5 items-center text-center">
                <DialogTitle>Berhasil logout</DialogTitle>
                <DialogDescription>
                  Sesi Anda sudah ditutup. Workspace akan diarahkan ke halaman login.
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : (
            <>
              <IconBadge icon={LogOut} size="lg" tone="danger" className="h-14 w-14 rounded-full" />
              <DialogHeader className="mt-4">
                <DialogTitle>Keluar dari Dosen Hub?</DialogTitle>
                <DialogDescription>
                  Anda akan keluar dari sesi kerja saat ini dan perlu login kembali untuk membuka dashboard dosen.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogoutConfirm}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? <AppIcon icon={Loader2} size="sm" className="animate-spin" /> : null}
                  Ya, keluar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
