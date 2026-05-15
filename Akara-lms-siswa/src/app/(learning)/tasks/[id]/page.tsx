"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/ui/loading-state";
import { useTaskDetailQuery } from "@/hooks/use-lms-data";
import { getModuleItemIdentity } from "@/lib/learning-routes";

export default function TaskLegacyRedirectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const taskQuery = useTaskDetailQuery(id);

  useEffect(() => {
    if (!taskQuery.data) {
      return;
    }

    const nextHref = taskQuery.data.sidebar.find(
      (item) => getModuleItemIdentity(item) === getModuleItemIdentity({ id: taskQuery.data.id, type: "task" })
    )?.href;
    if (nextHref) {
      router.replace(nextHref);
    }
  }, [taskQuery.data, router]);

  if (taskQuery.isError) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {taskQuery.error instanceof Error ? taskQuery.error.message : "Tugas tidak ditemukan"}
      </div>
    );
  }

  return <LoadingState label="Mengalihkan ke halaman tugas baru..." />;
}
