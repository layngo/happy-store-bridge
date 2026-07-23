/** Browser calls from layngo.com (Lovable) to this Worker need CORS. */
const ALLOWED_ORIGINS = new Set([
  "https://www.layngo.com",
  "https://layngo.com",
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
]);

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin")?.trim() ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.layngo.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function corsPreflightResponse(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export function jsonWithCors(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: corsHeaders(request),
  });
}
