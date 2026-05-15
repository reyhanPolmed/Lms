"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import backgroundLogin from "../../../backgroundlogin.png";
import { signIn } from "@/lib/auth-client";

function getLoginErrorMessage(error: unknown) {
  const fallbackMessage = "Email atau kata sandi tidak valid.";

  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  const normalizedMessage = error.message.toLowerCase();

  if (
    normalizedMessage.includes("invalid") ||
    normalizedMessage.includes("credential") ||
    normalizedMessage.includes("password") ||
    normalizedMessage.includes("email")
  ) {
    return fallbackMessage;
  }

  return "Login gagal. Coba lagi.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const { error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message || "Login gagal. Periksa kembali kredensial Anda.");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(getLoginErrorMessage(err));
      setLoading(false);
    }
  };

  const feedback = success
    ? {
        tone: "success" as const,
        icon: CheckCircle2,
        message: "Login berhasil. Anda sedang diarahkan ke dashboard.",
      }
    : error
      ? {
          tone: "error" as const,
          icon: AlertCircle,
          message: error,
        }
      : null;

  return (
    <main className="relative isolate h-full overflow-hidden bg-[#f5f0e8] text-slate-900">
      <Image
        src={backgroundLogin}
        alt="Ilustrasi kampus untuk halaman login guru"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,240,0.96)_0%,rgba(250,246,240,0.82)_30%,rgba(250,246,240,0.38)_55%,rgba(250,246,240,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.28),transparent_28%)]" />

      <div className="relative z-10 flex h-full min-h-0 items-center px-4 sm:px-8 lg:px-12">
        <div className="flex w-full min-h-0 max-w-[370px] flex-col justify-center py-[50px]">
          <div className="mb-3 flex shrink-0 items-center gap-2.5 text-slate-900">
            <div className="flex h-9 w-9 items-center justify-center rounded-[18px] border border-slate-900/10 bg-white/72 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <BookOpen className="h-4 w-4 text-slate-800" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Akara LMS Guru
              </p>
              <h1 className="text-[15px] font-semibold tracking-[-0.02em] text-slate-900">
                Portal Pengajar
              </h1>
            </div>
          </div>

          <div className="max-w-[500px] shrink-0 space-y-1">
            <p className="text-[clamp(1.2rem,2.6vw,1.7rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-slate-900">
              Kelola kelas dan materi dari satu ruang kerja.
            </p>
            <p className="max-w-[420px] text-[11px] leading-4.5 text-slate-600 sm:text-[12px]">
              Masuk untuk membuka modul, tugas, kuis, dan pemantauan progres siswa.
            </p>
          </div>

          <section className="mt-3.5 flex w-full max-w-[500px] min-h-0 shrink-0 flex-col overflow-hidden rounded-[22px] border border-white/65 bg-white/72 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-3.5">
            <div className="mb-2.5 shrink-0">
              <h2 className="text-[15px] font-semibold tracking-[-0.03em] text-slate-900">
                Masuk ke akun guru
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Gunakan email institusi yang sudah terdaftar.
              </p>
            </div>

            {feedback ? (
              <div className="mb-2.5 shrink-0" aria-live="polite">
                <div
                  className={
                    feedback.tone === "error"
                      ? "flex items-start gap-2 rounded-[18px] border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] leading-4.5 text-red-700"
                      : "flex items-start gap-2 rounded-[18px] border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[11px] leading-4.5 text-emerald-700"
                  }
                >
                  <feedback.icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="shrink-0 space-y-2.5">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="guru@akara.edu"
                    className="h-10 w-full rounded-[18px] border border-slate-200/90 bg-white/90 pl-9 pr-3 text-[12px] text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Kata sandi
                </span>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi"
                    className="h-10 w-full rounded-[18px] border border-slate-200/90 bg-white/90 pl-9 pr-3 text-[12px] text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[18px] bg-slate-900 px-4 text-[12px] font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-2.5 flex shrink-0 items-center gap-2 text-[10px] text-slate-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/5 text-slate-700">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              <p>Akses dibatasi untuk guru yang sudah diverifikasi.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
