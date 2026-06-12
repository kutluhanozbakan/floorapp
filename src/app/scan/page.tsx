"use client";

import React, { useState } from "react";
import { generateId } from "@/utils/ids";
import { Plus, Trash2, Send, CheckCircle2, Loader2 } from "lucide-react";

type RoomForm = {
  key: string;
  name: string;
  width: string;
  depth: string;
  wallHeight: string;
};

const makeRoom = (index: number): RoomForm => ({
  key: generateId(),
  name: `Room ${index + 1}`,
  width: "5",
  depth: "4",
  wallHeight: "2.8",
});

export default function ScanPage() {
  const [rooms, setRooms] = useState<RoomForm[]>([makeRoom(0)]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
        name: r.name.trim() || `Room ${i + 1}`,
        position: [i * 6, 0, 0] as [number, number, number],
        width: Math.max(1, parseFloat(r.width) || 1),
        depth: Math.max(1, parseFloat(r.depth) || 1),
        wallHeight: Math.max(1, parseFloat(r.wallHeight) || 1),
        wallThickness: 0.2,
      })),
      furnitureItems: [],
    };

    try {
      const res = await fetch("/api/ar", {
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
    <main className="min-h-dvh bg-slate-100 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-base">
            FP
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Oda Gönder</h1>
            <p className="text-xs text-slate-500 leading-tight">Telefonundan masaüstü uygulamaya</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 max-w-md w-full mx-auto pb-28">
        <p className="text-sm text-slate-600">
          Oda ölçülerini gir ve uygulamaya gönder. Masaüstündeki uygulamada{" "}
          <span className="font-semibold">Connect AR</span> açıkken birkaç saniye içinde içe aktarılır.
        </p>

        {rooms.map((room, i) => (
          <div key={room.key} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Oda {i + 1}
              </span>
              {rooms.length > 1 && (
                <button
                  onClick={() => removeRoom(room.key)}
                  className="text-red-500 hover:text-red-700 p-1"
                  aria-label="Odayı sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Oda Adı</label>
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateRoom(room.key, "name", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashed border-slate-300 rounded-xl text-slate-600 font-medium active:bg-slate-50"
        >
          <Plus className="w-4 h-4" />
          Oda Ekle
        </button>
      </div>

      {/* Sticky send bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto">
          {status === "sent" ? (
            <div className="flex items-center justify-center gap-2 text-green-600 font-semibold py-3">
              <CheckCircle2 className="w-5 h-5" />
              Gönderildi! Masaüstünde içe aktarılıyor.
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-base active:bg-blue-700 disabled:opacity-60"
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
            <p className="text-sm text-red-600 text-center mt-2">{errorMsg}</p>
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
      <label className="block text-[11px] font-medium text-slate-500 mb-1">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={1}
        step={0.1}
        className="w-full px-2 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
