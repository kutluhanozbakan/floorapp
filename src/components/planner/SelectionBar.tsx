"use client";

import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { IconButton } from "@/components/ui";
import { RotateCw, Copy, Lock, Unlock, Trash2 } from "lucide-react";

// Bottom-centre contextual action bar shown when a furniture item is selected,
// so common edits are reachable without opening the inspector. HTML overlay
// above the canvas.
export default function SelectionBar() {
  const {
    furnitureItems,
    selectedItemId,
    updateFurniture,
    duplicateFurniture,
    toggleFurnitureLock,
    deleteFurniture,
    pushHistory,
  } = usePlannerStore();

  const item = furnitureItems.find((i) => i.id === selectedItemId);
  if (!item) return null;

  const rotate45 = () => {
    pushHistory();
    updateFurniture(item.id, {
      rotation: [item.rotation[0], item.rotation[1] + Math.PI / 4, item.rotation[2]],
    });
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-1.5 py-1 rounded-panel bg-surface-raised/95 backdrop-blur border border-line shadow-float">
      <span className="px-2 text-xs font-medium text-ink-muted max-w-32 truncate">{item.name}</span>
      <div className="w-px h-6 bg-line" />
      <IconButton label="45° döndür" tooltipSide="top" onClick={rotate45} disabled={item.isLocked}>
        <RotateCw className="w-5 h-5" />
      </IconButton>
      <IconButton label="Çoğalt" tooltipSide="top" onClick={() => duplicateFurniture(item.id)}>
        <Copy className="w-5 h-5" />
      </IconButton>
      <IconButton
        label={item.isLocked ? "Kilidi aç" : "Kilitle"}
        tooltipSide="top"
        variant={item.isLocked ? "primary" : "ghost"}
        onClick={() => toggleFurnitureLock(item.id)}
      >
        {item.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
      </IconButton>
      <div className="w-px h-6 bg-line" />
      <IconButton label="Sil" tooltipSide="top" variant="danger" onClick={() => deleteFurniture(item.id)}>
        <Trash2 className="w-5 h-5" />
      </IconButton>
    </div>
  );
}
