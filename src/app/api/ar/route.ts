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

    // Store with a 10-minute expiry so the desktop has a comfortable window to
    // pick it up. The web app polls continuously while open.
    await redis.set(AR_SCAN_KEY, JSON.stringify(data), "EX", 600);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Redis Set Error:", err);
    return NextResponse.json({ success: false, error: "Failed to save data to Redis" }, { status: 500 });
  }
}
