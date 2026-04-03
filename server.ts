import { initDb, upsertApplication, type Application } from "./db.ts";
import { notifyNewApplication } from "./notify.ts";

// Init DB in background — don't block server startup (Railway healthcheck needs /health immediately)
initDb().catch((err) => console.error("[server] DB init failed, will retry on first request:", err));

const REQUIRED_FIELDS = ["name", "email", "revenue", "fix_first"] as const;

function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleApply(req: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  const missing = REQUIRED_FIELDS.filter(
    (f) => !body[f] || String(body[f]).trim() === ""
  );
  if (missing.length > 0) {
    return jsonResponse(
      { ok: false, error: `Missing fields: ${missing.join(", ")}` },
      400
    );
  }

  const app: Application = {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    revenue: String(body.revenue).trim(),
    fix_first: String(body.fix_first).trim(),
  };

  try {
    await initDb();
    const { isNew } = await upsertApplication(app);
    if (isNew) {
      notifyNewApplication(app);
    }
    return jsonResponse({ ok: true });
  } catch (err) {
    console.error("[server] Database error:", err);
    return jsonResponse({ ok: false, error: "Server error" }, 500);
  }
}

const homepageHtml = await Bun.file(
  new URL("./homepage.html", import.meta.url).pathname
).text();

const revenueResidencyHtml = await Bun.file(
  new URL("./revenue-residency.html", import.meta.url).pathname
).text();

const server = Bun.serve({
  port: Number(process.env.PORT ?? 8080),

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/health") return new Response("ok");

    if (path === "/" && req.method === "GET") {
      return new Response(homepageHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (path === "/revenue-residency" && req.method === "GET") {
      return new Response(revenueResidencyHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (path === "/headshot.jpg" && req.method === "GET") {
      return new Response(Bun.file(new URL("./headshot.jpg", import.meta.url).pathname), {
        headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" },
      });
    }

    if (path === "/apply" && req.method === "POST") {
      return handleApply(req);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`[principl] server running on port ${server.port}`);
