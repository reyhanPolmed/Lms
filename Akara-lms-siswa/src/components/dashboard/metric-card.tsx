import { DashboardMetric } from "@/lib/types";

const toneMap: Record<NonNullable<DashboardMetric["tone"]>, string> = {
  gold: "from-amber-100 to-amber-50 text-amber-900",
  sky: "from-blue-100 to-blue-50 text-blue-900",
  mint: "from-emerald-100 to-emerald-50 text-emerald-900",
  primary: "from-blue-100 to-blue-50 text-blue-900",
  danger: "from-rose-100 to-rose-50 text-rose-900",
  success: "from-emerald-100 to-emerald-50 text-emerald-900"
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className={`rounded-[28px] bg-gradient-to-br p-5 ${toneMap[metric.tone ?? "sky"]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">{metric.label}</p>
      <p className="mt-3 font-heading text-4xl font-semibold">{metric.value}</p>
      <p className="mt-2 text-sm opacity-80">{metric.helper}</p>
    </div>
  );
}
