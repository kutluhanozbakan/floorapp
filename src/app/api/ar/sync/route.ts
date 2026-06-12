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
    const dataString = await redis.get(AR_SCAN_KEY);

    if (dataString) {
      // Consume it so it isn't imported twice.
      await redis.del(AR_SCAN_KEY);
      return NextResponse.json({ hasNewData: true, data: JSON.parse(dataString) });
    }

    return NextResponse.json({ hasNewData: false });
  } catch (err) {
    console.error("Redis Get Error:", err);
    return NextResponse.json({ hasNewData: false });
  }
}
