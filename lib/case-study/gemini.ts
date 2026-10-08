export class AiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "AiError";
    this.status = status;
  }
}

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;
const REQUEST_TIMEOUT_MS = 120000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiError(
      "GEMINI_API_KEY is not configured on the server. Add it to .env.local to enable AI generation.",
      503,
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let status: number;
    let payload: Record<string, unknown> | null;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      status = response.status;
      payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    } catch {
      throw new AiError("Unable to reach the AI service. Please try again.", 502);
    }

    if (status === 429 || status === 503) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw new AiError(
        "AI model is currently experiencing high demand. Please try again after a minute.",
        429,
      );
    }

    if (status < 200 || status >= 300) {
      const errorInfo = payload?.error as { message?: string } | undefined;
      throw new AiError(
        errorInfo?.message ? `AI generation failed: ${errorInfo.message}` : `AI generation failed (HTTP ${status}).`,
        502,
      );
    }

    const candidates = payload?.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
    const text = candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
    if (!text.trim()) {
      throw new AiError("AI returned an empty response. Please try again.", 502);
    }
    return text;
  }

  throw new AiError("AI generation failed. Please try again.", 502);
}
