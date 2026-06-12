"use client";
import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import { usePlannerStore } from "@/store/plannerStore";
import { exportProjectToJson } from "@/utils/storage";
import { getClientId } from "@/utils/session";
import { Save, Download, Upload, Trash2, Box, Map, Smartphone, PanelLeft, SlidersHorizontal, MoreVertical } from "lucide-react";

export default function Toolbar() {
  const { currentMode, setMode, saveProject, importProject, resetProject, setLeftPanelOpen, setRightPanelOpen, isArModalOpen, setArModalOpen } = usePlannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Incoming scans are imported globally by <ArSyncWatcher/>, so this modal is
  // just informational: it shows the per-user /scan URL + QR pairing code.
  const [scanUrl, setScanUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    const url = `${window.location.origin}/scan?s=${getClientId()}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScanUrl(url);
    QRCode.toDataURL(url, { width: 220, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, []);

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
          alert("Geçersiz JSON dosyası");
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
    if (confirm("Projeyi sıfırlamak istediğine emin misin? Kaydedilmemiş tüm değişiklikler kaybolur.")) {
      resetProject();
    }
  };

  return (
    <div className="h-14 md:h-16 bg-surface border-b border-line flex items-center justify-between px-3 md:px-6 shrink-0 z-40 shadow-soft gap-2">
      {/* Left: catalog toggle (mobile) + logo */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => setLeftPanelOpen(true)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-control text-ink-muted hover:bg-canvas active:bg-canvas transition-colors"
          aria-label="Kataloğu aç"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-brand rounded-control flex items-center justify-center text-white font-bold text-base shrink-0">
          F
        </div>
        <h1 className="hidden sm:block text-lg md:text-xl font-semibold tracking-tight text-ink truncate">FloorApp</h1>
      </div>

      {/* Center: 2D / 3D toggle */}
      <div className="flex items-center bg-canvas p-1 rounded-control shrink-0">
        <button
          onClick={() => setMode("2d")}
          className={`flex items-center px-3 md:px-4 py-1.5 rounded-control text-sm font-medium transition-colors ${
            currentMode === "2d" ? "bg-surface-raised shadow-soft text-brand" : "text-ink-muted hover:text-ink"
          }`}
        >
          <Map className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">2D Plan</span>
        </button>
        <button
          onClick={() => setMode("3d")}
          className={`flex items-center px-3 md:px-4 py-1.5 rounded-control text-sm font-medium transition-colors ${
            currentMode === "3d" ? "bg-surface-raised shadow-soft text-brand" : "text-ink-muted hover:text-ink"
          }`}
        >
          <Box className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">3D Görünüm</span>
        </button>
      </div>

      {/* Right: desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        <button
          onClick={saveProject}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-ink bg-surface-raised border border-line rounded-control hover:bg-canvas transition-colors"
          title="Tarayıcıya kaydet"
        >
          <Save className="w-4 h-4 mr-1.5" />
          Kaydet
        </button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <button
          onClick={() => exportProjectToJson(usePlannerStore.getState())}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-ink bg-surface-raised border border-line rounded-control hover:bg-canvas transition-colors"
          title="JSON dışa aktar"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Dışa Aktar
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-ink bg-surface-raised border border-line rounded-control hover:bg-canvas transition-colors"
          title="JSON içe aktar"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          İçe Aktar
        </button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <button
          onClick={() => setArModalOpen(true)}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-brand rounded-control hover:bg-brand-strong transition-colors"
        >
          <Smartphone className="w-4 h-4 mr-1.5" />
          Telefona Bağlan
        </button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <button
          onClick={handleReset}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-danger bg-danger/10 border border-danger/20 rounded-control hover:bg-danger/15 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Sıfırla
        </button>
      </div>

      {/* Right: mobile actions (inspector toggle + overflow menu) */}
      <div className="flex md:hidden items-center gap-1 shrink-0">
        <button
          onClick={() => setRightPanelOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-control text-ink-muted hover:bg-canvas active:bg-canvas transition-colors"
          aria-label="Özellikleri aç"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex items-center justify-center w-9 h-9 rounded-control text-ink-muted hover:bg-canvas active:bg-canvas transition-colors"
            aria-label="Diğer işlemler"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-50 w-52 bg-surface-raised border border-line rounded-panel shadow-float py-1 overflow-hidden">
                <MenuItem icon={<Save className="w-4 h-4" />} label="Kaydet" onClick={() => { saveProject(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Download className="w-4 h-4" />} label="JSON dışa aktar" onClick={() => { exportProjectToJson(usePlannerStore.getState()); setIsMenuOpen(false); }} />
                <MenuItem icon={<Upload className="w-4 h-4" />} label="JSON içe aktar" onClick={() => { handleImportClick(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Smartphone className="w-4 h-4 text-brand" />} label="Telefona Bağlan" onClick={() => { setArModalOpen(true); setIsMenuOpen(false); }} />
                <div className="my-1 border-t border-line" />
                <MenuItem icon={<Trash2 className="w-4 h-4" />} label="Sıfırla" danger onClick={() => { setIsMenuOpen(false); handleReset(); }} />
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-raised rounded-panel shadow-float w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-brand" />
                Telefona Bağlan
              </h3>
              <button onClick={() => setArModalOpen(false)} className="text-ink-muted hover:text-ink" aria-label="Kapat">
                ✕
              </button>
            </div>

            <div className="bg-canvas p-4 rounded-panel border border-line mb-4 text-center">
              <p className="text-sm text-ink-muted mb-3">
                Kendine özel gönderim sayfanı açmak için telefonunla bu QR kodu okut:
              </p>
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Eşleştirme QR kodu"
                  className="w-44 h-44 mx-auto rounded bg-white border border-line p-1"
                />
              ) : (
                <div className="w-44 h-44 mx-auto rounded bg-canvas animate-pulse" />
              )}
              <div className="mt-3 font-mono text-[11px] text-ink bg-surface-raised border border-line py-2 px-1 rounded break-all">
                {scanUrl || "/scan"}
              </div>
              <a
                href={scanUrl || "/scan"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-brand hover:text-brand-strong underline"
              >
                Gönderim sayfasını aç →
              </a>
            </div>

            <p className="text-xs text-ink-muted text-center">
              Uygulama otomatik dinler — telefonundan gönderdiğin oda, bu pencereyi
              kapatsan bile birkaç saniye içinde ekrana düşer.
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-brand font-medium animate-pulse">
              <div className="w-2 h-2 rounded-full bg-brand"></div>
              <span>Taramalar dinleniyor...</span>
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
        danger ? "text-danger hover:bg-danger/10" : "text-ink hover:bg-canvas"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
