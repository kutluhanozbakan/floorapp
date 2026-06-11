"use client";
import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { generateId } from "@/utils/ids";
import { FurnitureType } from "@/types/planner";
import { Armchair, Bed, Table, Box, DoorOpen, LayoutPanelTop } from "lucide-react";

export default function LeftPanel() {
  const { addFurniture } = usePlannerStore();

  const handleAdd = (type: FurnitureType, name: string, scale: [number, number, number]) => {
    addFurniture({
      id: generateId(),
      type,
      name,
      // Place new furniture in the middle of the room roughly, y is 0
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale,
    });
  };

  const furnitureOptions = [
    { type: "sofa" as FurnitureType, name: "Sofa", icon: <Armchair className="w-6 h-6" />, scale: [2, 0.8, 0.9] as [number, number, number] },
    { type: "table" as FurnitureType, name: "Table", icon: <Table className="w-6 h-6" />, scale: [1.5, 0.8, 1] as [number, number, number] },
    { type: "chair" as FurnitureType, name: "Chair", icon: <Armchair className="w-6 h-6 scale-75" />, scale: [0.5, 0.9, 0.5] as [number, number, number] },
    { type: "bed" as FurnitureType, name: "Bed", icon: <Bed className="w-6 h-6" />, scale: [1.6, 0.5, 2] as [number, number, number] },
    { type: "wardrobe" as FurnitureType, name: "Wardrobe", icon: <Box className="w-6 h-6" />, scale: [1.2, 2.2, 0.6] as [number, number, number] },
    { type: "door" as FurnitureType, name: "Door", icon: <DoorOpen className="w-6 h-6" />, scale: [1.0, 2.2, 0.2] as [number, number, number] },
    { type: "window" as FurnitureType, name: "Window", icon: <LayoutPanelTop className="w-6 h-6" />, scale: [1.5, 1.2, 0.2] as [number, number, number] },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Catalog</h2>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto">
        <p className="text-xs text-slate-500 mb-2">Click to add to scene</p>
        <div className="grid grid-cols-2 gap-3">
          {furnitureOptions.map((item) => (
            <button
              key={item.type}
              onClick={() => handleAdd(item.type, item.name, item.scale)}
              className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group"
            >
              <div className="text-slate-600 group-hover:text-blue-600 transition-colors mb-2">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-slate-700">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
