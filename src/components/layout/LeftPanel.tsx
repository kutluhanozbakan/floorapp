"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { generateId } from "@/utils/ids";
import { FurnitureType } from "@/types/planner";
import { CATALOG, CATEGORIES, CATALOG_BY_TYPE, defaultYForAdd, type CatalogItem } from "@/utils/catalog";
import { X, Search, Plus } from "lucide-react";

const RECENTS_KEY = "floorapp_recent_furniture";
const trLower = (s: string) => s.toLocaleLowerCase("tr");

export default function LeftPanel() {
  const { addFurniture, isLeftPanelOpen, setLeftPanelOpen, addRoom, rooms } = usePlannerStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tümü");
  const [recents, setRecents] = useState<FurnitureType[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setRecents(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const handleAdd = (item: CatalogItem) => {
    addFurniture({
      id: generateId(),
      roomId: rooms[0]?.id,
      type: item.type,
      name: item.name,
      position: [0, defaultYForAdd(item.type, item.scale), 0],
      rotation: [0, 0, 0],
      scale: item.scale,
    });

    // Track recents (most-recent first, max 6).
    setRecents((prev) => {
      const next = [item.type, ...prev.filter((t) => t !== item.type)].slice(0, 6);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    setLeftPanelOpen(false);
  };

  const handleAddRoom = () => {
    addRoom({
      id: generateId(),
      name: `Oda ${rooms.length + 1}`,
      position: [rooms.length * 6, 0, 0],
      width: 5,
      depth: 4,
      wallHeight: 2.8,
      wallThickness: 0.2,
    });
    setLeftPanelOpen(false);
  };

  const q = trLower(query.trim());
  const filtered = useMemo(
    () =>
      CATALOG.filter((item) => {
        if (category !== "Tümü" && item.category !== category) return false;
        if (q && !trLower(item.name).includes(q)) return false;
        return true;
      }),
    [q, category]
  );

  const recentItems = recents.map((t) => CATALOG_BY_TYPE[t]).filter(Boolean) as CatalogItem[];
  const showRecents = !q && category === "Tümü" && recentItems.length > 0;

  return (
    <>
      {isLeftPanelOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setLeftPanelOpen(false)} />
      )}

      <aside
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto left-0 z-30 w-64 max-w-[80vw] bg-surface-raised border-r border-line flex flex-col md:h-full shadow-float md:shadow-soft shrink-0 transition-transform duration-300 md:transition-none ${
          isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-line flex items-center justify-between shrink-0">
          <h2 className="font-semibold text-ink text-sm tracking-wide">Katalog</h2>
          <button
            onClick={() => setLeftPanelOpen(false)}
            className="md:hidden text-ink-muted hover:text-ink p-1"
            aria-label="Kataloğu kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-3 shrink-0 border-b border-line">
          <button
            onClick={handleAddRoom}
            className="w-full flex items-center justify-center gap-1.5 p-2.5 bg-brand/10 text-brand hover:bg-brand/15 border border-brand/20 rounded-control transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Yeni Oda Ekle
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Koltuk, masa, lavabo ara…"
              className="w-full pl-8 pr-3 py-2 bg-canvas border border-line rounded-control text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-1">
            {["Tümü", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === c ? "bg-brand text-white" : "bg-canvas text-ink-muted hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 space-y-4 overflow-y-auto">
          {showRecents && (
            <div>
              <p className="text-xs font-medium text-ink-muted mb-2">Son kullanılanlar</p>
              <div className="grid grid-cols-2 gap-2">
                {recentItems.map((item) => (
                  <CatalogButton key={`recent-${item.type}`} item={item} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          )}

          <div>
            {showRecents && <p className="text-xs font-medium text-ink-muted mb-2">Tümü</p>}
            {filtered.length === 0 ? (
              <p className="text-xs text-ink-muted text-center py-6">Sonuç bulunamadı</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filtered.map((item) => (
                  <CatalogButton key={item.type} item={item} onAdd={handleAdd} />
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function CatalogButton({ item, onAdd }: { item: CatalogItem; onAdd: (i: CatalogItem) => void }) {
  return (
    <button
      onClick={() => onAdd(item)}
      className="flex flex-col items-center justify-center p-3 border border-line rounded-control hover:bg-brand/10 hover:border-brand/40 active:bg-brand/15 transition-colors group"
    >
      <div className="text-ink-muted group-hover:text-brand transition-colors mb-2">{item.icon}</div>
      <span className="text-xs font-medium text-ink text-center leading-tight">{item.name}</span>
    </button>
  );
}
