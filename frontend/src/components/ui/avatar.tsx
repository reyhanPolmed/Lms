import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  className,
  name
}: {
  className?: string;
  name: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
