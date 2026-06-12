import { NextResponse } from "next/server";
import { getRedis, arScanKey } from "@/lib/redis";
import { sanitizeSessionId } from "@/utils/session";

// Polled by the web app; must always hit Redis, never a cached response.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ hasNewData: false });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = sanitizeSessionId(searchParams.get("s"));
    const key = arScanKey(sessionId);

    const dataString = await redis.get(key);

    if (dataString) {
      // Consume it so it isn't imported twice.
      await redis.del(key);
      return NextResponse.json({ hasNewData: true, data: JSON.parse(dataString) });
    }

    return NextResponse.json({ hasNewData: false });
  } catch (err) {
    console.error("Redis Get Error:", err);
    return NextResponse.json({ hasNewData: false });
  }
}
