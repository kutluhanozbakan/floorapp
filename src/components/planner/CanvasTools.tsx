"use client";

import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { Plus, Minus, Maximize, LocateFixed, Grid3X3 } from "lucide-react";
import { cn } from "@/utils/cn";

// HTML overlay floating above the canvas. Lives outside <Canvas> and talks to
// the 3D scene through the store (grid toggle + view command bus).
export default function CanvasTools() {
  const { requestView, toggleGrid, showGrid } = usePlannerStore();

  const btn =
    "w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-canvas transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

  return (
    <>
      {/* Top-right: view toggles */}
      <div className="absolute top-3 right-3 z-10 flex flex-col rounded-panel bg-surface-raised/90 backdrop-blur border border-line shadow-float overflow-hidden">
        <button
          className={cn(btn, showGrid && "text-brand")}
          onClick={toggleGrid}
          aria-label={showGrid ? "Izgarayı gizle" : "Izgarayı göster"}
          title="Izgara"
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom-right: navigation */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col rounded-panel bg-surface-raised/90 backdrop-blur border border-line shadow-float overflow-hidden">
        <button className={btn} onClick={() => requestView("zoomIn")} aria-label="Yakınlaştır" title="Yakınlaştır">
          <Plus className="w-5 h-5" />
        </button>
        <div className="h-px bg-line" />
        <button className={btn} onClick={() => requestView("zoomOut")} aria-label="Uzaklaştır" title="Uzaklaştır">
          <Minus className="w-5 h-5" />
        </button>
        <div className="h-px bg-line" />
        <button className={btn} onClick={() => requestView("fit")} aria-label="Görünüme sığdır" title="Sığdır">
          <Maximize className="w-5 h-5" />
        </button>
        <div className="h-px bg-line" />
        <button className={btn} onClick={() => requestView("recenter")} aria-label="Merkeze al" title="Merkeze al">
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
