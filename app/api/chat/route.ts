import { chatWithAI } from "@/controller/chatController";

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

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || "";
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const { message } = await req.json();
    console.log("Message",message)
    const response = await chatWithAI(message);

    return new Response(JSON.stringify({ reply: response.reply }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.log("Error:", error);
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
