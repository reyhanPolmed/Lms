"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/ui/loading-state";
import { useLessonDetailQuery } from "@/hooks/use-lms-data";
import { getModuleItemIdentity } from "@/lib/learning-routes";

export default function LessonLegacyRedirectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const lessonQuery = useLessonDetailQuery(id);

  useEffect(() => {
    if (!lessonQuery.data) {
      return;
    }

    const nextHref = lessonQuery.data.sidebar.find(
      (item) => getModuleItemIdentity(item) === getModuleItemIdentity({ id: lessonQuery.data.id, type: "lesson" })
    )?.href;
    if (nextHref) {
      router.replace(nextHref);
    }
  }, [lessonQuery.data, router]);

  if (lessonQuery.isError) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {lessonQuery.error instanceof Error ? lessonQuery.error.message : "Lesson tidak ditemukan"}
      </div>
    );
  }

  return <LoadingState label="Mengalihkan ke halaman lesson baru..." />;
}
