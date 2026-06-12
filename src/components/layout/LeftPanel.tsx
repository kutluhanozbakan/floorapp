"use client";
import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { generateId } from "@/utils/ids";
import { FurnitureType } from "@/types/planner";
import {
  Armchair, Bed, Table, Box, DoorOpen, LayoutPanelTop, X,
  Tv, Library, Trees, Lightbulb, Grid3X3, Laptop,
  Bath, Droplets, Flame, Refrigerator, Archive,
  Sofa, Coffee, WashingMachine, ShowerHead, Square, CookingPot
} from "lucide-react";

export default function LeftPanel() {
  const { addFurniture, isLeftPanelOpen, setLeftPanelOpen, addRoom, rooms } = usePlannerStore();

  const handleAdd = (type: FurnitureType, name: string, scale: [number, number, number]) => {
    // Windows sit 1m off the floor by default; doors rest on the floor. Everything
    // else keeps y=0. Setting this on add (not just on drag) keeps the wall cut-out
    // at the right height immediately.
    let y = 0;
    if (type === "window" || type === "mirror") y = 1.0 + scale[1] / 2;
    else if (type === "door") y = scale[1] / 2;

    // Add to the first room or a selected room if we had a specific way.
    // Since we use global furniture items, they will render in the first room if no roomId,
    // but better to explicitly assign it to the first room or selected room.
    addFurniture({
      id: generateId(),
      roomId: rooms[0]?.id,
      type,
      name,
      position: [0, y, 0],
      rotation: [0, 0, 0],
      scale,
    });
    setLeftPanelOpen(false);
  };

  const handleAddRoom = () => {
    addRoom({
      id: generateId(),
      name: `Oda ${rooms.length + 1}`,
      position: [rooms.length * 6, 0, 0], // Offset new room to avoid exact overlap
      width: 5,
      depth: 4,
      wallHeight: 2.8,
      wallThickness: 0.2,
    });
    setLeftPanelOpen(false);
  };

  const furnitureOptions: { type: FurnitureType; name: string; icon: React.ReactNode; scale: [number, number, number] }[] = [
    { type: "sofa", name: "Koltuk", icon: <Armchair className="w-5 h-5" />, scale: [2, 0.8, 0.9] },
    { type: "table", name: "Masa", icon: <Table className="w-5 h-5" />, scale: [1.6, 0.75, 0.9] },
    { type: "wardrobe", name: "Gardırop", icon: <Box className="w-5 h-5" />, scale: [1.2, 2.2, 0.6] },
    { type: "chair", name: "Sandalye", icon: <Armchair className="w-5 h-5 scale-75" />, scale: [0.5, 0.9, 0.5] },
    { type: "bed", name: "Yatak", icon: <Bed className="w-5 h-5" />, scale: [1.6, 0.6, 2.0] },
    { type: "door", name: "Kapı", icon: <DoorOpen className="w-5 h-5" />, scale: [0.9, 2.1, 0.1] },
    { type: "window", name: "Pencere", icon: <LayoutPanelTop className="w-5 h-5" />, scale: [1.2, 1.2, 0.1] },
    { type: "tv", name: "TV", icon: <Tv className="w-5 h-5" />, scale: [1.2, 0.8, 0.1] },
    { type: "bookshelf", name: "Kitaplık", icon: <Library className="w-5 h-5" />, scale: [0.8, 2.0, 0.4] },
    { type: "plant", name: "Bitki", icon: <Trees className="w-5 h-5" />, scale: [0.4, 1.0, 0.4] },
    { type: "lamp", name: "Lamba", icon: <Lightbulb className="w-5 h-5" />, scale: [0.3, 1.6, 0.3] },
    { type: "rug", name: "Halı", icon: <Grid3X3 className="w-5 h-5" />, scale: [2.0, 0.02, 1.5] },
    { type: "desk", name: "Çalışma Masası", icon: <Laptop className="w-5 h-5" />, scale: [1.2, 0.75, 0.6] },
    { type: "nightstand", name: "Komodin", icon: <Box className="w-5 h-5 scale-75" />, scale: [0.5, 0.5, 0.4] },
    { type: "toilet", name: "Klozet", icon: <Bath className="w-5 h-5 scale-75" />, scale: [0.4, 0.8, 0.6] },
    { type: "sink", name: "Lavabo", icon: <Droplets className="w-5 h-5" />, scale: [0.6, 0.85, 0.5] },
    { type: "bathtub", name: "Küvet", icon: <Bath className="w-5 h-5" />, scale: [1.7, 0.6, 0.8] },
    { type: "stove", name: "Ocak", icon: <Flame className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
    { type: "fridge", name: "Buzdolabı", icon: <Refrigerator className="w-5 h-5" />, scale: [0.7, 1.8, 0.7] },
    { type: "kitchen_cabinet", name: "Mutfak Dolabı", icon: <Archive className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
    { type: "armchair", name: "Berjer", icon: <Sofa className="w-5 h-5 scale-90" />, scale: [0.9, 0.85, 0.9] },
    { type: "coffee_table", name: "Sehpa", icon: <Coffee className="w-5 h-5" />, scale: [1.1, 0.45, 0.6] },
    { type: "tv_unit", name: "TV Ünitesi", icon: <Tv className="w-5 h-5 scale-90" />, scale: [1.8, 0.5, 0.45] },
    { type: "dresser", name: "Şifonyer", icon: <Box className="w-5 h-5" />, scale: [1.0, 0.9, 0.5] },
    { type: "washing_machine", name: "Çamaşır Mak.", icon: <WashingMachine className="w-5 h-5" />, scale: [0.6, 0.85, 0.6] },
    { type: "kitchen_counter", name: "Tezgah", icon: <CookingPot className="w-5 h-5" />, scale: [1.2, 0.9, 0.6] },
    { type: "shower", name: "Duş", icon: <ShowerHead className="w-5 h-5" />, scale: [0.9, 2.1, 0.9] },
    { type: "mirror", name: "Ayna", icon: <Square className="w-5 h-5" />, scale: [0.7, 1.0, 0.05] },
  ];

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isLeftPanelOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setLeftPanelOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto left-0 z-30 w-64 max-w-[80vw] bg-surface-raised border-r border-line flex flex-col md:h-full shadow-lg md:shadow-sm shrink-0 transition-transform duration-300 md:transition-none ${
          isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-line flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm tracking-wide">Katalog</h2>
          <button
            onClick={() => setLeftPanelOpen(false)}
            className="md:hidden text-ink-muted hover:text-ink p-1"
            aria-label="Kataloğu kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="mb-4">
             <button
                onClick={handleAddRoom}
                className="w-full flex items-center justify-center p-3 bg-brand/10 text-brand hover:bg-brand/15 border border-brand/20 rounded-lg transition-all font-medium text-sm"
              >
                + Yeni Oda Ekle
              </button>
          </div>

          <p className="text-xs text-ink-muted mb-2">Sahneye eklemek için dokun</p>
          <div className="grid grid-cols-2 gap-3">
            {furnitureOptions.map((item) => (
              <button
                key={item.type}
                onClick={() => handleAdd(item.type, item.name, item.scale)}
                className="flex flex-col items-center justify-center p-3 border border-line rounded-lg hover:bg-brand/10 hover:border-brand/40 active:bg-brand/15 transition-all group"
              >
                <div className="text-ink-muted group-hover:text-brand transition-colors mb-2">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-ink">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
