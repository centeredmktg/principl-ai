import { createHash } from "node:crypto";
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

// Content-hash /assets/work/*.jpg references at boot so a swapped screenshot
// busts caches automatically: the URL changes when (and only when) the bytes do.
// Files stay named "<base>.jpg" on disk; the served URL becomes "<base>.<hash>.jpg".
const assetHashCache = new Map<string, string>();
async function assetHash(base: string): Promise<string | null> {
  const cached = assetHashCache.get(base);
  if (cached) return cached;
  const file = Bun.file(new URL(`./assets/work/${base}.jpg`, import.meta.url).pathname);
  if (!(await file.exists())) return null;
  const hash = createHash("sha256")
    .update(Buffer.from(await file.arrayBuffer()))
    .digest("hex")
    .slice(0, 8);
  assetHashCache.set(base, hash);
  return hash;
}

async function hashAssetRefs(html: string): Promise<string> {
  const bases = new Set<string>();
  for (const m of html.matchAll(/\/assets\/work\/([a-z0-9-]+)\.jpg/g)) bases.add(m[1]);
  for (const base of bases) {
    const h = await assetHash(base);
    if (h) html = html.replaceAll(`/assets/work/${base}.jpg`, `/assets/work/${base}.${h}.jpg`);
  }
  return html;
}

async function loadPage(filename: string): Promise<CompressedPage> {
  const html = await Bun.file(
    new URL(`./${filename}`, import.meta.url).pathname
  ).text();
  const withAnalytics = html.replace("</body>", `${analyticsHtml}\n</body>`);
  const withHashedAssets = await hashAssetRefs(withAnalytics);
  return {
    plain: withHashedAssets,
    gzip: Bun.gzipSync(withHashedAssets),
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
const workHtml = await loadPage("work.html");
const coloradoPlasticSurgeryHtml = await loadPage("colorado-plastic-surgery.html");

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

    if (path === "/work" && req.method === "GET") {
      return htmlResponse(req, workHtml);
    }

    // Unlisted — shared directly with the prospect, not in the public nav.
    if (path === "/colorado-plastic-surgery" && req.method === "GET") {
      return htmlResponse(req, coloradoPlasticSurgeryHtml);
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

    // Case-study surface screenshots. Accept a bare "<base>.jpg" or a
    // content-hashed "<base>.<hash>.jpg"; both map to <base>.jpg on disk.
    // The base is [a-z0-9-]+ (no dots/slashes) so there's no path traversal.
    // Hashed URLs are immutable-cacheable; bare URLs get a short TTL.
    if (path.startsWith("/assets/work/") && req.method === "GET") {
      const name = path.slice("/assets/work/".length);
      const m = name.match(/^([a-z0-9-]+)(\.[a-f0-9]{8})?\.jpg$/);
      if (m) {
        const file = Bun.file(new URL(`./assets/work/${m[1]}.jpg`, import.meta.url).pathname);
        if (await file.exists()) {
          const cache = m[2]
            ? "public, max-age=31536000, immutable"
            : "public, max-age=86400";
          return new Response(file, {
            headers: { "Content-Type": "image/jpeg", "Cache-Control": cache },
          });
        }
      }
      return new Response("Not found", { status: 404 });
    }

    if (path === "/apply" && req.method === "POST") {
      return handleApply(req);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`[principl] server running on port ${server.port}`);
