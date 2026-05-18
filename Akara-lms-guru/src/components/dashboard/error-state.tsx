import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message: string;
  className?: string;
};

export function ErrorState({
  title = "Data belum dapat dimuat",
  message,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[18px] border border-[rgba(190,18,60,0.18)] bg-[var(--danger-soft)] px-4 py-4 text-sm leading-6 text-[var(--danger)]",
        className
      )}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5">{message}</p>
      </div>
    </div>
  );
}
