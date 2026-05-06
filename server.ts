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

// Analytics partial — injected before </body> on every HTML page.
// Edit partials/analytics.html to add or change tracking scripts.
// NOTE: any new file source read here also needs adding to the Dockerfile COPY allowlist.
const analyticsHtml = await Bun.file(
  new URL("./partials/analytics.html", import.meta.url).pathname
).text();

type CompressedPage = {
  plain: string;
  gzip: Uint8Array;
};

async function loadPage(filename: string): Promise<CompressedPage> {
  const html = await Bun.file(
    new URL(`./${filename}`, import.meta.url).pathname
  ).text();
  const withAnalytics = html.replace("</body>", `${analyticsHtml}\n</body>`);
  return {
    plain: withAnalytics,
    gzip: Bun.gzipSync(withAnalytics),
  };
}

function htmlResponse(req: Request, page: CompressedPage): Response {
  const acceptsGzip = req.headers.get("accept-encoding")?.includes("gzip") ?? false;
  const baseHeaders: Record<string, string> = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=300",
    "Vary": "Accept-Encoding",
  };
  if (acceptsGzip) {
    return new Response(page.gzip, {
      headers: { ...baseHeaders, "Content-Encoding": "gzip" },
    });
  }
  return new Response(page.plain, { headers: baseHeaders });
}

const homepageHtml = await loadPage("homepage.html");
const revenueResidencyHtml = await loadPage("revenue-residency.html");
const midMarketTechHtml = await loadPage("mid-market-tech.html");
const studioOsHtml = await loadPage("studio-os.html");

const server = Bun.serve({
  port: Number(process.env.PORT ?? 8080),

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/health") return new Response("ok");

    if (path === "/" && req.method === "GET") {
      return htmlResponse(req, homepageHtml);
    }

    if (path === "/revenue-residency" && req.method === "GET") {
      return htmlResponse(req, revenueResidencyHtml);
    }

    if (path === "/mid-market-tech" && req.method === "GET") {
      return htmlResponse(req, midMarketTechHtml);
    }

    if (path === "/studio-os" && req.method === "GET") {
      return htmlResponse(req, studioOsHtml);
    }

    if (path === "/headshot.jpg" && req.method === "GET") {
      return new Response(Bun.file(new URL("./headshot.jpg", import.meta.url).pathname), {
        headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400" },
      });
    }

    if (path === "/og.png" && req.method === "GET") {
      return new Response(Bun.file(new URL("./og.png", import.meta.url).pathname), {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    }

    if (path === "/apply" && req.method === "POST") {
      return handleApply(req);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`[principl] server running on port ${server.port}`);
