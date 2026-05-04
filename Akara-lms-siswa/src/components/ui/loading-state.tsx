export function LoadingState({ label }: { label: string }) {
  return (
    <div className="surface-card p-8">
      <div className="h-2 w-28 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-6 h-10 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-4 h-24 animate-pulse rounded-3xl bg-slate-100" />
      <p className="mt-5 text-sm text-slate-500">{label}</p>
    </div>
  );
}
