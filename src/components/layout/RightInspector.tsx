"use client";
import React, { useRef, useState } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { IconButton, Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { X, Lock, Unlock, RotateCw, Copy, Trash2, ChevronDown, Check } from "lucide-react";
import { DEFAULT_WALL_COLOR } from "@/components/planner/Walls";

export default function RightInspector() {
  const {
    rooms, updateRoom, deleteRoom, toggleRoomLock,
    furnitureItems, selectedItemId, updateFurniture, deleteFurniture, duplicateFurniture, toggleFurnitureLock,
    isRightPanelOpen, setRightPanelOpen, pushHistory,
  } = usePlannerStore();

  const selectedItem = furnitureItems.find((i) => i.id === selectedItemId);
  const selectedRoom = rooms.find((r) => r.id === selectedItemId);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Coalesce a field's keystrokes into one undo step.
  const pushedThisEdit = useRef(false);
  const beginEdit = () => { pushedThisEdit.current = false; };
  const checkpoint = () => {
    if (!pushedThisEdit.current) { pushHistory(); pushedThisEdit.current = true; }
  };
  const editRoom: typeof updateRoom = (id, data) => { checkpoint(); updateRoom(id, data); };
  const editFurniture: typeof updateFurniture = (id, data) => { checkpoint(); updateFurniture(id, data); };

  const title = selectedRoom ? "Oda" : selectedItem ? "Nesne" : "Özellikler";

  return (
    <>
      {isRightPanelOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setRightPanelOpen(false)} />
      )}

      <aside
        onFocusCapture={beginEdit}
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto right-0 z-30 w-80 max-w-[85vw] bg-surface-raised border-l border-line flex flex-col md:h-full shadow-float md:shadow-soft overflow-y-auto shrink-0 transition-transform duration-300 md:transition-none ${
          isRightPanelOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-line bg-surface flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-ink text-sm tracking-wide">{title}</h2>
          <span className="md:hidden">
            <IconButton label="Paneli kapat" onClick={() => setRightPanelOpen(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </span>
        </div>

        {/* ROOM */}
        {selectedRoom && (
          <div className="p-4 space-y-4">
            {/* Quick actions */}
            <div className="flex items-center gap-1">
              <IconButton
                label={selectedRoom.isLocked ? "Kilidi aç" : "Kilitle"}
                variant={selectedRoom.isLocked ? "primary" : "ghost"}
                onClick={() => toggleRoomLock(selectedRoom.id)}
              >
                {selectedRoom.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </IconButton>
              {rooms.length > 1 && (
                <IconButton
                  label="Odayı sil"
                  variant="danger"
                  onClick={() => {
                    if (confirm("Bu odayı ve içindeki tüm mobilyaları silmek istediğine emin misin?")) deleteRoom(selectedRoom.id);
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </IconButton>
              )}
            </div>

            {/* Basic */}
            <Input label="Oda Adı" type="text" value={selectedRoom.name}
              onChange={(e) => editRoom(selectedRoom.id, { name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Genişlik (X)" unit="m" type="number" min={1} max={50} step={0.5}
                value={selectedRoom.width.toFixed(2)}
                onChange={(e) => editRoom(selectedRoom.id, { width: parseFloat(e.target.value) || 1 })} />
              <Input label="Derinlik (Z)" unit="m" type="number" min={1} max={50} step={0.5}
                value={selectedRoom.depth.toFixed(2)}
                onChange={(e) => editRoom(selectedRoom.id, { depth: parseFloat(e.target.value) || 1 })} />
            </div>
            <Input label="Duvar Yüksekliği" unit="m" type="number" min={1} max={10} step={0.1}
              value={selectedRoom.wallHeight.toFixed(2)}
              onChange={(e) => editRoom(selectedRoom.id, { wallHeight: parseFloat(e.target.value) || 1 })} />

            <WallColorField
              value={selectedRoom.wallColor ?? DEFAULT_WALL_COLOR}
              onPick={(color) => editRoom(selectedRoom.id, { wallColor: color })}
            />

            {/* Advanced */}
            <Collapsible open={advancedOpen} onToggle={() => setAdvancedOpen((v) => !v)} label="Gelişmiş">
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Input label="Konum X" unit="m" type="number" step={0.5}
                  value={selectedRoom.position[0].toFixed(2)}
                  onChange={(e) => editRoom(selectedRoom.id, { position: [parseFloat(e.target.value) || 0, selectedRoom.position[1], selectedRoom.position[2]] })} />
                <Input label="Konum Z" unit="m" type="number" step={0.5}
                  value={selectedRoom.position[2].toFixed(2)}
                  onChange={(e) => editRoom(selectedRoom.id, { position: [selectedRoom.position[0], selectedRoom.position[1], parseFloat(e.target.value) || 0] })} />
              </div>
            </Collapsible>
          </div>
        )}

        {/* FURNITURE */}
        {!selectedRoom && selectedItem && (
          <div className="p-4 space-y-4">
            {/* Quick actions */}
            <div className="flex items-center gap-1">
              <IconButton label="45° döndür" onClick={() => { pushHistory(); updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], selectedItem.rotation[1] + Math.PI / 4, selectedItem.rotation[2]] }); }} disabled={selectedItem.isLocked}>
                <RotateCw className="w-5 h-5" />
              </IconButton>
              <IconButton label="Çoğalt" onClick={() => duplicateFurniture(selectedItem.id)}>
                <Copy className="w-5 h-5" />
              </IconButton>
              <IconButton
                label={selectedItem.isLocked ? "Kilidi aç" : "Kilitle"}
                variant={selectedItem.isLocked ? "primary" : "ghost"}
                onClick={() => toggleFurnitureLock(selectedItem.id)}
              >
                {selectedItem.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </IconButton>
              <IconButton label="Sil" variant="danger" onClick={() => deleteFurniture(selectedItem.id)}>
                <Trash2 className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Basic */}
            <Input label="İsim" type="text" value={selectedItem.name}
              onChange={(e) => editFurniture(selectedItem.id, { name: e.target.value })} />

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Dönüş Y (derece)</label>
              <Input type="number" step={15}
                value={Math.round((selectedItem.rotation[1] * 180) / Math.PI)}
                onChange={(e) => editFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], ((parseFloat(e.target.value) || 0) * Math.PI) / 180, selectedItem.rotation[2]] })} />
            </div>

            <div>
              <h3 className="block text-xs font-semibold text-ink mb-2">Boyutlar (metre)</h3>
              <div className="grid grid-cols-3 gap-2">
                <Input label="Gen. (X)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1} className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[0].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [parseFloat(e.target.value) || 0.1, selectedItem.scale[1], selectedItem.scale[2]] })} />
                <Input label="Yük. (Y)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1} className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[1].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [selectedItem.scale[0], parseFloat(e.target.value) || 0.1, selectedItem.scale[2]] })} />
                <Input label="Der. (Z)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1} className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[2].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [selectedItem.scale[0], selectedItem.scale[1], parseFloat(e.target.value) || 0.1] })} />
              </div>
            </div>

            {/* Advanced */}
            <Collapsible open={advancedOpen} onToggle={() => setAdvancedOpen((v) => !v)} label="Gelişmiş — hassas konum">
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Input label="Konum X" unit="m" type="number" step={0.1}
                  value={selectedItem.position[0].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { position: [parseFloat(e.target.value) || 0, selectedItem.position[1], selectedItem.position[2]] })} />
                <Input label="Konum Z" unit="m" type="number" step={0.1}
                  value={selectedItem.position[2].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value) || 0] })} />
              </div>
            </Collapsible>
          </div>
        )}

        {/* EMPTY STATE — project summary */}
        {!selectedRoom && !selectedItem && (
          <div className="p-6 space-y-4">
            <div className="rounded-panel border border-line bg-canvas p-4">
              <p className="text-xs font-medium text-ink-muted mb-2">Proje özeti</p>
              <div className="flex gap-4">
                <Summary value={rooms.length} label="Oda" />
                <Summary value={furnitureItems.length} label="Nesne" />
              </div>
            </div>
            <p className="text-sm text-ink-muted text-center leading-relaxed">
              Düzenlemek için bir oda ya da nesne seç. Kataloğdan ekle, sürükleyerek
              yerleştir; <span className="text-ink">Çoğalt</span>, döndür ve kilitle.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function Summary({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-ink tabular-nums">{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  );
}

// Curated "Calm Spatial Studio" wall tones + a custom picker.
const WALL_SWATCHES = [
  DEFAULT_WALL_COLOR, // warm white
  "#e6ddcd", // kum
  "#dfe6df", // adaçayı sis
  "#d7e2e8", // buz mavisi
  "#ece0dd", // pudra
  "#cdd6cb", // yeşil gri
  "#c9b8a5", // taupe
  "#aeb7ab", // koyu adaçayı
  "#b9c7d0", // mavi gri
  "#5b6b60", // koyu vurgu
];

function WallColorField({ value, onPick }: { value: string; onPick: (color: string) => void }) {
  const current = value.toLowerCase();
  const isPreset = WALL_SWATCHES.some((c) => c.toLowerCase() === current);
  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted mb-2">Duvar Rengi</label>
      <div className="flex flex-wrap gap-2">
        {WALL_SWATCHES.map((color) => {
          const selected = color.toLowerCase() === current;
          return (
            <button
              key={color}
              type="button"
              onClick={() => onPick(color)}
              aria-label={`Duvar rengi ${color}`}
              aria-pressed={selected}
              title={color}
              className={cn(
                "relative w-7 h-7 rounded-full border border-line/70 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                selected && "ring-2 ring-brand ring-offset-2 ring-offset-surface-raised"
              )}
              style={{ backgroundColor: color }}
            >
              {selected && (
                <Check className="absolute inset-0 m-auto w-3.5 h-3.5 text-ink/70" strokeWidth={3} />
              )}
            </button>
          );
        })}

        {/* Custom colour picker */}
        <label
          title="Özel renk"
          className={cn(
            "relative w-7 h-7 rounded-full border border-line/70 cursor-pointer overflow-hidden transition-transform hover:scale-110",
            !isPreset && "ring-2 ring-brand ring-offset-2 ring-offset-surface-raised"
          )}
          style={{
            background: isPreset
              ? "conic-gradient(from 0deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)"
              : value,
          }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onPick(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Özel duvar rengi seç"
          />
        </label>
      </div>
    </div>
  );
}

function Collapsible({
  open, onToggle, label, children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line pt-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
      >
        {label}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}
