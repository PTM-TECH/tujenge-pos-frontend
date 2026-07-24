"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Send, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { MOCK_USERS } from "@/mocks/users";

const MOCKS_ENABLED = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export default function LoginPage() {
  const router = useRouter();
  const { login, redirectToDefaultRoute } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const result = await login(values.email, values.password);
      if (result.requiresOtp) {
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
        return;
      }
      redirectToDefaultRoute();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setServerError("Incorrect email or password. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="card w-full max-w-sm p-8">
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
        <Send className="h-5 w-5 text-brand-600" />
      </div>

      <h1 className="text-xl font-bold text-navy-900">Welcome back</h1>
      <p className="mt-1 text-sm text-navy-400">Sign in to your TujengePOS dashboard</p>

      {serverError && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-50 p-3 text-sm text-danger-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="label-caps">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-navy-300 hover:text-navy-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Continue →
        </Button>
      </form>

      {MOCKS_ENABLED && (
        <div className="mt-6 rounded-xl border border-dashed border-navy-200 p-3 text-xs text-navy-400">
          <p className="mb-1.5 font-semibold text-navy-500">Demo accounts (mock API active)</p>
          {MOCK_USERS.map((u) => (
            <p key={u.id}>
              <span className="font-medium text-navy-600">{u.role}</span> — {u.email} / {u.password}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}