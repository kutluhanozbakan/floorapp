"use client";
import React, { useRef } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { Button, IconButton, Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { X, Lock, Unlock, RotateCw } from "lucide-react";

export default function RightInspector() {
  const { rooms, updateRoom, deleteRoom, toggleRoomLock, furnitureItems, selectedItemId, updateFurniture, deleteFurniture, toggleFurnitureLock, isRightPanelOpen, setRightPanelOpen, pushHistory } = usePlannerStore();

  const selectedItem = furnitureItems.find((i) => i.id === selectedItemId);
  const selectedRoom = rooms.find((r) => r.id === selectedItemId);

  // Coalesce a field's keystrokes into one undo step: reset on focus, then the
  // first edit in that session records history once.
  const pushedThisEdit = useRef(false);
  const beginEdit = () => {
    pushedThisEdit.current = false;
  };
  const checkpoint = () => {
    if (!pushedThisEdit.current) {
      pushHistory();
      pushedThisEdit.current = true;
    }
  };
  const editRoom: typeof updateRoom = (id, data) => {
    checkpoint();
    updateRoom(id, data);
  };
  const editFurniture: typeof updateFurniture = (id, data) => {
    checkpoint();
    updateFurniture(id, data);
  };

  const lockClasses = (locked?: boolean) =>
    cn(
      "w-full flex items-center justify-center gap-2 py-2 border rounded-control text-sm font-medium transition-colors",
      locked
        ? "bg-accent/10 text-accent border-accent/25 hover:bg-accent/15"
        : "bg-canvas text-ink border-line hover:bg-surface"
    );

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
        onFocusCapture={beginEdit}
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto right-0 z-30 w-80 max-w-[85vw] bg-surface-raised border-l border-line flex flex-col md:h-full shadow-float md:shadow-soft overflow-y-auto shrink-0 transition-transform duration-300 md:transition-none ${
          isRightPanelOpen ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-line bg-surface flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm tracking-wide">Oda Özellikleri</h2>
          <span className="md:hidden">
            <IconButton label="Paneli kapat" onClick={() => setRightPanelOpen(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </span>
        </div>

        {selectedRoom && (
          <div className="p-4 space-y-4 border-b border-line">
            <Input
              label="Oda Adı"
              type="text"
              value={selectedRoom.name}
              onChange={(e) => editRoom(selectedRoom.id, { name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Konum X" unit="m" type="number" step={0.5}
                value={selectedRoom.position[0].toFixed(2)}
                onChange={(e) => editRoom(selectedRoom.id, { position: [parseFloat(e.target.value) || 0, selectedRoom.position[1], selectedRoom.position[2]] })}
              />
              <Input
                label="Konum Z" unit="m" type="number" step={0.5}
                value={selectedRoom.position[2].toFixed(2)}
                onChange={(e) => editRoom(selectedRoom.id, { position: [selectedRoom.position[0], selectedRoom.position[1], parseFloat(e.target.value) || 0] })}
              />
            </div>
            <Input
              label="Genişlik (X)" unit="m" type="number" min={1} max={50} step={0.5}
              value={selectedRoom.width.toFixed(2)}
              onChange={(e) => editRoom(selectedRoom.id, { width: parseFloat(e.target.value) || 1 })}
            />
            <Input
              label="Derinlik (Z)" unit="m" type="number" min={1} max={50} step={0.5}
              value={selectedRoom.depth.toFixed(2)}
              onChange={(e) => editRoom(selectedRoom.id, { depth: parseFloat(e.target.value) || 1 })}
            />
            <Input
              label="Duvar Yüksekliği" unit="m" type="number" min={1} max={10} step={0.1}
              value={selectedRoom.wallHeight.toFixed(2)}
              onChange={(e) => editRoom(selectedRoom.id, { wallHeight: parseFloat(e.target.value) || 1 })}
            />
            <div className="pt-1">
              <button onClick={() => toggleRoomLock(selectedRoom.id)} className={lockClasses(selectedRoom.isLocked)}>
                {selectedRoom.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {selectedRoom.isLocked ? "Kilitli (açmak için dokun)" : "Odayı Kilitle"}
              </button>
            </div>
            {rooms.length > 1 && (
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  if (confirm("Bu odayı ve içindeki tüm mobilyaları silmek istediğine emin misin?")) {
                    deleteRoom(selectedRoom.id);
                  }
                }}
              >
                Odayı Sil
              </Button>
            )}
          </div>
        )}

        <div className="p-4 border-b border-line bg-surface">
          <h2 className="font-semibold text-ink text-sm tracking-wide">Seçili Nesne</h2>
        </div>

        {selectedItem ? (
          <div className="p-4 space-y-4">
            <Input
              label="İsim"
              type="text"
              value={selectedItem.name}
              onChange={(e) => editFurniture(selectedItem.id, { name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Konum X" type="number" step={0.1}
                value={selectedItem.position[0].toFixed(2)}
                onChange={(e) => editFurniture(selectedItem.id, { position: [parseFloat(e.target.value) || 0, selectedItem.position[1], selectedItem.position[2]] })}
              />
              <Input
                label="Konum Z" type="number" step={0.1}
                value={selectedItem.position[2].toFixed(2)}
                onChange={(e) => editFurniture(selectedItem.id, { position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value) || 0] })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Dönüş Y (derece)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number" step={15} className="flex-1"
                  value={Math.round((selectedItem.rotation[1] * 180) / Math.PI)}
                  onChange={(e) => editFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], ((parseFloat(e.target.value) || 0) * Math.PI) / 180, selectedItem.rotation[2]] })}
                />
                <IconButton
                  label="45° döndür"
                  onClick={() => { pushHistory(); updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], selectedItem.rotation[1] + Math.PI / 4, selectedItem.rotation[2]] }); }}
                >
                  <RotateCw className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="block text-xs font-semibold text-ink mb-2">Boyutlar (metre)</h3>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Genişlik (X)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1}
                  className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[0].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [parseFloat(e.target.value) || 0.1, selectedItem.scale[1], selectedItem.scale[2]] })}
                />
                <Input
                  label="Yükseklik (Y)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1}
                  className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[1].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [selectedItem.scale[0], parseFloat(e.target.value) || 0.1, selectedItem.scale[2]] })}
                />
                <Input
                  label="Derinlik (Z)" labelClassName="text-[10px]" type="number" step={0.1} min={0.1}
                  className="px-2 py-1.5 text-xs"
                  value={selectedItem.scale[2].toFixed(2)}
                  onChange={(e) => editFurniture(selectedItem.id, { scale: [selectedItem.scale[0], selectedItem.scale[1], parseFloat(e.target.value) || 0.1] })}
                />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-line space-y-2">
              <button onClick={() => toggleFurnitureLock(selectedItem.id)} className={lockClasses(selectedItem.isLocked)}>
                {selectedItem.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {selectedItem.isLocked ? "Kilitli (açmak için dokun)" : "Nesneyi Kilitle"}
              </button>
              <Button variant="danger" fullWidth onClick={() => deleteFurniture(selectedItem.id)}>
                Nesneyi Sil
              </Button>
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
