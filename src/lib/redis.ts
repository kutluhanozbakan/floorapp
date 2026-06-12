import { Redis } from "@upstash/redis";

// Upstash REST client. Works reliably on Vercel serverless (plain HTTP, no
// long-lived TCP connection). Reads credentials from env so the build never
// crashes when they're missing — callers get `null` and degrade gracefully.
let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  client = new Redis({ url, token });
  return client;
}

export const AR_SCAN_KEY = "latest_ar_scan";
