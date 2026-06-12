"use client";
import React from "react";
import { cn } from "@/utils/cn";
import Tooltip from "./Tooltip";

type Variant = "ghost" | "primary" | "danger";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: used for both the tooltip and the accessible name. */
  label: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  variant?: Variant;
}

const base =
  "inline-flex items-center justify-center w-9 h-9 rounded-control transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  ghost: "text-ink-muted hover:bg-canvas hover:text-ink active:bg-canvas",
  primary: "bg-brand text-white hover:bg-brand-strong",
  danger: "text-danger hover:bg-danger/10",
};

/**
 * Icon-only button. The label is mandatory and feeds both a visible Tooltip and
 * the aria-label, satisfying the playbook rule that standalone icons must always
 * carry an accessible name + tooltip.
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tooltipSide = "bottom", variant = "ghost", className, children, ...rest },
  ref
) {
  return (
    <Tooltip label={label} side={tooltipSide}>
      <button ref={ref} aria-label={label} className={cn(base, variants[variant], className)} {...rest}>
        {children}
      </button>
    </Tooltip>
  );
});

export default IconButton;
