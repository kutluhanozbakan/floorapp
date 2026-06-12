"use client";

import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { CATALOG_BY_TYPE } from "@/utils/catalog";
import { cn } from "@/utils/cn";
import { Home, Lock, Unlock } from "lucide-react";

// Hierarchical list of rooms and the furniture inside each, for quick selection
// and lock toggling — handy when items overlap or are off-screen.
export default function SceneTree() {
  const {
    rooms, furnitureItems, selectedItemId,
    selectFurniture, toggleRoomLock, toggleFurnitureLock,
  } = usePlannerStore();

  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const items = furnitureItems.filter(
          (i) => i.roomId === room.id || (!i.roomId && rooms[0]?.id === room.id)
        );
        const roomSelected = selectedItemId === room.id;

        return (
          <div key={room.id}>
            <Row
              selected={roomSelected}
              onSelect={() => selectFurniture(room.id)}
              onToggleLock={() => toggleRoomLock(room.id)}
              locked={room.isLocked}
              icon={<Home className="w-4 h-4" />}
              label={room.name}
              bold
            />
            <div className="ml-3 mt-0.5 border-l border-line pl-2 space-y-0.5">
              {items.length === 0 ? (
                <p className="text-[11px] text-ink-muted/70 py-1 pl-1">Boş</p>
              ) : (
                items.map((item) => (
                  <Row
                    key={item.id}
                    selected={selectedItemId === item.id}
                    onSelect={() => selectFurniture(item.id)}
                    onToggleLock={() => toggleFurnitureLock(item.id)}
                    locked={item.isLocked}
                    icon={<span className="text-ink-muted">{CATALOG_BY_TYPE[item.type]?.icon ?? null}</span>}
                    label={item.name}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Row({
  selected, onSelect, onToggleLock, locked, icon, label, bold,
}: {
  selected: boolean;
  onSelect: () => void;
  onToggleLock: () => void;
  locked?: boolean;
  icon: React.ReactNode;
  label: string;
  bold?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-control px-2 py-1.5 cursor-pointer transition-colors",
        selected ? "bg-brand/10 text-brand" : "text-ink hover:bg-canvas"
      )}
      onClick={onSelect}
    >
      <span className="shrink-0 [&_svg]:w-4 [&_svg]:h-4">{icon}</span>
      <span className={cn("flex-1 truncate text-xs", bold && "font-semibold")}>{label}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
        className={cn(
          "shrink-0 p-0.5 rounded transition-opacity",
          locked ? "text-accent" : "text-ink-muted opacity-0 group-hover:opacity-100 hover:text-ink"
        )}
        aria-label={locked ? "Kilidi aç" : "Kilitle"}
      >
        {locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
