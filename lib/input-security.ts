const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const ANGLE_BRACKETS = /[<>]/g;
const MULTISPACE = /[ \t]{2,}/g;

export function sanitizeSingleLine(value: string) {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARS, "")
    .replace(/[\r\n]+/g, " ")
    .replace(ANGLE_BRACKETS, "")
    .replace(MULTISPACE, " ")
    .trim();
}

export function sanitizeMultiline(value: string) {
  return value
    .normalize("NFKC")
    .replace(CONTROL_CHARS, "")
    .replace(ANGLE_BRACKETS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function sanitizeHttpsUrl(value: string) {
  const normalized = sanitizeSingleLine(value);
  if (!normalized) return "";
  try {
    const url = new URL(normalized);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}
