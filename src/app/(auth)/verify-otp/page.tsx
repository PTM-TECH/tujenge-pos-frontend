"use client";

import { useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import { Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";

const CODE_LENGTH = 6;
const MOCKS_ENABLED = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { verifyOtp, redirectToDefaultRoute } = useAuth();
  const showToast = useUiStore((s) => s.showToast);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;

  function updateDigit(index: number, value: string) {
    const char = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      return next;
    });
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete) return;
    setServerError(null);
    setSubmitting(true);
    try {
      await verifyOtp(code);
      redirectToDefaultRoute();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setServerError("That code didn't work. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleResend() {
    showToast({ title: "Verification code resent", variant: "success" });
  }

  return (
    <div className="card w-full max-w-sm p-8">
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-success-50">
        <Lock className="h-5 w-5 text-success-600" />
      </div>

      <h1 className="text-xl font-bold text-navy-900">Two-Factor Auth</h1>
      <p className="mt-1 text-sm text-navy-400">
        Enter the 6-digit code sent to{" "}
        {email ? <span className="font-semibold text-navy-600">{email}</span> : "your email"}
      </p>

      {serverError && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-50 p-3 text-sm text-danger-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="label-caps mb-2 block">Verification Code</label>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              className="h-12 w-12 rounded-xl border border-navy-200 text-center text-lg font-semibold text-navy-900 transition-colors focus:border-brand-500"
            />
          ))}
        </div>

        <Button type="submit" className="mt-6 w-full" size="lg" disabled={!isComplete} isLoading={isSubmitting}>
          Verify &amp; Sign In
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Link href="/login" className="font-semibold text-navy-400 hover:text-navy-600">
          ← Back
        </Link>
        <button onClick={handleResend} className="font-semibold text-brand-600 hover:text-brand-700">
          Resend code
        </button>
      </div>

      {MOCKS_ENABLED && (
        <p className="mt-6 text-center text-xs text-navy-300">Demo: enter any code to continue</p>
      )}
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}