"use client";

import { useEffect } from "react";
import { usePlannerStore } from "@/store/plannerStore";

// Global keyboard shortcuts for undo/redo. Mounted once near the app root.
// Skips when the user is typing in a form field so native text undo keeps
// working there.
export default function HistoryShortcuts() {
  const { undo, redo } = usePlannerStore();

  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      const tag = node.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || isEditable(e.target)) return;

      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === "y") {
        // Windows-style redo.
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return null;
}
