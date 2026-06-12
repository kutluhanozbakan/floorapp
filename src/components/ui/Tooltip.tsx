"use client";
import React from "react";
import { cn } from "@/utils/cn";

type Side = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  label: string;
  side?: Side;
  children: React.ReactElement;
}

const sideClasses: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

/**
 * Lightweight tooltip. CSS-only show/hide on group hover/focus-within so it
 * works for both pointer and keyboard users without JS state. Honors
 * prefers-reduced-motion via a short, simple opacity transition.
 *
 * The trigger should be a focusable element; the tooltip text is mirrored into
 * an aria-label by callers (e.g. IconButton) so screen readers always get it.
 */
export default function Tooltip({ label, side = "bottom", children }: TooltipProps) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white shadow-float",
          "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          sideClasses[side]
        )}
      >
        {label}
      </span>
    </span>
  );
}
