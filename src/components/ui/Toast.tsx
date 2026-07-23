"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useUiStore, type ToastVariant } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const variantConfig: Record<ToastVariant, { icon: typeof Info; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-success-500/30 text-success-600" },
  error: { icon: XCircle, classes: "border-danger-500/30 text-danger-600" },
  warning: { icon: AlertTriangle, classes: "border-warning-500/30 text-warning-600" },
  info: { icon: Info, classes: "border-info-500/30 text-info-600" },
};

function ToastCard({
  id,
  title,
  description,
  variant,
}: {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}) {
  const dismissToast = useUiStore((s) => s.dismissToast);
  const { icon: Icon, classes } = variantConfig[variant];

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, dismissToast]);

  return (
    <div
      role="status"
      className={cn(
        "animate-slide-up flex w-80 items-start gap-3 rounded-xl border bg-white p-4 shadow-popover",
        classes
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy-900">{title}</p>
        {description && <p className="mt-0.5 text-xs text-navy-500">{description}</p>}
      </div>
      <button
        onClick={() => dismissToast(id)}
        aria-label="Dismiss notification"
        className="text-navy-300 hover:text-navy-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} {...toast} />
      ))}
    </div>
  );
}