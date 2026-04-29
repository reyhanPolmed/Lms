import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-950 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 bg-white text-slate-700",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-rose-100 text-rose-800"
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
