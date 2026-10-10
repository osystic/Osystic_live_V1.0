export function getAllowedAdminEmail() {
  return (process.env.ADMIN_ALLOWED_EMAIL ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}
