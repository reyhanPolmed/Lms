import { LearningShell } from "@/components/layout/learning-shell";

export default function LearningLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LearningShell>{children}</LearningShell>
  );
}
