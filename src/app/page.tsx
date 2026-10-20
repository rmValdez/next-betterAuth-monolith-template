import Link from "next/link";
import {
  Shield,
  KeyRound,
  ArrowRight,
  Database,
  Layers,
  CheckCircle2,
  Cpu,
  Zap,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-6 backdrop-blur-xl md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Next.<span className="text-cyan-400">BetterAuth</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-xs md:text-sm">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" className="text-xs md:text-sm">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-medium text-cyan-300">
            <Zap className="h-3.5 w-3.5 text-cyan-400" /> Next.js 15 Monolith Auth Starter
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Full Skeletal Auth with <br />
            <span className="text-gradient">Better Auth & Prisma</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base font-normal text-slate-400 sm:text-lg">
            A clean, modular, and type-safe skeletal boilerplate for building robust web
            applications. Fully configured with session verification, credential auth, and modern UI
            tokens.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" fullWidth className="h-12 px-8 text-base">
                Try the Demo Console <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://github.com/rmValdez/next-betterAuth-monolith-template"
              target="_blank"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                fullWidth
                className="h-12 border border-slate-700 px-8 text-base"
              >
                View Source Repository
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Architectural Highlights
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Built following clean monolith patterns and modern React server component conventions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="glass-card space-y-3 rounded-2xl border border-slate-800 p-6 transition-colors hover:border-cyan-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Better Auth Engine</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Modern TypeScript-first authentication suite supporting standard email/password
              credentials, sessions, and OAuth extensibility.
            </p>
          </div>

          <div className="glass-card space-y-3 rounded-2xl border border-slate-800 p-6 transition-colors hover:border-cyan-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Prisma PostgreSQL</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Standardized schemas for Users, Accounts, Sessions, and Verifications. Integrated seed
              scripts with cryptographic password hashing.
            </p>
          </div>

          <div className="glass-card space-y-3 rounded-2xl border border-slate-800 p-6 transition-colors hover:border-cyan-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Protected Layouts</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Server-side session validation ensuring unauthenticated requests are redirected safely
              before rendering sensitive views.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 px-6 py-8 text-center text-xs text-slate-500">
        <p>Built with Next.js 15, Better Auth, Prisma, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}
