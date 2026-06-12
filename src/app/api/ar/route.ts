import { NextResponse } from "next/server";
import { getRedis, AR_SCAN_KEY } from "@/lib/redis";

// AR scans must never be cached and run on demand.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { success: false, error: "Redis is not configured (missing REDIS_URL)" },
      { status: 500 }
    );
  }

  try {
    const data = await request.json();

    // Store with a 120s expiry. The web app polls and imports within seconds.
    await redis.set(AR_SCAN_KEY, JSON.stringify(data), "EX", 120);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Redis Set Error:", err);
    return NextResponse.json({ success: false, error: "Failed to save data to Redis" }, { status: 500 });
  }
}
