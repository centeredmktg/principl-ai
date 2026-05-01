# Principl.ai Consulting Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Revenue Residency waitlist as principl.ai's homepage with a consulting practice brochure page. Move the waitlist to `/revenue-residency`.

**Architecture:** Bun server gets a second HTML file (`homepage.html`) served at `/`. Current `index.html` is renamed to `revenue-residency.html` and served at `/revenue-residency`. No DB, deployment, or infrastructure changes.

**Tech Stack:** Bun, HTML/CSS (inline), TypeScript server

**Spec:** `docs/specs/2026-04-03-principl-consulting-homepage-design.md`

---

### Task 1: Rename index.html → revenue-residency.html and update server routing

**Files:**
- Rename: `site/index.html` → `site/revenue-residency.html`
- Modify: `site/server.ts`

- [ ] **Step 1: Rename the HTML file**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git mv index.html revenue-residency.html
```

- [ ] **Step 2: Update the header wordmark on revenue-residency.html to link back to homepage**

In `site/revenue-residency.html`, change the wordmark div to an anchor:

```html
<!-- Before -->
<div class="wordmark">principl</div>

<!-- After -->
<a href="/" class="wordmark" style="text-decoration: none; color: var(--green);">principl</a>
```

- [ ] **Step 3: Update server.ts to serve both pages**

Replace the contents of `site/server.ts` with:

```typescript
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

const residencyHtml = await Bun.file(
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
      return new Response(residencyHtml, {
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
```

- [ ] **Step 4: Verify server starts and both routes work**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
# Create a placeholder homepage.html so the server can start
echo '<!DOCTYPE html><html><body><h1>Homepage placeholder</h1></body></html>' > homepage.html
bun run server.ts &
sleep 1
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/revenue-residency
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health
# Expected: 200
kill %1
```

- [ ] **Step 5: Commit**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git add server.ts revenue-residency.html homepage.html
git commit -m "refactor: move waitlist to /revenue-residency, add homepage route"
```

---

### Task 2: Build the consulting homepage HTML

**Files:**
- Create: `site/homepage.html`

This is the main deliverable. The page uses the same design system as `revenue-residency.html` — same CSS variables, fonts, animation patterns, responsive breakpoints, and paper grain texture. The CTA links to a HubSpot meeting link (placeholder URL until Danny connects it).

- [ ] **Step 1: Write homepage.html**

Create `site/homepage.html` with the full page. The structure follows the spec exactly:

1. **Header** — wordmark "principl" (not a link) + "Digital Transformation & AI Advisory"
2. **Hero** — label, serif headline, 2-3 body paragraphs, "Book a Conversation" CTA button
3. **Breakout quote** — the dual-edged sword tension
4. **The Problem section** — why AI adoption efforts fail
5. **The Approach section** — "How We Work" — first-principles methodology
6. **The Track Record section** — "The Practitioner" — narrative credential ladder (4 beats: agency → founder → enterprise AI → academic)
7. **CTA section** — dark background, "Let's Talk", book a conversation button + email fallback
8. **Footer** — principl.ai + danny@principl.ai

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>principl.ai — Digital Transformation & AI Advisory</title>
  <meta name="description" content="AI adoption is an operations problem, not a technology problem. Principl helps organizations move from experimentation to infrastructure with a first-principles methodology refined over nearly two decades of technology-forward transformation work.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --green: #226b03;
      --green-light: #2a8204;
      --ink: #111;
      --text: #1a1a1a;
      --text-secondary: #555;
      --surface: #fdfcfa;
      --surface-warm: #f6f4f0;
      --border: #e2dfda;
      --serif: 'Instrument Serif', Georgia, serif;
      --sans: 'Outfit', -apple-system, sans-serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background-color: var(--surface);
      color: var(--text);
      font-family: var(--sans);
      font-size: 17px;
      font-weight: 400;
      line-height: 1.75;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-repeat: repeat;
      z-index: 9999;
    }

    /* ─── Header ─── */
    .header {
      padding: 40px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }

    .wordmark {
      font-family: var(--sans);
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--green);
      position: relative;
    }

    .wordmark::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--green);
      border-radius: 50%;
      margin-right: 10px;
      vertical-align: middle;
      position: relative;
      top: -1px;
    }

    .header-descriptor {
      font-family: var(--sans);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-secondary);
    }

    /* ─── Hero ─── */
    .hero {
      max-width: 860px;
      margin: 0 auto;
      padding: 80px 32px 100px;
      position: relative;
    }

    .hero-label {
      font-family: var(--sans);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--green);
      margin-bottom: 28px;
      opacity: 0;
      animation: fadeUp 0.8s ease forwards;
    }

    .hero h1 {
      font-family: var(--serif);
      font-size: clamp(38px, 5.5vw, 64px);
      font-weight: 400;
      line-height: 1.15;
      color: var(--ink);
      letter-spacing: -0.01em;
      margin-bottom: 36px;
      opacity: 0;
      animation: fadeUp 0.8s ease 0.1s forwards;
    }

    .hero h1 em {
      font-style: italic;
      color: var(--green);
    }

    .hero-body {
      max-width: 580px;
      opacity: 0;
      animation: fadeUp 0.8s ease 0.2s forwards;
    }

    .hero-body p {
      margin-bottom: 18px;
      color: var(--text);
      font-weight: 300;
      font-size: 18px;
      line-height: 1.8;
    }

    .hero-body p strong {
      font-weight: 500;
      color: var(--ink);
    }

    .cta-button {
      display: inline-block;
      padding: 18px 36px;
      font-size: 14px;
      font-family: var(--sans);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background-color: var(--green);
      border: none;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 12px;
    }

    .cta-button:hover {
      background-color: var(--green-light);
    }

    /* ─── Section rhythm ─── */
    .section {
      max-width: 860px;
      margin: 0 auto;
      padding: 0 32px 100px;
      position: relative;
    }

    .section-label {
      font-family: var(--sans);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--green);
      margin-bottom: 32px;
      padding-left: 24px;
      position: relative;
    }

    .section-label::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 1.5px;
      background: var(--green);
    }

    .section-content {
      max-width: 600px;
    }

    .section-content p {
      margin-bottom: 18px;
      font-weight: 300;
      font-size: 17px;
      line-height: 1.8;
    }

    .section-content p:last-child {
      margin-bottom: 0;
    }

    .section-content p strong {
      font-weight: 500;
      color: var(--ink);
    }

    /* ─── Breakout quote ─── */
    .breakout {
      font-family: var(--serif);
      font-size: clamp(24px, 3.5vw, 34px);
      line-height: 1.4;
      color: var(--ink);
      padding: 60px 0;
      max-width: 680px;
      margin: 0 auto;
      border-top: 1.5px solid var(--border);
      border-bottom: 1.5px solid var(--border);
      margin-bottom: 100px;
      position: relative;
    }

    .breakout-inner {
      max-width: 860px;
      margin: 0 auto;
      padding: 0 32px;
    }

    .breakout em {
      font-style: italic;
      color: var(--green);
    }

    /* ─── Track record beats ─── */
    .beat {
      margin-bottom: 40px;
    }

    .beat:last-child {
      margin-bottom: 0;
    }

    .beat-label {
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 600;
      color: var(--ink);
      letter-spacing: 0.04em;
      margin-bottom: 12px;
    }

    .beat p {
      margin-bottom: 14px;
      font-weight: 300;
      font-size: 17px;
      line-height: 1.8;
    }

    .beat p:last-child {
      margin-bottom: 0;
    }

    .beat p strong {
      font-weight: 500;
      color: var(--ink);
    }

    .through-line {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1.5px solid var(--border);
    }

    .through-line p {
      font-family: var(--serif);
      font-size: clamp(20px, 2.5vw, 26px);
      line-height: 1.5;
      color: var(--ink);
      font-weight: 400;
    }

    .through-line em {
      font-style: italic;
      color: var(--green);
    }

    /* ─── CTA section ─── */
    .cta-section {
      background: var(--ink);
      color: #fff;
      padding: 100px 32px;
    }

    .cta-inner {
      max-width: 560px;
      margin: 0 auto;
    }

    .cta-label {
      font-family: var(--sans);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--green-light);
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cta-label::before {
      content: '';
      display: block;
      width: 12px;
      height: 1.5px;
      background: var(--green-light);
    }

    .cta-section h2 {
      font-family: var(--serif);
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 400;
      line-height: 1.25;
      color: #fff;
      margin-bottom: 36px;
      letter-spacing: -0.01em;
    }

    .cta-button-dark {
      display: inline-block;
      padding: 18px 36px;
      font-size: 14px;
      font-family: var(--sans);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background-color: var(--green);
      border: none;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .cta-button-dark:hover {
      background-color: var(--green-light);
    }

    .cta-footnote {
      margin-top: 32px;
      font-size: 14px;
      color: rgba(255,255,255,0.4);
      font-weight: 300;
    }

    .cta-footnote a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      transition: color 0.3s ease, border-color 0.3s ease;
    }

    .cta-footnote a:hover {
      color: #fff;
      border-bottom-color: rgba(255,255,255,0.5);
    }

    /* ─── Footer ─── */
    .footer {
      padding: 40px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-left {
      font-family: var(--sans);
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .footer-right {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 400;
      letter-spacing: 0.04em;
    }

    .footer-right a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-right a:hover {
      color: var(--green);
    }

    /* ─── Animations ─── */
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
      .header { padding: 28px 24px; }
      .header-descriptor { display: none; }
      .hero { padding: 60px 24px 80px; }
      .section { padding: 0 24px 80px; }
      .breakout-inner { padding: 0 24px; }
      .breakout { margin-bottom: 80px; }
      .cta-section { padding: 80px 24px; }
      .footer { padding: 32px 24px; flex-direction: column; gap: 8px; }
    }

    @media (max-width: 480px) {
      body { font-size: 16px; }
      .hero { padding: 48px 20px 64px; }
      .hero h1 { margin-bottom: 28px; }
      .hero-body p { font-size: 16px; }
      .section { padding: 0 20px 64px; }
      .section-content p { font-size: 16px; }
      .breakout-inner { padding: 0 20px; }
      .cta-section { padding: 64px 20px; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="wordmark">principl</div>
    <div class="header-descriptor">Digital Transformation & AI Advisory</div>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-label">Digital Transformation & AI Advisory</div>
    <h1>AI adoption isn't a technology problem. It's an <em>operations</em> problem.</h1>
    <div class="hero-body">
      <p>Every organization recognizes the transformative potential of AI. Most don't know where to start, and the ones that do are starting in the wrong place.</p>
      <p>Leadership says "we have to use AI" and the result is predictable: tool purchases without a rollout plan, fractured efforts across teams, and a growing sense of uncertainty about what's actually working.</p>
      <p><strong>The gap isn't awareness. It's methodology.</strong></p>
      <p>Principl helps organizations move from experimentation to infrastructure, with a first-principles approach that maps AI adoption to your real business challenges, your existing systems, and the way your teams actually work.</p>
      <a href="#HUBSPOT_MEETING_LINK" class="cta-button">Book a Conversation</a>
    </div>
  </section>

  <!-- Breakout -->
  <div class="breakout">
    <div class="breakout-inner reveal">
      The companies that win with AI won't be the ones that <em>adopted it first.</em> They'll be the ones that adopted it <em>intentionally.</em>
    </div>
  </div>

  <!-- The Problem -->
  <section class="section reveal">
    <div class="section-label">What we keep seeing</div>
    <div class="section-content">
      <p>Most AI adoption efforts fail the same way. Not because the technology doesn't work, but because there's no operating plan underneath it.</p>
      <p>Tools get purchased before the problem is defined. Teams experiment in silos. Nobody connects the AI investment back to the systems of record or the workflows that actually run the business.</p>
      <p>The result is churn — not progress. Budgets spent, enthusiasm burned, and the organization no closer to understanding how AI fits into what they do every day.</p>
      <p><strong>It's not a technology gap. It's a methodology gap.</strong> And it's solvable.</p>
    </div>
  </section>

  <!-- The Approach -->
  <section class="section reveal">
    <div class="section-label">How we work</div>
    <div class="section-content">
      <p>First-principles, not vendor-driven. Industry-agnostic, not template-driven.</p>
      <p>We start with what your business actually needs — not what an AI vendor is selling. We map to your existing systems of record and infrastructure investment. We produce a bespoke operating system to address your real business challenges, tailored to your teams, your tools, and your competitive context.</p>
      <p>This isn't a slide deck. It's not a tool recommendation. It's an operational plan your organization can execute, measure, and own.</p>
      <p>The methodology has been refined over nearly two decades of technology-forward organizational transformation — from the early days of social media to the current AI wave. <strong>Every time a new technology emerges, the pattern is the same:</strong> figure out how it generates value, build the system, teach the organization to run it.</p>
    </div>
  </section>

  <!-- The Track Record -->
  <section class="section reveal">
    <div class="section-label">The practitioner</div>
    <div class="section-content">
      <div class="beat">
        <div class="beat-label">Big Agency Origins</div>
        <p>Started in Chicago, launching brands on emerging social platforms when social publishing was the new, misunderstood technology. Personally built the pages for Campbell's Chunky Soup and Kellogg NutriGrain. Helped define the digital and social support strategy for every Samsung mobile launch from the Galaxy S2 through the Note 4. Built the analytics framework that demonstrated social media as a revenue channel for Delta Air Lines.</p>
      </div>
      <div class="beat">
        <div class="beat-label">Founder &amp; Operator</div>
        <p>Took the playbook independent. Built a marketing agency to <strong>$1M in 14 months</strong> with 9 full-time employees. Built a solar sales organization from <strong>$0 to $3M</strong>. Grew a DTC brand from <strong>$100K to $1.2M</strong>. Each venture required building revenue systems from scratch in industries with no existing playbook.</p>
      </div>
      <div class="beat">
        <div class="beat-label">Enterprise AI Operator</div>
        <p>Currently in customer marketing at a growth-stage, AI-forward B2B software company. Not advising on AI from the outside — operating inside it daily. Top Claude Code user in a 540-person organization. Living inside the tools, building with them, understanding where they work and where they break.</p>
      </div>
      <div class="beat">
        <div class="beat-label">Academic Practitioner</div>
        <p>Professor at the University of Nevada, Reno — College of Business, an R1 research institution. MBA candidate. Teaching while doing. The methodology isn't theoretical — it's refined in real engagements and pressure-tested in academic rigor.</p>
      </div>
      <div class="through-line">
        <p>Every time a new technology emerges — social media, digital marketing, AI — the pattern is the same. Figure out how it <em>generates revenue.</em> Build the system. Teach others to run it.</p>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="cta-inner reveal">
      <div class="cta-label">Let's Talk</div>
      <h2>If your organization is navigating AI adoption and needs a practitioner, not a vendor — let's talk.</h2>
      <a href="#HUBSPOT_MEETING_LINK" class="cta-button-dark">Book a Conversation</a>
      <p class="cta-footnote">Or reach out directly at <a href="mailto:danny@principl.ai">danny@principl.ai</a></p>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-left">principl.ai</div>
    <div class="footer-right"><a href="mailto:danny@principl.ai">danny@principl.ai</a></div>
  </footer>

  <script>
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  </script>
</body>
</html>
```

- [ ] **Step 2: Remove the placeholder homepage.html and verify**

The placeholder created in Task 1 is now replaced by the real file. Verify by opening in browser:

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
bun run server.ts &
sleep 1
open http://localhost:8080
# Verify: homepage loads with all sections
open http://localhost:8080/revenue-residency
# Verify: original waitlist page loads
kill %1
```

- [ ] **Step 3: Commit**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git add homepage.html
git commit -m "feat: add consulting practice homepage"
```

---

### Task 3: Connect HubSpot meeting link

**Files:**
- Modify: `site/homepage.html`

- [ ] **Step 1: Replace placeholder meeting links**

Danny will provide the HubSpot Sales Pro meeting link. Replace both instances of `#HUBSPOT_MEETING_LINK` in `homepage.html`:

1. Hero CTA button (around the `<a href="#HUBSPOT_MEETING_LINK" class="cta-button">` tag)
2. Bottom CTA button (around the `<a href="#HUBSPOT_MEETING_LINK" class="cta-button-dark">` tag)

Both links should open in a new tab:

```html
<a href="https://meetings.hubspot.com/DANNY_SLUG" target="_blank" rel="noopener" class="cta-button">Book a Conversation</a>
```

```html
<a href="https://meetings.hubspot.com/DANNY_SLUG" target="_blank" rel="noopener" class="cta-button-dark">Book a Conversation</a>
```

- [ ] **Step 2: Verify links work**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
bun run server.ts &
sleep 1
open http://localhost:8080
# Click both "Book a Conversation" buttons — verify they open HubSpot meeting page
kill %1
```

- [ ] **Step 3: Commit**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git add homepage.html
git commit -m "feat: connect HubSpot meeting link to CTAs"
```

---

### Task 4: Review copy in Danny's voice and deploy

**Files:**
- Possibly modify: `site/homepage.html` (copy refinements)

- [ ] **Step 1: Full page review**

Open the homepage locally and read through the entire page. Check against Danny's voice rules from CLAUDE.md:
- No banned words (delve, leverage, utilize, game-changer, cutting-edge, seamlessly, robust, unlock)
- No opener that starts with "I"
- Confident without being arrogant
- Specific numbers, not adjectives
- Feels like a person wrote it, not a template

Make any copy adjustments needed.

- [ ] **Step 2: Mobile responsive check**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
bun run server.ts &
sleep 1
open http://localhost:8080
# Resize browser to mobile widths (375px, 768px) and verify layout
kill %1
```

- [ ] **Step 3: Commit any copy changes**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git add homepage.html
git commit -m "polish: refine homepage copy"
```

- [ ] **Step 4: Push and deploy**

```bash
cd /Users/dcox/centered-os/projects/principl-ai/site
git push origin main
```

Railway auto-deploys from the main branch. Verify at https://principl.ai after deploy completes.

- [ ] **Step 5: Verify production**

```bash
curl -s -o /dev/null -w "%{http_code}" https://principl.ai/
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" https://principl.ai/revenue-residency
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" https://principl.ai/health
# Expected: 200
```
