import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  "due-soon": "border-amber-200 bg-amber-50 text-amber-900",
  scheduled: "border-blue-200 bg-blue-50 text-blue-900",
  revision: "border-orange-200 bg-orange-50 text-orange-900",
  locked: "border-slate-200 bg-slate-100 text-slate-600",
  complete: "border-emerald-200 bg-emerald-50 text-emerald-900",
  active: "border-brand-line bg-white text-slate-900",
  submitted: "border-blue-200 bg-blue-50 text-blue-900",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-900"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize",
        statusMap[status] ?? statusMap.active
      )}
    >
      {status.replace("-", " ")}
    </span>
  );
}
