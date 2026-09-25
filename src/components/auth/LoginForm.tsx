"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, UserPlus, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient } from "@/lib/auth-client";
import { isValidEmail } from "@/lib/utils";
import { MIN_PASSWORD_LENGTH } from "@/lib/config";
import { AUTH_SESSION_QUERY_KEY } from "@/hooks/useAuthSession";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (nextMode: "signin" | "signup") => {
    setMode(nextMode);
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsPending(true);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "User",
        });

        if (signUpError) {
          setError(signUpError.message || "Failed to create account.");
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || "Invalid credentials.");
          return;
        }
      }

      await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
      toast.success(mode === "signup" ? "Account created." : "Signed in.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          {mode === "signin"
            ? "Enter your credentials to access your account"
            : "Sign up to start using the monolith template"}
        </p>
      </div>

      <div className="mb-6 flex rounded-xl border border-slate-800 bg-slate-950/60 p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            mode === "signin"
              ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <LogIn className="h-3.5 w-3.5" /> Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
            mode === "signup"
              ? "border border-cyan-500/30 bg-cyan-500/20 text-cyan-300 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" /> Sign Up
        </button>
      </div>

      {error && (
        <div className="animate-in fade-in mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 duration-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        )}

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="operator@domain.com"
        />

        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-[30px] text-slate-400 transition-colors hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isPending} className="mt-6">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </Card>
  );
}
