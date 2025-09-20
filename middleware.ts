import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ipAddress as ip } from '@vercel/edge'

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const clientIp = ip(request) ?? '127.0.0.1';
  
  // Only apply rate limiting to AI API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limit = 10; // 10 requests
    const windowMs = 60 * 1000; // 1 minute

    const record = rateLimitMap.get(ip);
    const now = Date.now();

    if (record && now - record.timestamp < windowMs) {
      if (record.count >= limit) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }),
          { status: 429 }
        );
      }

      record.count++;
      record.timestamp = now;
    } else {
      rateLimitMap.set(ip, {
        count: 1,
        timestamp: now,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};