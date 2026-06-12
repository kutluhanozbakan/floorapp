"use client";
import React, { useId } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Short unit/suffix shown after the label, e.g. "m". */
  unit?: string;
  labelClassName?: string;
}

/**
 * Labeled text/number input wired to the design tokens. The label is associated
 * with the field via htmlFor/id for accessibility. Number inputs inherit
 * tabular figures from globals.css for aligned measurements.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, unit, labelClassName, className, id, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className={cn("block text-xs font-medium text-ink-muted mb-1", labelClassName)}
        >
          {label}
          {unit ? <span className="text-ink-muted/70"> – {unit}</span> : null}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "w-full px-3 py-2 bg-surface-raised border border-line rounded-control text-sm text-ink",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          "disabled:opacity-50",
          className
        )}
        {...rest}
      />
    </div>
  );
});

export default Input;
