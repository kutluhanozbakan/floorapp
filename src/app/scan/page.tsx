"use client";

import React, { useEffect, useState } from "react";
import { generateId } from "@/utils/ids";
import { sanitizeSessionId } from "@/utils/session";
import { Plus, Trash2, Send, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

type RoomForm = {
  key: string;
  name: string;
  width: string;
  depth: string;
  wallHeight: string;
};

const makeRoom = (index: number): RoomForm => ({
  key: generateId(),
  name: `Oda ${index + 1}`,
  width: "5",
  depth: "4",
  wallHeight: "2.8",
});

export default function ScanPage() {
  const [rooms, setRooms] = useState<RoomForm[]>([makeRoom(0)]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId, setSessionId] = useState("");

  // The pairing code comes from the URL (?s=...) shown by the desktop's QR code.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("s");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(sanitizeSessionId(param));
  }, []);

  const updateRoom = (key: string, field: keyof RoomForm, value: string) => {
    setRooms((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
    setStatus("idle");
  };

  const addRoom = () => setRooms((rs) => [...rs, makeRoom(rs.length)]);

  const removeRoom = (key: string) =>
    setRooms((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs));

  const handleSend = async () => {
    setStatus("sending");
    setErrorMsg("");

    // Build a ProjectState the desktop app understands. Rooms are spread along X
    // so they don't overlap; furniture is left empty (arrange it on the desktop).
    const payload = {
      rooms: rooms.map((r, i) => ({
        id: generateId(),
        name: r.name.trim() || `Oda ${i + 1}`,
        position: [i * 6, 0, 0] as [number, number, number],
        width: Math.max(1, parseFloat(r.width) || 1),
        depth: Math.max(1, parseFloat(r.depth) || 1),
        wallHeight: Math.max(1, parseFloat(r.wallHeight) || 1),
        wallThickness: 0.2,
      })),
      furnitureItems: [],
    };

    try {
      const res = await fetch(`/api/ar?s=${encodeURIComponent(sessionId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Gönderim başarısız oldu.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Ağ hatası. İnternet bağlantını kontrol et.");
    }
  };

  return (
    <main className="min-h-dvh bg-canvas text-ink flex flex-col">
      <header className="bg-surface-raised border-b border-line px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-white font-bold text-base">
            F
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Oda Gönder</h1>
            <p className="text-xs text-ink-muted leading-tight">Telefonundan masaüstü uygulamaya</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 max-w-md w-full mx-auto pb-28">
        <p className="text-sm text-ink-muted">
          Oda ölçülerini gir ve uygulamaya gönder. Birkaç saniye içinde senin
          masaüstü uygulamana içe aktarılır.
        </p>

        {!sessionId && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>
              Eşleştirme kodu yok. Bu sayfayı masaüstü uygulamandaki{" "}
              <span className="font-semibold">Telefona Bağlan</span> penceresindeki QR kodu
              veya linki ile aç ki oda doğru kişiye (sana) gitsin.
            </span>
          </div>
        )}

        {rooms.map((room, i) => (
          <div key={room.key} className="bg-surface-raised rounded-xl border border-line shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Oda {i + 1}
              </span>
              {rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(room.key)}
                  className="text-danger hover:text-danger p-1"
                  aria-label="Odayı sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Oda Adı</label>
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateRoom(room.key, "name", e.target.value)}
                className="w-full px-3 py-2.5 border border-line rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Field label="En (m)" value={room.width} onChange={(v) => updateRoom(room.key, "width", v)} />
              <Field label="Boy (m)" value={room.depth} onChange={(v) => updateRoom(room.key, "depth", v)} />
              <Field label="Yükseklik (m)" value={room.wallHeight} onChange={(v) => updateRoom(room.key, "wallHeight", v)} />
            </div>
          </div>
        ))}

        <button
          onClick={addRoom}
          className="w-full flex items-center justify-center gap-2 py-3 bg-surface-raised border border-dashed border-line rounded-xl text-ink-muted font-medium active:bg-canvas"
        >
          <Plus className="w-4 h-4" />
          Oda Ekle
        </button>
      </div>

      {/* Sticky send bar */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-raised border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto">
          {status === "sent" ? (
            <div className="flex items-center justify-center gap-2 text-success font-semibold py-3">
              <CheckCircle2 className="w-5 h-5" />
              Gönderildi! Masaüstünde içe aktarılıyor.
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand text-white rounded-xl font-semibold text-base active:bg-brand-strong disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Uygulamaya Gönder
                </>
              )}
            </button>
          )}
          {status === "error" && (
            <p className="text-sm text-danger text-center mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-ink-muted mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={1}
        step={0.1}
        className="w-full px-2 py-2.5 border border-line rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
