import { ProtectedShell } from "@/components/layout/protected-shell";

export default function LearningLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedShell
      mainClassName="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 xl:px-12"
      showSidebar={false}
    >
      {children}
    </ProtectedShell>
  );
}
