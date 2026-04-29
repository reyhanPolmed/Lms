"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLoginMutation } from "@/hooks/use-lms-data";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await loginMutation.mutateAsync({ email: email.trim(), password: password.trim() });
      toast.success("Login berhasil");
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.push(nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal login");
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f6f3ed] px-5 py-10 text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(8,18,37,0.05)_0,transparent_35%),radial-gradient(circle_at_50%_0,rgba(247,181,0,0.14),transparent_28%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-px w-[min(520px,calc(100vw-48px))] -translate-x-1/2 bg-slate-950/10"
      />

      <section className="relative w-full max-w-sm">
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Akara LMS</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.04em]">Masuk</h1>
        </div>

        <div className="rounded-[2rem] border border-slate-950/10 bg-[#fffdf8]/95 p-6 shadow-[0_28px_80px_-56px_rgba(8,18,37,0.45)] backdrop-blur-xl sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-950/10 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-950/10 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                type="password"
                value={password}
              />
            </label>

            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              disabled={loginMutation.isPending || !email.trim() || !password.trim()}
              type="submit"
            >
              {loginMutation.isPending ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
