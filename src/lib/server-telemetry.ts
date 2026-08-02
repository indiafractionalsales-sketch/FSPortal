/**
 * Copyright (c) 2026 Biztribe Trading & Consultancy India Private Limited.
 * All rights reserved.
 *
 * This file is part of the Fractional Sales Partner platform.
 * CONFIDENTIAL AND PROPRIETARY — Unauthorised copying, redistribution,
 * modification, or use of this document, via any medium, is strictly prohibited.
 * Violation will result in civil and criminal prosecution under the
 * Copyright Act 1957, Information Technology Act 2000, and applicable
 * Indian and international intellectual property laws.
 */

import { NextRequest } from 'next/server';

export interface TelemetryData {
  ip: string;
  country: string;
  city: string;
  region: string;
  userAgent: string;
  isVpnOrProxy: boolean;
}

/**
 * Extracts client IP and geo-telemetry from Next.js HTTP headers (Cloudflare, Vercel, x-forwarded-for).
 */
export function extractClientTelemetry(request: NextRequest): TelemetryData {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const cfIpCountry = request.headers.get('cf-ipcountry');
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  const vercelCity = request.headers.get('x-vercel-ip-city');
  const userAgent = request.headers.get('user-agent') || 'unknown';

  let ip = '127.0.0.1';
  if (cfConnectingIp) {
    ip = cfConnectingIp.trim();
  } else if (forwarded) {
    ip = forwarded.split(',')[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  }

  const country = cfIpCountry || vercelCountry || 'IN';
  const city = vercelCity ? decodeURIComponent(vercelCity) : 'Unknown';

  // Basic check for common datacenter / proxy headers
  const viaHeader = request.headers.get('via') || '';
  const isVpnOrProxy = viaHeader.toLowerCase().includes('proxy') || request.headers.has('x-proxy-id');

  return {
    ip,
    country: country.toUpperCase(),
    city,
    region: country,
    userAgent,
    isVpnOrProxy,
  };
}
