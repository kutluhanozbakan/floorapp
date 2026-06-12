"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-control font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-strong active:bg-brand-strong",
  secondary: "bg-surface-raised text-ink border border-line hover:bg-canvas active:bg-canvas",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15 active:bg-danger/20",
  ghost: "text-ink-muted hover:bg-canvas hover:text-ink active:bg-canvas",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "sm", loading = false, icon, fullWidth, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
});

export default Button;
