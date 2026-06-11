"use client";
import React, { useRef } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { exportProjectToJson } from "@/utils/storage";
import { Save, Download, Upload, Trash2, Box, Map } from "lucide-react";

export default function Toolbar() {
  const { currentMode, setMode, saveProject, importProject, resetProject } = usePlannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const state = JSON.parse(content);
          importProject(state);
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg mr-2">
          FP
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-800">Floor Planner MVP</h1>
      </div>

      <div className="flex items-center bg-slate-100 p-1 rounded-md">
        <button
          onClick={() => setMode("2d")}
          className={`flex items-center px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            currentMode === "2d" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Map className="w-4 h-4 mr-2" />
          2D Plan
        </button>
        <button
          onClick={() => setMode("3d")}
          className={`flex items-center px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            currentMode === "3d" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Box className="w-4 h-4 mr-2" />
          3D View
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={saveProject}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          title="Save to LocalStorage"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save
        </button>
        
        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button
          onClick={() => exportProjectToJson(usePlannerStore.getState())}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          title="Export JSON"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          title="Import JSON"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          Import
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset the project? All unsaved progress will be lost.")) {
              resetProject();
            }
          }}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
