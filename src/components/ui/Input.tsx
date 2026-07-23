import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightElement, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label-caps mb-1.5 block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-navy-900",
              "placeholder:text-navy-400",
              "transition-colors focus:border-brand-500",
              error ? "border-danger-500" : "border-navy-200",
              leftIcon && "pl-10",
              rightElement && "pr-10",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-danger-500">{error}</p>}
        {!error && hint && <p className="mt-1.5 text-xs text-navy-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";