"use client";
import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import { usePlannerStore } from "@/store/plannerStore";
import { exportProjectToJson } from "@/utils/storage";
import { getClientId } from "@/utils/session";
import { Button, IconButton, Panel, SegmentedControl, type SegmentOption } from "@/components/ui";
import { Save, Download, Upload, Trash2, Box, Map, Smartphone, PanelLeft, SlidersHorizontal, MoreVertical } from "lucide-react";

type Mode = "2d" | "3d";

const modeOptions: SegmentOption<Mode>[] = [
  { value: "2d", label: "2D Plan", icon: <Map className="w-4 h-4" />, hideLabelOnMobile: true },
  { value: "3d", label: "3D Görünüm", icon: <Box className="w-4 h-4" />, hideLabelOnMobile: true },
];

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
        <span className="md:hidden">
          <IconButton label="Kataloğu aç" onClick={() => setLeftPanelOpen(true)}>
            <PanelLeft className="w-5 h-5" />
          </IconButton>
        </span>
        <div className="w-8 h-8 bg-brand rounded-control flex items-center justify-center text-white font-bold text-base shrink-0">
          F
        </div>
        <h1 className="hidden sm:block text-lg md:text-xl font-semibold tracking-tight text-ink truncate">FloorApp</h1>
      </div>

      {/* Center: 2D / 3D toggle */}
      <SegmentedControl<Mode>
        ariaLabel="Görünüm modu"
        value={currentMode}
        onChange={setMode}
        options={modeOptions}
      />

      {/* Right: desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        <Button variant="secondary" icon={<Save className="w-4 h-4" />} onClick={saveProject} title="Tarayıcıya kaydet">
          Kaydet
        </Button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={() => exportProjectToJson(usePlannerStore.getState())} title="JSON dışa aktar">
          Dışa Aktar
        </Button>
        <Button variant="secondary" icon={<Upload className="w-4 h-4" />} onClick={handleImportClick} title="JSON içe aktar">
          İçe Aktar
        </Button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <Button variant="primary" icon={<Smartphone className="w-4 h-4" />} onClick={() => setArModalOpen(true)}>
          Telefona Bağlan
        </Button>

        <div className="w-px h-6 bg-line mx-1"></div>

        <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={handleReset}>
          Sıfırla
        </Button>
      </div>

      {/* Right: mobile actions (inspector toggle + overflow menu) */}
      <div className="flex md:hidden items-center gap-1 shrink-0">
        <IconButton label="Özellikleri aç" onClick={() => setRightPanelOpen(true)}>
          <SlidersHorizontal className="w-5 h-5" />
        </IconButton>
        <div className="relative">
          <IconButton label="Diğer işlemler" onClick={() => setIsMenuOpen((v) => !v)}>
            <MoreVertical className="w-5 h-5" />
          </IconButton>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
              <Panel raised className="absolute right-0 top-11 z-50 w-52 py-1 overflow-hidden">
                <MenuItem icon={<Save className="w-4 h-4" />} label="Kaydet" onClick={() => { saveProject(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Download className="w-4 h-4" />} label="JSON dışa aktar" onClick={() => { exportProjectToJson(usePlannerStore.getState()); setIsMenuOpen(false); }} />
                <MenuItem icon={<Upload className="w-4 h-4" />} label="JSON içe aktar" onClick={() => { handleImportClick(); setIsMenuOpen(false); }} />
                <MenuItem icon={<Smartphone className="w-4 h-4 text-brand" />} label="Telefona Bağlan" onClick={() => { setArModalOpen(true); setIsMenuOpen(false); }} />
                <div className="my-1 border-t border-line" />
                <MenuItem icon={<Trash2 className="w-4 h-4" />} label="Sıfırla" danger onClick={() => { setIsMenuOpen(false); handleReset(); }} />
              </Panel>
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
          <Panel raised className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-ink flex items-center">
                <Smartphone className="w-5 h-5 mr-2 text-brand" />
                Telefona Bağlan
              </h3>
              <IconButton label="Kapat" onClick={() => setArModalOpen(false)}>
                <span aria-hidden className="text-base leading-none">✕</span>
              </IconButton>
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
          </Panel>
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
