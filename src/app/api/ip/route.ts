import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract client IP from headers set by proxies / load balancers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  let ip = 'unknown';
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; take the first (original client) IP
    ip = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }

  return NextResponse.json({ ip });
}
