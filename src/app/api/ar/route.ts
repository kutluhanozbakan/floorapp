import { NextResponse } from 'next/server';
import Redis from 'ioredis';

// Use a global to prevent connection limits in development (Next.js hot reloads)
const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis = globalForRedis.redis || new Redis(process.env.REDIS_URL || "");

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Store data in Redis with an expiration of 2 minutes (120 seconds)
    // The web app fetches it within a few seconds, so 120s is safe.
    await redis.set('latest_ar_scan', JSON.stringify(data), 'EX', 120);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Redis Set Error:", err);
    return NextResponse.json({ success: false, error: "Failed to save data to Redis" }, { status: 500 });
  }
}
