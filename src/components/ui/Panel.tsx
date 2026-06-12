import React from "react";
import { cn } from "@/utils/cn";

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  raised?: boolean;
}

/**
 * A surface container that uses the design-system surface tokens and rounded
 * panel radius. `raised` is for floating layers (popovers, menus, on-canvas
 * tools); the default sits at the panel surface level.
 */
export default function Panel({ raised, className, children, ...rest }: PanelProps) {
  return (
    <div
      className={cn(
        raised ? "bg-surface-raised shadow-float" : "bg-surface shadow-soft",
        "rounded-panel border border-line",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
