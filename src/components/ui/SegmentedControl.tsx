"use client";
import React from "react";
import { cn } from "@/utils/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Hide the label below md and keep only the icon. */
  hideLabelOnMobile?: boolean;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentOption<T>[];
  ariaLabel: string;
}

/**
 * A pill toggle for mutually exclusive views/modes (e.g. 2D/3D). Built on real
 * <button>s with aria-pressed so it stays keyboard- and screen-reader-friendly.
 */
export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex items-center bg-canvas p-1 rounded-control shrink-0">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center px-3 md:px-4 py-1.5 rounded-control text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              active ? "bg-surface-raised shadow-soft text-brand" : "text-ink-muted hover:text-ink"
            )}
          >
            {opt.icon && <span className={opt.hideLabelOnMobile ? "md:mr-2" : "mr-2"}>{opt.icon}</span>}
            <span className={opt.hideLabelOnMobile ? "hidden md:inline" : ""}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
