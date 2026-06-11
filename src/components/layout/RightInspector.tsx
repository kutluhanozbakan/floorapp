"use client";
import React from "react";
import { usePlannerStore } from "@/store/plannerStore";

export default function RightInspector() {
  const { room, updateRoom, furnitureItems, selectedItemId, updateFurniture, deleteFurniture } = usePlannerStore();

  const selectedItem = furnitureItems.find((i) => i.id === selectedItemId);

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-sm z-10 overflow-y-auto shrink-0">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Room Properties</h2>
      </div>
      <div className="p-4 space-y-4 border-b border-slate-200">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Width (X) - meters</label>
          <input
            type="number"
            value={room.width}
            onChange={(e) => updateRoom({ width: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min={1}
            max={50}
            step={0.5}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Depth (Z) - meters</label>
          <input
            type="number"
            value={room.depth}
            onChange={(e) => updateRoom({ depth: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min={1}
            max={50}
            step={0.5}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Wall Height</label>
          <input
            type="number"
            value={room.wallHeight}
            onChange={(e) => updateRoom({ wallHeight: parseFloat(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            min={1}
            max={10}
            step={0.1}
          />
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Selected Object</h2>
      </div>

      {selectedItem ? (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
            <input
              type="text"
              value={selectedItem.name}
              onChange={(e) => updateFurniture(selectedItem.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Pos X</label>
              <input
                type="number"
                value={selectedItem.position[0].toFixed(2)}
                onChange={(e) => updateFurniture(selectedItem.id, { position: [parseFloat(e.target.value) || 0, selectedItem.position[1], selectedItem.position[2]] })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Pos Z</label>
              <input
                type="number"
                value={selectedItem.position[2].toFixed(2)}
                onChange={(e) => updateFurniture(selectedItem.id, { position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value) || 0] })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                step={0.1}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Rotation Y (degrees)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={Math.round((selectedItem.rotation[1] * 180) / Math.PI)}
                onChange={(e) => updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], ((parseFloat(e.target.value) || 0) * Math.PI) / 180, selectedItem.rotation[2]] })}
                className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                step={15}
              />
              <button
                onClick={() => updateFurniture(selectedItem.id, { rotation: [selectedItem.rotation[0], selectedItem.rotation[1] + Math.PI / 4, selectedItem.rotation[2]] })}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-sm font-medium transition-colors"
              >
                +45°
              </button>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="block text-xs font-semibold text-slate-700 mb-2">Dimensions (meters)</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Width (X)</label>
                <input
                  type="number"
                  value={selectedItem.scale[0].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [parseFloat(e.target.value) || 0.1, selectedItem.scale[1], selectedItem.scale[2]] })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step={0.1} min={0.1}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Height (Y)</label>
                <input
                  type="number"
                  value={selectedItem.scale[1].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [selectedItem.scale[0], parseFloat(e.target.value) || 0.1, selectedItem.scale[2]] })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step={0.1} min={0.1}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Depth (Z)</label>
                <input
                  type="number"
                  value={selectedItem.scale[2].toFixed(2)}
                  onChange={(e) => updateFurniture(selectedItem.id, { scale: [selectedItem.scale[0], selectedItem.scale[1], parseFloat(e.target.value) || 0.1] })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step={0.1} min={0.1}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-slate-100">
             <button
                onClick={() => deleteFurniture(selectedItem.id)}
                className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-sm font-medium transition-colors"
              >
                Delete Object
              </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 text-sm">
          Select an object in the scene to edit its properties.
        </div>
      )}
    </div>
  );
}
