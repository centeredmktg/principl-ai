# /work Proof Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a `/work` page on principl.ai that de-abstracts what Danny does — six real systems organized into two bands (built-first vs. commissioned) that argue the "continuous improvement engineer" thesis.

**Architecture:** New self-contained `work.html` reusing the existing standalone-page chrome (head/`<style>`/nav from `studio-os.html`). Served by the Bun server via a new route. Cards are static; visuals default to a CSS-stylized tile and accept a real screenshot via `<img>` swap, so the page ships complete with zero image assets and real captures drop in later without rework.

**Tech Stack:** Bun (`Bun.serve`), hand-written HTML/CSS (inline `<style>`, no framework/CMS), Docker (Railway), shared design tokens from `studio-os.html`.

## Global Constraints

- **Design tokens:** Reuse principl's existing tokens (`--blueprint`, `--cream`, `--accent: #C8541F`, Geist / Instrument Serif). Do NOT introduce the Centered green `#226b03` — that's a different brand.
- **Naming rules (per spec):** Capability-first titles. Genericize Sixth City → "a B2B agency client"; no DSCRme/Host branding on the pricing tile ("a DSCR lending lab"); Rich Eisen IS nameable (JV). No private customer names beyond what's listed.
- **Banned words in all copy:** delve, leverage (verb), utilize, game-changer, cutting-edge, seamlessly, robust, unlock (metaphor), "In today's fast-paced world." No copy opener starting with "I".
- **COPY allowlist landmine:** Every new top-level HTML file AND every new directory must be added to the `Dockerfile` COPY line explicitly, or it 404s on prod while working locally.
- **Server wiring:** Every new HTML page needs all three: `loadPage(...)` call, a `GET` route in `Bun.serve`, and the Dockerfile COPY entry.
- **Git discipline:** Work on branch `feat/work-proof-page` (already created). Never push to main; open a PR. Verify commits with `git log origin/main..HEAD --oneline` before any push. Local review before any Railway deploy.
- **`[CONFIRM]` markers:** Proof numbers flagged `[CONFIRM]` are Danny's to fill before deploy — leave the placeholder text in place; do not invent numbers.

---

### Task 1: Walking skeleton — routable `/work` page with chrome + thesis

Deliverable: `curl localhost:8080/work` returns 200 and contains the thesis line, served with the full site chrome.

**Files:**
- Create: `work.html`
- Modify: `server.ts` (add `loadPage` + route)
- Modify: `Dockerfile` (COPY allowlist)

**Interfaces:**
- Produces: route `GET /work` → `work.html`; CSS class namespace `.proof-*` (defined in Task 2).

- [ ] **Step 1: Scaffold `work.html` from existing chrome**

Copy lines `1`–`595` of `studio-os.html` (the `<!doctype html>` through the closing `</div>` of `.nav-shell`, i.e. head + full `<style>` + nav) into a new `work.html`. Then apply these head deltas (replace the studio-os values):

```html
  <title>Work · Systems I've built — principl.ai</title>
  <meta name="description" content="Real systems, not slides about them. Automated pricing, ICP-matched pipeline, transcript-to-edit, hiring sites, multi-exec publishing, commerce engines — built by an operator." />
  <meta property="og:title" content="Work · Systems I've built — principl.ai" />
  <meta property="og:description" content="Real systems, not slides about them. Built by a continuous improvement engineer." />
  <meta property="og:url" content="https://principl.ai/work" />
  <meta name="twitter:title" content="Work · Systems I've built — principl.ai" />
  <meta name="twitter:description" content="Real systems, not slides about them." />
```

In the copied nav, replace the `nav-tag` line:

```html
        <span class="nav-tag">Work · Systems, not slides</span>
```

- [ ] **Step 2: Add the thesis hero + body skeleton + footer to `work.html`**

After the `.nav-shell` closing `</div>`, append the body skeleton (band sections filled in Tasks 2–3) and footer, then `</body></html>`:

```html
  <section class="hero hero--work">
    <div class="hero__grid"></div>
    <div class="container">
      <span class="eyebrow"><span class="eyebrow__num">§ 01 /</span> The work</span>
      <h1 class="hero__headline" style="margin-top: var(--s-5);">Real systems. <em>Not slides about them.</em></h1>
      <p class="t-lead" style="margin-top: var(--s-6); max-width: 60ch;">I build systems that solve problems, then find the people who have them. Increasingly, they find me first.</p>
    </div>
  </section>

  <section class="proof" id="proof">
    <div class="container">
      <!-- BAND 1 inserted in Task 2 -->
      <!-- BAND 2 + close inserted in Task 3 -->
    </div>
  </section>

  <section class="cta" id="cta">
    <div class="cta__grid"></div>
    <div class="container">
      <span class="eyebrow" style="color: var(--on-dark-muted);"><span class="eyebrow__num" style="color: var(--accent);">§ 03 /</span> How to start</span>
      <h2 class="cta__head" style="margin-top: var(--s-5);">Have a problem in front of you? <em>Let's build for it.</em></h2>
      <p class="cta__lede">The work I want more of is the second kind — someone brings the problem, we build the system. A 30-minute intro tells us if there's a fit.</p>
      <div class="cta__row">
        <a href="https://meetings.hubspot.com/danny482" class="btn btn--blueprint btn--lg">Book the 30-min intro <span class="btn__arrow">→</span></a>
        <span class="cta__email">Or directly — <a href="mailto:danny@principl.ai">danny@principl.ai</a></span>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer__row">
      <a href="/" class="wordmark wordmark--lg">principl<span class="wordmark__dot"></span></a>
      <span class="footer__legal">Work · Systems, not slides · 2026</span>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 3: Wire the route in `server.ts`**

After the line `const studioOsHtml = await loadPage("studio-os.html");` add:

```typescript
const workHtml = await loadPage("work.html");
```

After the `/studio-os` route block, add:

```typescript
    if (path === "/work" && req.method === "GET") {
      return htmlResponse(req, workHtml);
    }
```

- [ ] **Step 4: Add `work.html` to the Dockerfile COPY allowlist**

In `Dockerfile`, edit the `COPY server.ts db.ts ...` line to include `work.html` (place it after `studio-os.html`):

```dockerfile
COPY server.ts db.ts notify.ts homepage.html revenue-residency.html mid-market-tech.html studio-os.html work.html colorado-plastic-surgery.html headshot.jpg og.png ./
```

- [ ] **Step 5: Run the server and verify the route**

Run: `bun server.ts &` then `sleep 1 && curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/work`
Expected: `200`

Run: `curl -s localhost:8080/work | grep -c "find the people who have them"`
Expected: `1` (thesis line present)

Run: `curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/studio-os` (regression check)
Expected: `200`

Then stop the server: `kill %1`

- [ ] **Step 6: Commit**

```bash
git add work.html server.ts Dockerfile
git commit -m "feat(work): routable /work page with chrome + thesis hero"
```

---

### Task 2: Card system CSS + Band 1 (four built-first cards)

Deliverable: `/work` renders the "Built before anyone asked" band — four cards in a responsive 2-col grid (1-col mobile), each with a stylized visual, capability title, and Challenge/System/Result lines.

**Files:**
- Modify: `work.html` (add `.proof-*` CSS to `<style>`; insert Band 1 HTML)

**Interfaces:**
- Consumes: `GET /work` route, `.proof` section container (Task 1).
- Produces: `.proof-card` markup pattern (reused verbatim in Task 3); `.proof-card__visual` accepts an optional `<img>` for screenshot swap.

- [ ] **Step 1: Add card-system CSS**

Insert before the closing `</style>` in `work.html`:

```css
    /* ---- /work proof page ---- */
    .hero--work { padding-bottom: var(--s-8); }
    .proof { padding-block: var(--s-8) var(--s-9); }
    .proof-band { margin-top: var(--s-9); }
    .proof-band:first-of-type { margin-top: var(--s-7); }
    .proof-band__head { display: flex; align-items: baseline; gap: var(--s-4); flex-wrap: wrap; margin-bottom: var(--s-6); }
    .proof-band__title { font-size: var(--t-h2); letter-spacing: var(--tk-h); font-weight: 500; margin: 0; }
    .proof-band__note { font-family: var(--font-mono); font-size: var(--t-mono); letter-spacing: var(--tk-mono); text-transform: uppercase; color: var(--ink-50); }
    .proof-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--s-6); }
    @media (max-width: 760px) { .proof-grid { grid-template-columns: 1fr; } }
    .proof-card { border: 1px solid var(--rule-soft); background: var(--surface); border-radius: var(--r-2); overflow: hidden; display: flex; flex-direction: column; }
    .proof-card__visual { aspect-ratio: 16 / 10; background: var(--blueprint-deep); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .proof-card__visual::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(244,239,227,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,227,0.06) 1px, transparent 1px); background-size: 28px 28px; }
    .proof-card__viz-label { position: relative; z-index: 1; font-family: var(--font-mono); font-size: var(--t-small); letter-spacing: var(--tk-mono); text-transform: lowercase; color: var(--on-dark-muted); padding: 0 var(--s-5); text-align: center; }
    .proof-card__visual img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; z-index: 2; }
    .proof-card__body { padding: var(--s-6); }
    .proof-card__title { font-size: 1.25rem; letter-spacing: var(--tk-h); font-weight: 500; margin: 0; }
    .proof-card__meta { font-family: var(--font-mono); font-size: var(--t-micro); letter-spacing: var(--tk-mono); text-transform: uppercase; color: var(--ink-50); margin: var(--s-2) 0 var(--s-5); }
    .proof-card__lines { margin: 0; display: grid; gap: var(--s-4); }
    .proof-card__lines > div { display: grid; grid-template-columns: 92px 1fr; gap: var(--s-4); align-items: start; }
    .proof-card__lines dt { font-family: var(--font-mono); font-size: var(--t-micro); letter-spacing: var(--tk-caps); text-transform: uppercase; color: var(--accent); margin: 0; padding-top: 2px; }
    .proof-card__lines dd { margin: 0; font-size: var(--t-small); color: var(--ink-70); line-height: 1.5; }
    @media (max-width: 460px) { .proof-card__lines > div { grid-template-columns: 1fr; gap: var(--s-1); } }
```

- [ ] **Step 2: Insert Band 1 HTML**

Replace the `<!-- BAND 1 inserted in Task 2 -->` comment in `work.html` with:

```html
      <div class="proof-band">
        <div class="proof-band__head">
          <h2 class="proof-band__title">Built before anyone asked.</h2>
          <span class="proof-band__note">— the engineer instinct</span>
        </div>
        <div class="proof-grid">

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">automated loan pricing engine</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">Automated loan pricing engine</h3>
              <p class="proof-card__meta">Built in a DSCR lending lab</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>A lender priced every deal by hand — analyst time, inconsistent terms, slow turnarounds.</dd></div>
                <div><dt>System</dt><dd>Borrower intake flows into a pricing matrix that returns rate, terms, and a draft term sheet with no analyst in the loop.</dd></div>
                <div><dt>Result</dt><dd>A ~10K-line production app pricing real deals. Built speculatively — now finding its buyer.</dd></div>
              </dl>
            </div>
          </article>

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">candidate marketing-site generator</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">Candidate marketing-site generator</h3>
              <p class="proof-card__meta">You Should Hire</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>A strong candidate looks like one more PDF résumé in a stack.</dd></div>
                <div><dt>System</dt><dd>Turns a candidate into a branded pitch site — company visuals, candidate voice, pain-first positioning.</dd></div>
                <div><dt>Result</dt><dd>First candidate live. [CONFIRM: name or keep generic]</dd></div>
              </dl>
            </div>
          </article>

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">transcript-to-edit highlight engine</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">Transcript-to-edit highlight engine</h3>
              <p class="proof-card__meta">Premiere pipeline</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>Hours of multicam footage, manual hunt for the moments worth keeping.</dd></div>
                <div><dt>System</dt><dd>Transcribes the call, detects highlight moments, exports markers straight into the Premiere timeline.</dd></div>
                <div><dt>Result</dt><dd>First-pass edit hunt cut from hours to [CONFIRM: minutes].</dd></div>
              </dl>
            </div>
          </article>

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">multi-exec publishing pipeline</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">Multi-exec LinkedIn pipeline, approved in Slack</h3>
              <p class="proof-card__meta">Exec content engine</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>Execs want a presence but won't touch a CMS.</dd></div>
                <div><dt>System</dt><dd>Drafts run through Slack for one-tap review and approval, then publish — multi-tenant across execs.</dd></div>
                <div><dt>Result</dt><dd>POC live, first post published.</dd></div>
              </dl>
            </div>
          </article>

        </div>
      </div>
```

- [ ] **Step 3: Run the server and verify Band 1 renders**

Run: `bun server.ts &` then `sleep 1`
Run: `curl -s localhost:8080/work | grep -c "proof-card"`
Expected: `4` (four cards present)

Run: `curl -s localhost:8080/work | grep -c "Built before anyone asked"`
Expected: `1`

Open `http://localhost:8080/work` in a browser and confirm: 2-col grid on desktop, cards stack to 1-col when narrowed, stylized blueprint visuals show the lowercase labels, Challenge/System/Result rows align. Then `kill %1`.

- [ ] **Step 4: Commit**

```bash
git add work.html
git commit -m "feat(work): card system + Band 1 (built-first systems)"
```

---

### Task 3: Band 2 (commissioned) + preferred-mode close

Deliverable: `/work` renders the "Built for the problem in front of me" band (two cards) plus a one-line close that hands off to the CTA.

**Files:**
- Modify: `work.html` (insert Band 2 HTML; reuses `.proof-*` CSS from Task 2)

**Interfaces:**
- Consumes: `.proof-card` / `.proof-band` markup + CSS (Task 2).

- [ ] **Step 1: Insert Band 2 HTML + close**

Replace the `<!-- BAND 2 + close inserted in Task 3 -->` comment in `work.html` with:

```html
      <div class="proof-band">
        <div class="proof-band__head">
          <h2 class="proof-band__title">Built for the problem in front of me.</h2>
          <span class="proof-band__note">— the work I want more of</span>
        </div>
        <div class="proof-grid">

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">icp-matched pipeline + message generator</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">ICP-matched pipeline + per-account message generator</h3>
              <p class="proof-card__meta">For a B2B agency client</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>Generic outbound to a vague audience.</dd></div>
                <div><dt>System</dt><dd>Scores accounts against a defined ICP, then generates a unique value-prop message per account from that account's own signals.</dd></div>
                <div><dt>Result</dt><dd>Running against live lead flow. [CONFIRM: any volume number]</dd></div>
              </dl>
            </div>
          </article>

          <article class="proof-card" data-video="">
            <div class="proof-card__visual"><span class="proof-card__viz-label">rich eisen show merch engine</span></div>
            <div class="proof-card__body">
              <h3 class="proof-card__title">Rich Eisen Show merch engine</h3>
              <p class="proof-card__meta">JV with element23</p>
              <dl class="proof-card__lines">
                <div><dt>Challenge</dt><dd>A show audience with no real commerce engine behind it.</dd></div>
                <div><dt>System</dt><dd>Shopify storefront reskin, a WordPress content engine, and a YouTube-to-product pipeline.</dd></div>
                <div><dt>Result</dt><dd>Live store on a $1.2M YouTube business. [CONFIRM: any number OK to publish]</dd></div>
              </dl>
            </div>
          </article>

        </div>
        <p class="t-lead" style="margin-top: var(--s-7); max-width: 56ch;">The second kind is the work I want more of. <em class="italic">If that's you, the door's below.</em></p>
      </div>
```

- [ ] **Step 2: Run the server and verify all six cards render**

Run: `bun server.ts &` then `sleep 1`
Run: `curl -s localhost:8080/work | grep -c "proof-card"`
Expected: `6`

Run: `curl -s localhost:8080/work | grep -c "Built for the problem in front of me"`
Expected: `1`

Browser check `http://localhost:8080/work`: both bands present, six cards total, close line reads correctly above the CTA. Then `kill %1`.

- [ ] **Step 3: Commit**

```bash
git add work.html
git commit -m "feat(work): Band 2 (commissioned systems) + preferred-mode close"
```

---

### Task 4: Homepage teaser link into the §03 work section

Deliverable: the homepage's existing §03 "How we work" (Seven Operational Gates) section gains a link to `/work` — preserving the gates content, adding a path to the proof page.

**Files:**
- Modify: `homepage.html` (inside `.work__pull`, after its `<p>`)

**Interfaces:**
- Consumes: existing `/work` route (Task 1).

> NOTE: This supersedes the spec's "replace the work section with a teaser." The §03 section is the Seven Operational Gates methodology — load-bearing positioning. We ADD a link, we do not remove the gates.

- [ ] **Step 1: Add the link inside `.work__pull`**

In `homepage.html`, find the `.work__pull` block (the `<h3>You own the decisions...` / `<p>The through-line...</p>`). Immediately after that closing `</p>` and before the `</div>` that closes `.work__pull`, insert:

```html
        <p style="margin-top: var(--s-6);"><a href="/work" class="link-arrow">See the systems I've built <span class="btn__arrow">→</span></a></p>
```

- [ ] **Step 2: Verify the `link-arrow` style exists or add a minimal one**

Run: `grep -c "link-arrow" homepage.html`

If the result is `1` (only the new usage, no CSS rule), add a minimal rule before `</style>` in `homepage.html`:

```css
    .link-arrow { color: var(--accent); font-family: var(--font-mono); font-size: var(--t-mono); letter-spacing: var(--tk-mono); text-transform: uppercase; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
```

If the result is `2` or more, the class already has a rule — skip adding CSS.

- [ ] **Step 3: Run the server and verify the link**

Run: `bun server.ts &` then `sleep 1`
Run: `curl -s localhost:8080/ | grep -c 'href="/work"'`
Expected: `1`

Run: `curl -s localhost:8080/ | grep -c "Seven Operational Gates"` (regression — gates content still present)
Expected: `1`

Then `kill %1`.

- [ ] **Step 4: Commit**

```bash
git add homepage.html
git commit -m "feat(home): link §03 into the /work proof page"
```

---

### Task 5: Capture & swap the two reachable screenshots

Deliverable: real screenshots for the pricing engine and Rich Eisen store replace their stylized tiles; `assets/work/` is created and added to the Dockerfile COPY allowlist. The other four cards keep their stylized tiles until frames arrive.

**Files:**
- Create: `assets/work/pricing-engine.png`, `assets/work/rich-eisen.png`
- Modify: `work.html` (add `<img>` inside the two cards' `.proof-card__visual`)
- Modify: `Dockerfile` (COPY allowlist for `assets`)

**Interfaces:**
- Consumes: `.proof-card__visual img` CSS rule (Task 2) — img is absolutely positioned to cover the stylized default.

> NOTE: This task depends on capturing live UIs (browser automation) and is the one task that may be deferred or done iteratively. The page is fully shippable WITHOUT it (all-stylized). Do this when captures are available. Premiere (tile 3) frame may come from Danny's CPS meeting 2026-06-30 — same swap pattern applies, add `assets/work/premiere.png` and an `<img>` to that card when it arrives.

- [ ] **Step 1: Create the assets directory**

Run: `mkdir -p assets/work`

- [ ] **Step 2: Capture the pricing engine and Rich Eisen store**

Capture each live UI (browser screenshot tool), crop to a consistent ~16:10 frame. For the pricing engine, crop or redact any DSCRme/Host branding per the naming rules. Save as:
- `assets/work/pricing-engine.png`
- `assets/work/rich-eisen.png`

Run: `ls -1 assets/work/`
Expected: both files listed.

- [ ] **Step 3: Add the `<img>` swap to both cards**

In `work.html`, in the pricing-engine card's visual, change:

```html
            <div class="proof-card__visual"><span class="proof-card__viz-label">automated loan pricing engine</span></div>
```
to:
```html
            <div class="proof-card__visual"><span class="proof-card__viz-label">automated loan pricing engine</span><img src="/assets/work/pricing-engine.png" alt="Automated loan pricing engine interface" loading="lazy" /></div>
```

In the Rich Eisen card's visual, change:

```html
            <div class="proof-card__visual"><span class="proof-card__viz-label">rich eisen show merch engine</span></div>
```
to:
```html
            <div class="proof-card__visual"><span class="proof-card__viz-label">rich eisen show merch engine</span><img src="/assets/work/rich-eisen.png" alt="Rich Eisen Show store" loading="lazy" /></div>
```

- [ ] **Step 4: Serve the assets directory in `server.ts`**

Static files are currently served per-path. Add a generic handler for `/assets/work/*.png` after the `/og.png` route block in `server.ts`:

```typescript
    if (path.startsWith("/assets/work/") && path.endsWith(".png") && req.method === "GET") {
      const filename = path.slice("/assets/work/".length);
      if (/^[a-z0-9-]+\.png$/.test(filename)) {
        const file = Bun.file(new URL(`./assets/work/${filename}`, import.meta.url).pathname);
        if (await file.exists()) {
          return new Response(file, {
            headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
          });
        }
      }
      return new Response("Not found", { status: 404 });
    }
```

- [ ] **Step 5: Add `assets` to the Dockerfile COPY allowlist**

In `Dockerfile`, after the `COPY partials ./partials` line, add:

```dockerfile
COPY assets ./assets
```

- [ ] **Step 6: Run the server and verify the images load**

Run: `bun server.ts &` then `sleep 1`
Run: `curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/assets/work/pricing-engine.png`
Expected: `200`

Run: `curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/assets/work/rich-eisen.png`
Expected: `200`

Run: `curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/assets/work/../../server.ts` (path-traversal guard)
Expected: `404`

Browser check `http://localhost:8080/work`: the two cards show real screenshots; the other four still show stylized tiles. Then `kill %1`.

- [ ] **Step 7: Commit**

```bash
git add work.html server.ts Dockerfile assets/work/
git commit -m "feat(work): swap in real captures for pricing engine + Rich Eisen"
```

---

## Pre-deploy checklist (run before opening the PR / Railway deploy)

- [ ] All `[CONFIRM]` placeholders resolved with Danny (Premiere minutes, YSH naming, ICP volume, Rich Eisen number).
- [ ] `grep -nE "delve|leverage|utilize|game-changer|cutting-edge|seamlessly|robust|unlock" work.html` returns nothing.
- [ ] `Dockerfile` COPY line includes `work.html` and the `COPY assets ./assets` line exists (if Task 5 done).
- [ ] `git log origin/main..HEAD --oneline` shows all task commits.
- [ ] Local browser review of `/work`, `/` (teaser link), and a regression glance at `/studio-os`.
- [ ] Open PR — do NOT push to main directly.

---

## Self-Review

**Spec coverage:**
- Dedicated `/work` page → Task 1 ✓
- Homepage teaser/link → Task 4 ✓ (revised from "replace" to "add" — section is load-bearing; flagged)
- Two-band layout, capability-first naming, genericized clients, Rich Eisen named → Tasks 2–3 ✓
- Static cards, reserved video slot (`data-video=""`) → Tasks 2–3 ✓
- Stylized-default visuals + screenshot swap → Tasks 2, 5 ✓
- Asset capture (reachable two) + `assets/work/` + Dockerfile allowlist → Task 5 ✓
- DSCRme genericized, no Host branding → Task 2 card copy ✓
- Dockerfile COPY landmine, branch/PR, local-review-before-deploy → Global Constraints + pre-deploy checklist ✓
- `[CONFIRM]` proof numbers left to Danny → card copy + checklist ✓

**Placeholder scan:** The only intentional placeholders are the `[CONFIRM:...]` proof numbers — these are Danny's inputs by design, called out in Global Constraints and the pre-deploy checklist, not engineering gaps. No "TODO/implement later" steps; every code step shows real code.

**Type/name consistency:** CSS classes `.proof-card`, `.proof-card__visual`, `.proof-card__viz-label`, `.proof-card__body`, `.proof-card__title`, `.proof-card__meta`, `.proof-card__lines`, `.proof-band`, `.proof-band__title`, `.proof-band__note` defined in Task 2 and reused identically in Tasks 3 and 5. Route string `/work` and `loadPage("work.html")` / `workHtml` consistent across Task 1. Asset paths `/assets/work/*.png` consistent between Task 5 markup and server handler.
