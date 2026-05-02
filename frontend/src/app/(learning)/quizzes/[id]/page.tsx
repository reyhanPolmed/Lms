"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/ui/loading-state";
import { useQuizDetailQuery } from "@/hooks/use-lms-data";

export default function QuizLegacyRedirectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const quizQuery = useQuizDetailQuery(id);

  useEffect(() => {
    if (!quizQuery.data) {
      return;
    }

    const nextHref = quizQuery.data.sidebar.find((item) => item.id === quizQuery.data?.id)?.href;
    if (nextHref) {
      router.replace(nextHref);
    }
  }, [quizQuery.data, router]);

  if (quizQuery.isError) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {quizQuery.error instanceof Error ? quizQuery.error.message : "Quiz tidak ditemukan"}
      </div>
    );
  }

  return <LoadingState label="Mengalihkan ke halaman quiz baru..." />;
}
