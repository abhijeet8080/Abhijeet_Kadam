import { streamChatToAI } from "@/controller/chatController";

const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(",") || ["*"];

function getCorsHeaders(origin: string) {
  const isAllowed = allowedOrigins.includes("*") || allowedOrigins.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

/** NDJSON stream: `{ "t": "delta" }` per line, then `{ "done": true }`, or `{ "error": "..." }`. */
export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);

    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(obj)}\n`));
        };

        const result = await streamChatToAI(message, (delta) => {
          send({ t: delta });
        });

        if (!result.ok) {
          send({ error: result.error });
        }
        send({ done: true });
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  return new Response(JSON.stringify({ message: "Welcome to the AI Chat API!" }), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  return new Response(null, { status: 204, headers: corsHeaders });
}
