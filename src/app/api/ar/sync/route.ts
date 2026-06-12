import { NextResponse } from "next/server";
import { getRedis, AR_SCAN_KEY } from "@/lib/redis";

// Polled by the web app; must always hit Redis, never a cached response.
export const dynamic = "force-dynamic";

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ hasNewData: false });
  }

  try {
    // @upstash/redis deserializes the stored JSON back into an object.
    const data = await redis.get(AR_SCAN_KEY);

    if (data) {
      // Consume it so it isn't imported twice.
      await redis.del(AR_SCAN_KEY);
      return NextResponse.json({ hasNewData: true, data });
    }

    return NextResponse.json({ hasNewData: false });
  } catch (err) {
    console.error("Redis Get Error:", err);
    return NextResponse.json({ hasNewData: false });
  }
}
