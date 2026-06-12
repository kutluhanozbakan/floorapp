"use client";

import React, { useEffect, useState } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import { getClientId } from "@/utils/session";
import { CheckCircle2 } from "lucide-react";

// Polls for scans sent from the /scan page (phone) and imports them as soon as
// they arrive — regardless of whether the Connect AR modal is open. The backing
// Redis (Redis Cloud) has a fixed plan with no per-command billing, so a steady
// poll while the app is open is fine.
export default function ArSyncWatcher() {
  const { importProject, setArModalOpen } = usePlannerStore();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const clientId = getClientId();

    const poll = async () => {
      try {
        const res = await fetch(`/api/ar/sync?s=${encodeURIComponent(clientId)}`, { cache: "no-store" });
        const result = await res.json();
        if (!cancelled && result.hasNewData && result.data) {
          importProject(result.data);
          setArModalOpen(false);
          const count = result.data.rooms?.length ?? 0;
          setToast(`Telefondan ${count} oda içe aktarıldı`);
          setTimeout(() => !cancelled && setToast(null), 4000);
        }
      } catch {
        // ignore transient network errors during polling
      }
    };

    const interval = setInterval(poll, 4000);
    poll();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [importProject, setArModalOpen]);

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-sm font-medium">
      <CheckCircle2 className="w-5 h-5" />
      {toast}
    </div>
  );
}
