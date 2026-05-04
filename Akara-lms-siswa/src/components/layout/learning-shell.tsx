"use client";

import { usePathname } from "next/navigation";

import { ProtectedShell } from "@/components/layout/protected-shell";

function shouldShowLearningSidebar(pathname: string) {
  if (pathname === "/modules") {
    return true;
  }

  return /^\/modules\/[^/]+$/.test(pathname);
}

export function LearningShell({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <ProtectedShell
      mainClassName="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 xl:px-12"
      showSidebar={shouldShowLearningSidebar(pathname)}
    >
      {children}
    </ProtectedShell>
  );
}
