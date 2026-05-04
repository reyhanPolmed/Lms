import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/88 shadow-[0_18px_60px_-34px_rgba(15,23,42,0.3)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("font-heading text-lg font-semibold tracking-tight text-slate-950", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return <div className={cn("text-sm leading-6 text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
