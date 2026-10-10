export function logHandledContentStoreFailure(context: string, error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";

  const expectedCodes = new Set([
    "SQLITE_CANTOPEN",
    "SQLITE_ERROR",
    "SQLITE_BUSY",
    "SQLITE_LOCKED",
    "ENOENT",
    "EACCES",
    "EROFS",
  ]);

  if (expectedCodes.has(code)) {
    console.warn(`[content-fallback] ${context}${code ? ` (${code})` : ""}`);
    return;
  }

  console.error(context, error);
}
