"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    // Always resolve to the same success state regardless of whether the
    // email exists — never reveal account existence through this form.
    try {
      await forgotPassword(values.email);
    } finally {
      setSubmittedEmail(values.email);
    }
  }

  if (submittedEmail) {
    return (
      <div className="card w-full max-w-sm p-8 text-center">
        <div className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-success-50">
          <MailCheck className="h-5 w-5 text-success-600" />
        </div>
        <h1 className="text-xl font-bold text-navy-900">Check your email</h1>
        <p className="mt-1 text-sm text-navy-400">
          If an account exists for <span className="font-semibold text-navy-600">{submittedEmail}</span>,
          we&apos;ve sent a verification code to reset your password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-sm p-8">
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
        <Send className="h-5 w-5 text-brand-600" />
      </div>

      <h1 className="text-xl font-bold text-navy-900">Reset Password</h1>
      <p className="mt-1 text-sm text-navy-400">We&apos;ll send a verification code to your email</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Send Reset Code
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-4 block text-center text-sm font-semibold text-navy-400 hover:text-navy-600"
      >
        ← Back to Sign In
      </Link>
    </div>
  );
}