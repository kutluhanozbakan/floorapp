"use client";
import React, { useRef, useState } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { exportProjectToJson } from "@/utils/storage";
import { Save, Download, Upload, Trash2, Box, Map, Smartphone, PanelLeft, SlidersHorizontal, MoreVertical } from "lucide-react";

export default function Toolbar() {
  const { currentMode, setMode, saveProject, importProject, resetProject, setLeftPanelOpen, setRightPanelOpen, isArModalOpen, setArModalOpen } = usePlannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Incoming scans are imported globally by <ArSyncWatcher/>, so this modal is
  // now just informational (shows the /scan URL).

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

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the project? All unsaved progress will be lost.")) {
      resetProject();
    }
  };

  return (
    <div className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shrink-0 z-40 shadow-sm gap-2">
      {/* Left: catalog toggle (mobile) + logo */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          aria-label="Open catalog"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-base shrink-0">
          FP
        </div>
        <h1 className="hidden sm:block text-lg md:text-xl font-semibold tracking-tight text-slate-800 truncate">Floor Planner</h1>
      </div>

      {/* Center: 2D / 3D toggle */}
      <div className="flex items-center bg-slate-100 p-1 rounded-md shrink-0">
        <button
          onClick={() => setMode("2d")}
          className={`flex items-center px-3 md:px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            currentMode === "2d" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Map className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">2D Plan</span>
        </button>
        <button
          onClick={() => setMode("3d")}
          className={`flex items-center px-3 md:px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            currentMode === "3d" ? "bg-white shadow-sm text-blue-600" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Box className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">3D View</span>
        </button>
      </div>

      {/* Right: desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
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

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button
          onClick={() => setArModalOpen(true)}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-700 rounded hover:bg-indigo-700 transition-colors"
        >
          <Smartphone className="w-4 h-4 mr-1.5" />
          Connect AR
        </button>

        <div className="w-px h-6 bg-slate-300 mx-1"></div>

        <button
          onClick={handleReset}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Reset
        </button>
      </div>

      {/* Right: mobile actions (inspector toggle + overflow menu) */}
      <div className="flex md:hidden items-center gap-1 shrink-0">
        <button
          onClick={() => setRightPanelOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          aria-label="Open properties"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="More actions"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1 overflow-hidden">
                <MenuItem icon={<Save className="w-4 h-4" />} label="Save" onClick={() => { saveProject(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Download className="w-4 h-4" />} label="Export JSON" onClick={() => { exportProjectToJson(usePlannerStore.getState()); setIsMenuOpen(false); }} />
                <MenuItem icon={<Upload className="w-4 h-4" />} label="Import JSON" onClick={() => { handleImportClick(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Smartphone className="w-4 h-4 text-indigo-600" />} label="Connect AR" onClick={() => { setArModalOpen(true); setIsMenuOpen(false); }} />
                <div className="my-1 border-t border-slate-100" />
                <MenuItem icon={<Trash2 className="w-4 h-4" />} label="Reset" danger onClick={() => { setIsMenuOpen(false); handleReset(); }} />
              </div>
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {isArModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-indigo-600" />
                Connect AR Scanner
              </h3>
              <button onClick={() => setArModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4 text-center">
              <p className="text-sm text-slate-600 mb-2">
                Open this page on your phone to enter and send a room:
              </p>
              <div className="font-mono text-sm font-bold text-slate-800 bg-white border border-slate-300 py-2 px-1 rounded break-all">
                {typeof window !== "undefined" ? `${window.location.origin}/scan` : "/scan"}
              </div>
              <a
                href="/scan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline"
              >
                Open the send page →
              </a>
            </div>

            <p className="text-xs text-slate-500 text-center">
              The app listens automatically — a room sent from your phone shows up
              within a few seconds, even if you close this dialog.
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-indigo-600 font-medium animate-pulse">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <span>Listening for scans...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-colors ${
        danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
