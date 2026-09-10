import jwt from "jsonwebtoken";

export type AdminTokenPayload = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export function getAdminJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, getAdminJwtSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getAdminJwtSecret()) as AdminTokenPayload;
  } catch {
    return null;
  }
}
