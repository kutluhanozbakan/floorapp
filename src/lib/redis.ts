import Redis from "ioredis";

// Vercel's managed Redis (Redis Cloud, host *.db.redis.io) only exposes a TCP
// connection string via REDIS_URL — there is no HTTP/REST endpoint, so we use
// ioredis.
//
// On Vercel's serverless runtime the module can be re-evaluated and instances
// reused while warm, so we cache the client on globalThis to avoid opening a new
// connection on every invocation (which would exhaust the connection limit).
const g = globalThis as unknown as { _redis?: Redis };

export function getRedis(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (g._redis) return g._redis;

  const client = new Redis(url, {
    // Fail fast instead of hanging the serverless function on a bad connection.
    maxRetriesPerRequest: 3,
    connectTimeout: 10_000,
  });

  // Without an 'error' listener, ioredis emits an unhandled error event that can
  // crash the function. Log and let per-request try/catch handle the failure.
  client.on("error", (err) => {
    console.error("Redis connection error:", err?.message || err);
  });

  g._redis = client;
  return client;
}

// Per-session key so each user only sees the scans addressed to their pairing
// code. Falls back to a shared bucket when no session id is provided.
export const arScanKey = (sessionId: string) =>
  sessionId ? `ar_scan:${sessionId}` : "latest_ar_scan";
