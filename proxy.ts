import { NextRequest, NextResponse } from "next/server";
import { getAllowedAdminEmail } from "@/lib/admin-identity";
import { siteConfig } from "@/app/config/site";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/signup", "/admin/pending"]);
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function base64Url(bytes: ArrayBuffer) {
  const data = new Uint8Array(bytes);
  const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";
  for (let i = 0; i < data.length; i += 3) {
    const a = data[i];
    const b = i + 1 < data.length ? data[i + 1] : 0;
    const c = i + 2 < data.length ? data[i + 2] : 0;
    result += lookup[a >> 2];
    result += lookup[((a & 3) << 4) | (b >> 4)];
    if (i + 1 < data.length) result += lookup[((b & 15) << 2) | (c >> 6)];
    if (i + 2 < data.length) result += lookup[c & 63];
  }
  return result;
}

function decodePayload(segment: string) {
  try {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isAllowedEmail(email: string | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const allowedEmail = getAllowedAdminEmail();
  return Boolean(allowedEmail) && email.toLowerCase() === allowedEmail;
}

async function validToken(token: string | undefined) {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!token || !secret || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const computed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`));
  if (base64Url(computed) !== signature) return false;

  const decoded = decodePayload(payload) as { exp?: number; email?: string } | null;
  if (!decoded?.exp || decoded.exp * 1000 <= Date.now()) return false;
  return isAllowedEmail(decoded.email);
}

function trustedCsrfOrigins(request: NextRequest) {
  const origins = new Set<string>([request.nextUrl.origin]);
  if (process.env.NODE_ENV === "production") origins.add(new URL(siteConfig.url).origin);

  for (const configured of (process.env.CSRF_TRUSTED_ORIGINS || "").split(",")) {
    const candidate = configured.trim();
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (process.env.NODE_ENV === "production" && url.protocol !== "https:") continue;
      origins.add(url.origin);
    } catch {
      // Ignore malformed configuration instead of broadening the trust boundary.
    }
  }

  return origins;
}

function csrfRejected(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/") || !UNSAFE_METHODS.has(request.method.toUpperCase())) return false;

  // Cookie-authenticated mutations must originate from this site (or a deliberate,
  // exact staging origin configured in CSRF_TRUSTED_ORIGINS). We reject requests
  // without Origin rather than falling back to Referer, which prevents cross-site
  // form posts and ambient-cookie CSRF. Token-authenticated cross-origin APIs should
  // be implemented on a separate explicit allow-list rather than weakening this gate.
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || origin === "null") return true;
  if (fetchSite === "cross-site") return true;

  try {
    return !trustedCsrfOrigins(request).has(new URL(origin).origin);
  } catch {
    return true;
  }
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (csrfRejected(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const protectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin/content") ||
    pathname.startsWith("/api/admin/finance") ||
    pathname.startsWith("/api/admin/case-studies") ||
    pathname.startsWith("/api/admin/careers");

  if (!protectedPath) return NextResponse.next();

  const token = request.cookies.get("admin-auth-token")?.value;
  if (await validToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
