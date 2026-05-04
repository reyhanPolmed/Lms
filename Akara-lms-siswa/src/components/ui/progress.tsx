import { cn } from "@/lib/utils";

export function Progress({
  className,
  value
}: {
  className?: string;
  value: number;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-slate-200", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
