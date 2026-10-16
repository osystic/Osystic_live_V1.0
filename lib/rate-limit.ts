import "server-only";

import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const url =
  process.env.UPSTASH_REDIS_REST_URL?.trim() ||
  process.env.KV_REST_API_URL?.trim();
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
  process.env.KV_REST_API_TOKEN?.trim();

const redis =
  url && token
    ? new Redis({
        url,
        token,
      })
    : null;

function createLimiter({
  prefix,
  requests,
  window,
}: {
  prefix: string;
  requests: number;
  window: Parameters<typeof Ratelimit.slidingWindow>[1];
}) {
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `osystic:${process.env.VERCEL_ENV || process.env.NODE_ENV || "local"}:${prefix}`,
    analytics: false,
    ephemeralCache: false,
    timeout: 0,
  });
}

export const adminLoginLimiter = createLimiter({
  prefix: "admin-login",
  requests: 8,
  window: "15 m",
});

export const contactLimiter = createLimiter({
  prefix: "contact",
  requests: 5,
  window: "10 m",
});

export const careersLimiter = createLimiter({
  prefix: "careers",
  requests: 4,
  window: "1 h",
});

export type RateLimitDecision = {
  success: boolean;
  configured: boolean;
  unavailable: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export function clientRateLimitId(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("cf-connecting-ip")?.trim() ||
    "unknown";

  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/**
 * Without Upstash configured, this module fails CLOSED in production: every
 * rate-limited route returns 503 rather than serving unthrottled. That is the
 * safe default and is unchanged.
 *
 * RATE_LIMIT_FAIL_OPEN=1 opts into an in-process limiter instead, for
 * single-instance deployments that have no Upstash database yet. It is
 * per-process, so on a multi-instance/serverless deployment the effective
 * limit multiplies by the instance count - only use it until Upstash is set up.
 */
function failOpenAllowed(): boolean {
  return process.env.RATE_LIMIT_FAIL_OPEN === "1";
}

function unconfiguredDecision(): RateLimitDecision {
  if (failOpenAllowed()) {
    console.warn(
      "[rate-limit] RATE_LIMIT_FAIL_OPEN=1 - serving with a per-process limiter. Do not use on multi-instance deployments.",
    );
    return {
      success: true,
      configured: false,
      unavailable: false,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }
  const production = process.env.NODE_ENV === "production";
  return {
    success: !production,
    configured: false,
    unavailable: production,
    limit: 0,
    remaining: 0,
    reset: 0,
  };
}

export async function consumeRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<RateLimitDecision> {
  if (!limiter) {
    return unconfiguredDecision();
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      configured: true,
      unavailable: false,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("[rate-limit] Upstash request failed", error);
    return unconfiguredDecision();
  }
}

export function rateLimitHeaders(decision: RateLimitDecision) {
  if (!decision.configured || decision.unavailable) return {};

  const retryAfter = Math.max(
    0,
    Math.ceil((decision.reset - Date.now()) / 1000),
  );

  return {
    "X-RateLimit-Limit": String(decision.limit),
    "X-RateLimit-Remaining": String(Math.max(0, decision.remaining)),
    "X-RateLimit-Reset": String(decision.reset),
    ...(decision.success ? {} : { "Retry-After": String(retryAfter) }),
  };
}
