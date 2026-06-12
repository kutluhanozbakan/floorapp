"use client";

import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { buildSampleProject } from "@/utils/sample";
import { PackagePlus, Smartphone, Sparkles } from "lucide-react";

// First-use / empty overlay shown over the canvas while the scene has no
// furniture. Non-blocking: only the card captures pointer events so the canvas
// stays pannable around it.
export default function EmptyState() {
  const { furnitureItems, setLeftPanelOpen, setArModalOpen, importProject } = usePlannerStore();
  if (furnitureItems.length > 0) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm rounded-panel bg-surface-raised/95 backdrop-blur border border-line shadow-float p-6 text-center">
        <h2 className="text-lg font-semibold text-ink">Plana başla</h2>
        <p className="text-sm text-ink-muted mt-1 mb-5">Bir yol seç — istediğin zaman değiştirebilirsin.</p>

        <div className="space-y-2">
          <Option
            icon={<PackagePlus className="w-5 h-5" />}
            title="Katalogdan eşya ekle"
            desc="Koltuk, masa, mutfak ve daha fazlası"
            onClick={() => setLeftPanelOpen(true)}
          />
          <Option
            icon={<Smartphone className="w-5 h-5" />}
            title="Telefondan ölçü gönder"
            desc="QR ile odanı telefonundan gönder"
            onClick={() => setArModalOpen(true)}
          />
          <Option
            icon={<Sparkles className="w-5 h-5" />}
            title="Örnek planı keşfet"
            desc="Döşenmiş bir salonla başla"
            onClick={() => importProject(buildSampleProject())}
          />
        </div>
      </div>
    </div>
  );
}

function Option({
  icon, title, desc, onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 text-left p-3 rounded-control border border-line hover:bg-brand/10 hover:border-brand/40 transition-colors group"
    >
      <span className="text-ink-muted group-hover:text-brand transition-colors">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-ink-muted truncate">{desc}</span>
      </span>
    </button>
  );
}
