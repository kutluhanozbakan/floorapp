"use client";
import React, { useRef, useState, useEffect } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { exportProjectToJson } from "@/utils/storage";
import { Save, Download, Upload, Trash2, Box, Map, Smartphone } from "lucide-react";

export default function Toolbar() {
  const { currentMode, setMode, saveProject, importProject, resetProject } = usePlannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isArModalOpen) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/ar/sync");
          const result = await res.json();
          if (result.hasNewData && result.data) {
            importProject(result.data);
            setIsArModalOpen(false);
            alert("AR Scan imported successfully!");
          }
        } catch {
          // ignore network errors during polling
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isArModalOpen, importProject]);

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
          onClick={() => setIsArModalOpen(true)}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-700 rounded hover:bg-indigo-700 transition-colors"
        >
          <Smartphone className="w-4 h-4 mr-1.5" />
          Connect AR
        </button>

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

      {isArModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-96 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-indigo-600" />
                Connect AR Scanner
              </h3>
              <button onClick={() => setIsArModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 text-center">
              <p className="text-sm text-slate-600 mb-2">
                Open the iOS Scanner app and enter this URL to send the scan:
              </p>
              <div className="font-mono text-sm font-bold text-slate-800 bg-white border border-slate-300 py-2 px-1 rounded break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/ar` : '/api/ar'}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600 font-medium animate-pulse">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <span>Waiting for scan data...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
