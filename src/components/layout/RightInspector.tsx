"use client";
import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { X, Lock, Unlock } from "lucide-react";

export default function RightInspector() {
  const { rooms, updateRoom, deleteRoom, toggleRoomLock, furnitureItems, selectedItemId, updateFurniture, deleteFurniture, toggleFurnitureLock, isRightPanelOpen, setRightPanelOpen } = usePlannerStore();

  const selectedItem = furnitureItems.find((i) => i.id === selectedItemId);
  const selectedRoom = rooms.find((r) => r.id === selectedItemId);

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isRightPanelOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setRightPanelOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto right-0 z-30 w-80 max-w-[85vw] bg-surface-raised border-l border-line flex flex-col md:h-full shadow-lg md:shadow-sm overflow-y-auto shrink-0 transition-transform duration-300 md:transition-none ${
          isRightPanelOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-line bg-surface flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm tracking-wide">Oda Özellikleri</h2>
          <button
            onClick={() => setRightPanelOpen(false)}
            className="md:hidden text-ink-muted hover:text-ink p-1"
            aria-label="Paneli kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {selectedRoom && (
          <div className="p-4 space-y-4 border-b border-line">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Oda Adı</label>
              <input
                type="text"
                value={selectedRoom.name}
                onChange={(e) => updateRoom(selectedRoom.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Konum X – m</label>
                <input
                  type="number"
                  value={selectedRoom.position[0].toFixed(2)}
                  onChange={(e) => updateRoom(selectedRoom.id, { position: [parseFloat(e.target.value) || 0, selectedRoom.position[1], selectedRoom.position[2]] })}
                  className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  step={0.5}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1">Konum Z – m</label>
                <input
                  type="number"
                  value={selectedRoom.position[2].toFixed(2)}
                  onChange={(e) => updateRoom(selectedRoom.id, { position: [selectedRoom.position[0], selectedRoom.position[1], parseFloat(e.target.value) || 0] })}
                  className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                  step={0.5}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Genişlik (X) – m</label>
              <input
                type="number"
                value={selectedRoom.width.toFixed(2)}
                onChange={(e) => updateRoom(selectedRoom.id, { width: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                min={1} max={50} step={0.5}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Derinlik (Z) – m</label>
              <input
                type="number"
                value={selectedRoom.depth.toFixed(2)}
                onChange={(e) => updateRoom(selectedRoom.id, { depth: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                min={1} max={50} step={0.5}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Duvar Yüksekliği</label>
              <input
                type="number"
                value={selectedRoom.wallHeight.toFixed(2)}
                onChange={(e) => updateRoom(selectedRoom.id, { wallHeight: parseFloat(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                min={1} max={10} step={0.1}
              />
            </div>
            <div className="pt-1">
              <button
                onClick={() => toggleRoomLock(selectedRoom.id)}
                className={`w-full flex items-center justify-center gap-2 py-2 border rounded text-sm font-medium transition-colors ${
                  selectedRoom.isLocked
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-canvas text-ink border-line hover:bg-canvas"
                }`}
              >
                {selectedRoom.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {selectedRoom.isLocked ? "Kilitli (açmak için dokun)" : "Odayı Kilitle"}
              </button>
            </div>
            {rooms.length > 1 && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm("Bu odayı ve içindeki tüm mobilyaları silmek istediğine emin misin?")) {
                      deleteRoom(selectedRoom.id);
                    }
                  }}
                  className="w-full py-2 bg-danger/10 text-danger hover:bg-danger/15 border border-danger/20 rounded text-sm font-medium transition-colors"
                >
                  Odayı Sil
                </button>
              </div>
            )}
          </div>
        )}

      <div className="p-4 border-b border-line bg-surface">
        <h2 className="font-semibold text-ink text-sm tracking-wide">Seçili Nesne</h2>
      </div>

      {selectedItem ? (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">İsim</label>
            <input
              type="text"
              value={selectedItem.name}
              onChange={(e) => updateFurniture(selectedItem.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Konum X</label>
              <input
                type="number"
                value={selectedItem.position[0].toFixed(2)}
                onChange={(e) => updateFurniture(selectedItem.id, { position: [parseFloat(e.target.value) || 0, selectedItem.position[1], selectedItem.position[2]] })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Konum Z</label>
              <input
                type="number"
                value={selectedItem.position[2].toFixed(2)}
                onChange={(e) => updateFurniture(selectedItem.id, { position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value) || 0] })}
                className="w-full px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                step={0.1}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Dönüş Y (derece)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={Math.round((selectedItem.rotation[1] * 180) / Math.PI)}
                onChange={(e) => updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], ((parseFloat(e.target.value) || 0) * Math.PI) / 180, selectedItem.rotation[2]] })}
                className="flex-1 px-3 py-2 border border-line rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                step={15}
              />
              <button
                onClick={() => updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], selectedItem.rotation[1] + Math.PI / 4, selectedItem.rotation[2]] })}
                className="px-3 py-2 bg-canvas hover:bg-canvas border border-line rounded text-sm font-medium transition-colors"
              >
                +45°
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="block text-xs font-semibold text-ink mb-2">Boyutlar (metre)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-ink-muted mb-1">Genişlik (X)</label>
                <input
                  type="number"
                  value={selectedItem.scale[0].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [parseFloat(e.target.value) || 0.1, selectedItem.scale[1], selectedItem.scale[2]] })}
                  className="w-full px-2 py-1.5 border border-line rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand"
                  step={0.1} min={0.1}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-ink-muted mb-1">Yükseklik (Y)</label>
                <input
                  type="number"
                  value={selectedItem.scale[1].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [selectedItem.scale[0], parseFloat(e.target.value) || 0.1, selectedItem.scale[2]] })}
                  className="w-full px-2 py-1.5 border border-line rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand"
                  step={0.1} min={0.1}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-ink-muted mb-1">Derinlik (Z)</label>
                <input
                  type="number"
                  value={selectedItem.scale[2].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [selectedItem.scale[0], selectedItem.scale[1], parseFloat(e.target.value) || 0.1] })}
                  className="w-full px-2 py-1.5 border border-line rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand"
                  step={0.1} min={0.1}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-line space-y-2">
             <button
                onClick={() => toggleFurnitureLock(selectedItem.id)}
                className={`w-full flex items-center justify-center gap-2 py-2 border rounded text-sm font-medium transition-colors ${
                  selectedItem.isLocked
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-canvas text-ink border-line hover:bg-canvas"
                }`}
              >
                {selectedItem.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {selectedItem.isLocked ? "Kilitli (açmak için dokun)" : "Nesneyi Kilitle"}
              </button>
             <button
                onClick={() => deleteFurniture(selectedItem.id)}
                className="w-full py-2 bg-danger/10 text-danger hover:bg-danger/15 border border-danger/20 rounded text-sm font-medium transition-colors"
              >
                Nesneyi Sil
              </button>
          </div>
        </div>
      ) : !selectedRoom ? (
        <div className="p-8 text-center text-ink-muted text-sm">
          Özelliklerini düzenlemek için bir oda ya da nesne seç.
        </div>
      ) : null}
      </aside>
    </>
  );
}
