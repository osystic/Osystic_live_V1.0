import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/signup", "/admin/pending"]);
const ALLOWED_EMAIL = "OsysticArslan@osystic.com";

function base64Url(bytes: ArrayBuffer) {
  const data = new Uint8Array(bytes);
  const lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let result = "";
  const len = data.length;
  for (let i = 0; i < len; i += 3) {
    const a = data[i];
    const b = i + 1 < len ? data[i + 1] : 0;
    const c = i + 2 < len ? data[i + 2] : 0;
    result += lookup[a >> 2];
    result += lookup[((a & 3) << 4) | (b >> 4)];
    if (i + 1 < len) result += lookup[((b & 15) << 2) | (c >> 6)];
    if (i + 2 < len) result += lookup[c & 63];
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
  return email.toLowerCase() === ALLOWED_EMAIL.toLowerCase();
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
    ["sign"]
  );
  const computed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`));
  if (base64Url(computed) !== signature) return false;

  const decoded = decodePayload(payload) as { exp?: number; email?: string } | null;
  if (!decoded?.exp || decoded.exp * 1000 <= Date.now()) return false;
  if (!isAllowedEmail(decoded.email)) return false;
  return true;
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const protectedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin/content") ||
    pathname.startsWith("/api/admin/finance");
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
  matcher: ["/admin/:path*", "/api/admin/content/:path*", "/api/admin/finance/:path*"],
};
