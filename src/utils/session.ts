const CLIENT_ID_KEY = "floorapp_client_id";

// Generate a short, URL/QR-friendly pairing code.
const makeCode = () => Math.random().toString(36).slice(2, 10);

// A stable per-browser id used to scope the AR relay so each user only receives
// the room scans addressed to their own session. Persisted in localStorage so a
// desktop keeps the same pairing code across reloads.
export function getClientId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = makeCode();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

// Only allow the characters our codes use, so it's safe to build a Redis key.
export function sanitizeSessionId(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.replace(/[^a-z0-9]/gi, "").slice(0, 32);
}
