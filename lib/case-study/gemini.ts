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

function extractText(payload: Record<string, unknown> | null) {
  const candidates = payload?.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
  return candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
}

async function requestGemini(prompt: string, jsonMode: boolean): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiError(
      "GEMINI_API_KEY is not configured on the server. Add it to the production environment to enable AI generation.",
      503,
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: jsonMode ? 0.15 : 0.25,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response: Response;
    let payload: Record<string, unknown> | null;

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    } catch {
      throw new AiError("Unable to reach the AI service. Please try again.", 502);
    }

    if (response.status === 429 || response.status === 503) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw new AiError("AI model is currently experiencing high demand. Please try again after a minute.", 429);
    }

    if (!response.ok) {
      const errorInfo = payload?.error as { message?: string } | undefined;
      throw new AiError(
        errorInfo?.message ? `AI generation failed: ${errorInfo.message}` : `AI generation failed (HTTP ${response.status}).`,
        502,
      );
    }

    const text = extractText(payload);
    if (!text.trim()) throw new AiError("AI returned an empty response. Please try again.", 502);
    return text.trim();
  }

  throw new AiError("AI generation failed. Please try again.", 502);
}

export async function callGemini(prompt: string): Promise<string> {
  return requestGemini(prompt, false);
}

function stripJsonFence(value: string) {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function callGeminiJson<T>(prompt: string): Promise<T> {
  const text = await requestGemini(prompt, true);
  try {
    return JSON.parse(stripJsonFence(text)) as T;
  } catch {
    throw new AiError("AI returned malformed structured data. Please retry generation.", 502);
  }
}
