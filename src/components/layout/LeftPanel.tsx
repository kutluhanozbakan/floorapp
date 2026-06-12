"use client";
import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { generateId } from "@/utils/ids";
import { FurnitureType } from "@/types/planner";
import { 
  Armchair, Bed, Table, Box, DoorOpen, LayoutPanelTop, X,
  Tv, Library, Trees, Lightbulb, Grid3X3, Laptop,
  Bath, Droplets, Flame, Refrigerator, Archive
} from "lucide-react";

export default function LeftPanel() {
  const { addFurniture, isLeftPanelOpen, setLeftPanelOpen, addRoom, rooms } = usePlannerStore();

  const handleAdd = (type: FurnitureType, name: string, scale: [number, number, number]) => {
    // Windows sit 1m off the floor by default; doors rest on the floor. Everything
    // else keeps y=0. Setting this on add (not just on drag) keeps the wall cut-out
    // at the right height immediately.
    let y = 0;
    if (type === "window") y = 1.0 + scale[1] / 2;
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
      name: `Room ${rooms.length + 1}`,
      position: [rooms.length * 6, 0, 0], // Offset new room to avoid exact overlap
      width: 5,
      depth: 4,
      wallHeight: 2.8,
      wallThickness: 0.2,
    });
    setLeftPanelOpen(false);
  };

  const furnitureOptions: { type: FurnitureType; name: string; icon: React.ReactNode; scale: [number, number, number] }[] = [
    { type: "sofa", name: "Sofa", icon: <Armchair className="w-5 h-5" />, scale: [2, 0.8, 0.9] },
    { type: "table", name: "Table", icon: <Table className="w-5 h-5" />, scale: [1.6, 0.75, 0.9] },
    { type: "wardrobe", name: "Wardrobe", icon: <Box className="w-5 h-5" />, scale: [1.2, 2.2, 0.6] },
    { type: "chair", name: "Chair", icon: <Armchair className="w-5 h-5 scale-75" />, scale: [0.5, 0.9, 0.5] },
    { type: "bed", name: "Bed", icon: <Bed className="w-5 h-5" />, scale: [1.6, 0.6, 2.0] },
    { type: "door", name: "Door", icon: <DoorOpen className="w-5 h-5" />, scale: [0.9, 2.1, 0.1] },
    { type: "window", name: "Window", icon: <LayoutPanelTop className="w-5 h-5" />, scale: [1.2, 1.2, 0.1] },
    { type: "tv", name: "TV", icon: <Tv className="w-5 h-5" />, scale: [1.2, 0.8, 0.1] },
    { type: "bookshelf", name: "Bookshelf", icon: <Library className="w-5 h-5" />, scale: [0.8, 2.0, 0.4] },
    { type: "plant", name: "Plant", icon: <Trees className="w-5 h-5" />, scale: [0.4, 1.0, 0.4] },
    { type: "lamp", name: "Lamp", icon: <Lightbulb className="w-5 h-5" />, scale: [0.3, 1.6, 0.3] },
    { type: "rug", name: "Rug", icon: <Grid3X3 className="w-5 h-5" />, scale: [2.0, 0.02, 1.5] },
    { type: "desk", name: "Desk", icon: <Laptop className="w-5 h-5" />, scale: [1.2, 0.75, 0.6] },
    { type: "nightstand", name: "Nightstand", icon: <Box className="w-5 h-5 scale-75" />, scale: [0.5, 0.5, 0.4] },
    { type: "toilet", name: "Toilet", icon: <Bath className="w-5 h-5 scale-75" />, scale: [0.4, 0.8, 0.6] },
    { type: "sink", name: "Sink", icon: <Droplets className="w-5 h-5" />, scale: [0.6, 0.85, 0.5] },
    { type: "bathtub", name: "Bathtub", icon: <Bath className="w-5 h-5" />, scale: [1.7, 0.6, 0.8] },
    { type: "stove", name: "Stove", icon: <Flame className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
    { type: "fridge", name: "Fridge", icon: <Refrigerator className="w-5 h-5" />, scale: [0.7, 1.8, 0.7] },
    { type: "kitchen_cabinet", name: "Cabinet", icon: <Archive className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
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
        className={`fixed md:static top-14 bottom-0 md:top-auto md:bottom-auto left-0 z-30 w-64 max-w-[80vw] bg-white border-r border-slate-200 flex flex-col md:h-full shadow-lg md:shadow-sm shrink-0 transition-transform duration-300 md:transition-none ${
          isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Catalog</h2>
          <button
            onClick={() => setLeftPanelOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
            aria-label="Close catalog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="mb-4">
             <button
                onClick={handleAddRoom}
                className="w-full flex items-center justify-center p-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all font-medium text-sm"
              >
                + Add New Room
              </button>
          </div>
          
          <p className="text-xs text-slate-500 mb-2">Tap to add to scene</p>
          <div className="grid grid-cols-2 gap-3">
            {furnitureOptions.map((item) => (
              <button
                key={item.type}
                onClick={() => handleAdd(item.type, item.name, item.scale)}
                className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all group"
              >
                <div className="text-slate-600 group-hover:text-blue-600 transition-colors mb-2">
                  {item.icon}
                </div>
                <span className="text-xs font-medium text-slate-700">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
