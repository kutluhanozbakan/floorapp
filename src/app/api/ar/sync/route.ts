import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis | undefined };
export const redis = globalForRedis.redis || new Redis(process.env.REDIS_URL || "");

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export async function GET() {
  try {
    // Check if the key exists
    const dataString = await redis.get('latest_ar_scan');
    
    if (dataString) {
      // Data found! Delete it immediately so it doesn't get imported twice
      await redis.del('latest_ar_scan');
      
      return NextResponse.json({ hasNewData: true, data: JSON.parse(dataString) });
    }
    
    return NextResponse.json({ hasNewData: false });
  } catch (err) {
    console.error("Redis Get Error:", err);
    return NextResponse.json({ hasNewData: false });
  }
}
