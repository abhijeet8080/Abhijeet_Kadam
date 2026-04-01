/**
 * Streams Gemini output from POST /api/chat (NDJSON: `{t}`, `{error}`, `{done}`).
 * See: https://ai.google.dev/gemini-api/docs/text-generation#streaming-responses
 */
export async function streamMessageToAI(
  message: string,
  onDelta: (delta: string) => void
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    let errText = `Request failed: ${res.status}`;
    try {
      const j = (await res.json()) as { error?: string };
      if (j?.error) errText = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(errText);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  const handleLine = (line: string): boolean => {
    if (!line.trim()) return false;
    const obj = JSON.parse(line) as { t?: string; error?: string; done?: boolean };
    if (obj.error) throw new Error(obj.error);
    if (obj.done) return true;
    if (obj.t !== undefined) onDelta(obj.t);
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      buffer += decoder.decode(value, { stream: true });
    }

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      try {
        if (handleLine(line)) return;
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }

    if (done) break;
  }

  if (buffer.trim()) {
    if (handleLine(buffer)) return;
  }
}

export const askAI = streamMessageToAI;
