"use client";

import { useEffect } from "react";
import { usePlannerStore } from "@/store/plannerStore";

// Global editor keyboard shortcuts. Mounted once near the app root. Reads the
// store via getState() inside the handler so it never goes stale and the effect
// can run with an empty dependency list.
//
//  Ctrl/Cmd+Z       undo            Ctrl/Cmd+Shift+Z / Ctrl+Y   redo
//  Ctrl/Cmd+D       duplicate       Delete / Backspace          delete
//  Arrows           nudge 0.1m      Shift+Arrows                nudge 0.5m
//  Escape           clear selection
//
// Shortcuts are ignored while typing in a form field so native editing keeps
// working there.
export default function EditorShortcuts() {
  useEffect(() => {
    const isEditable = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      const tag = node.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;

      const store = usePlannerStore.getState();
      const { selectedItemId } = store;
      const selectedFurniture = store.furnitureItems.find((i) => i.id === selectedItemId);
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (mod && key === "z") {
        e.preventDefault();
        if (e.shiftKey) store.redo();
        else store.undo();
        return;
      }
      if (mod && key === "y") {
        e.preventDefault();
        store.redo();
        return;
      }
      if (mod && key === "d") {
        if (selectedFurniture) {
          e.preventDefault();
          store.duplicateFurniture(selectedFurniture.id);
        }
        return;
      }

      if (e.key === "Escape") {
        store.selectFurniture(null);
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedFurniture) {
        e.preventDefault();
        store.deleteFurniture(selectedFurniture.id);
        return;
      }

      // Arrow-key nudging of the selected furniture.
      if (selectedFurniture && !mod) {
        const step = e.shiftKey ? 0.5 : 0.1;
        let dx = 0;
        let dz = 0;
        if (e.key === "ArrowLeft") dx = -step;
        else if (e.key === "ArrowRight") dx = step;
        else if (e.key === "ArrowUp") dz = -step;
        else if (e.key === "ArrowDown") dz = step;
        else return;

        e.preventDefault();
        store.nudgeFurniture(selectedFurniture.id, dx, dz);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
