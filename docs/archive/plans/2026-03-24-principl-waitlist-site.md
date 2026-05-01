# principl.ai Waitlist Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page waitlist site at principl.ai that collects Revenue Residency applications into SQLite and notifies Danny via email.

**Architecture:** Single Bun HTTP server with 3 routes (GET /, POST /apply, GET /health). Static HTML page with inline CSS/JS. SQLite for persistence with Railway volume mount. Resend for email notifications.

**Tech Stack:** Bun, TypeScript, SQLite (bun:sqlite), Resend, Docker, Railway

**Spec:** `projects/principl-ai/docs/specs/2026-03-24-principl-waitlist-site-design.md`
**Copy:** `projects/principl-ai/revenue-residency/waitlist/page-copy.md`

---

## File Structure

```
projects/principl-ai/site/
  server.ts        — Bun HTTP server: serves index.html, handles POST /apply, /health
  db.ts            — SQLite init (create table), upsert function, returns isNew boolean
  notify.ts        — sends application email to danny@principl.ai via Resend
  index.html       — full waitlist page: copy, form, inline CSS, inline JS for fetch submit
  Dockerfile       — oven/bun:1, copy files, expose 8080, run server.ts
  railway.toml     — healthcheck config
  package.json     — name, dependencies (resend), scripts (start)
  .gitignore       — node_modules, *.db
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `projects/principl-ai/site/package.json`
- Create: `projects/principl-ai/site/.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "principl-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "bun server.ts",
    "dev": "bun --watch server.ts"
  },
  "dependencies": {
    "resend": "^6.9.3"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
*.db
```

- [ ] **Step 3: Install dependencies**

Run: `cd projects/principl-ai/site && bun install`
Expected: `bun.lock` is generated, `node_modules/` created.

- [ ] **Step 4: Init git repo**

Run:
```bash
cd projects/principl-ai/site
git init
git add .
git commit -m "chore: init principl-ai site scaffold"
```

---

### Task 2: Database Layer

**Files:**
- Create: `projects/principl-ai/site/db.ts`

- [ ] **Step 1: Write db.ts**

```typescript
import { Database } from "bun:sqlite";

const DB_PATH = process.env.DB_PATH ?? "./principl.db";

let db: Database;

export function initDb(): void {
  db = new Database(DB_PATH);
  db.run("PRAGMA journal_mode = WAL");
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      revenue TEXT NOT NULL,
      fix_first TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    )
  `);
}

export interface Application {
  name: string;
  email: string;
  revenue: string;
  fix_first: string;
}

export interface UpsertResult {
  isNew: boolean;
}

export function upsertApplication(app: Application): UpsertResult {
  const existing = db
    .query("SELECT id FROM applications WHERE email = ?")
    .get(app.email);

  if (existing) {
    db.run(
      `UPDATE applications SET name = ?, revenue = ?, fix_first = ?, updated_at = datetime('now') WHERE email = ?`,
      [app.name, app.revenue, app.fix_first, app.email]
    );
    return { isNew: false };
  }

  db.run(
    `INSERT INTO applications (name, email, revenue, fix_first) VALUES (?, ?, ?, ?)`,
    [app.name, app.email, app.revenue, app.fix_first]
  );
  return { isNew: true };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd projects/principl-ai/site && bun build db.ts --no-bundle`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add db.ts
git commit -m "feat: add SQLite database layer with upsert"
```

---

### Task 3: Email Notification

**Files:**
- Create: `projects/principl-ai/site/notify.ts`

- [ ] **Step 1: Write notify.ts**

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NotifyPayload {
  name: string;
  email: string;
  revenue: string;
  fix_first: string;
}

export async function notifyNewApplication(app: NotifyPayload): Promise<void> {
  try {
    await resend.emails.send({
      from: "principl.ai <notifications@principl.ai>",
      to: "danny@principl.ai",
      subject: `New Revenue Residency Application: ${app.name}`,
      text: [
        `Name: ${app.name}`,
        `Email: ${app.email}`,
        `Revenue: ${app.revenue}`,
        `Would fix first: ${app.fix_first}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd projects/principl-ai/site && bun build notify.ts --no-bundle`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add notify.ts
git commit -m "feat: add Resend email notification for applications"
```

---

### Task 4: HTTP Server

**Files:**
- Create: `projects/principl-ai/site/server.ts`

- [ ] **Step 1: Write server.ts**

```typescript
import { initDb, upsertApplication, type Application } from "./db.ts";
import { notifyNewApplication } from "./notify.ts";

initDb();

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
    const { isNew } = upsertApplication(app);
    if (isNew) {
      notifyNewApplication(app);
    }
    return jsonResponse({ ok: true });
  } catch (err) {
    console.error("[server] Database error:", err);
    return jsonResponse({ ok: false, error: "Server error" }, 500);
  }
}

const indexHtml = await Bun.file(
  new URL("./index.html", import.meta.url).pathname
).text();

const server = Bun.serve({
  port: Number(process.env.PORT ?? 8080),

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/health") return new Response("ok");

    if (path === "/" && req.method === "GET") {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
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

- [ ] **Step 2: Test server starts**

Run: `cd projects/principl-ai/site && echo '<html><body>placeholder</body></html>' > index.html && bun server.ts &`

Then: `curl http://localhost:8080/health`
Expected: `ok`

Then: `curl -X POST http://localhost:8080/apply -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","revenue":"500K","fix_first":"Pipeline"}'`
Expected: `{"ok":true}`

Kill the server after testing.

- [ ] **Step 3: Commit**

```bash
git add server.ts
git commit -m "feat: add HTTP server with routes"
```

---

### Task 5: HTML Page

**Files:**
- Create: `projects/principl-ai/site/index.html`

This is the largest task. The page includes all copy from `page-copy.md`, the application form, inline CSS for visual design, and inline JS for form submission.

- [ ] **Step 1: Write index.html**

Copy source: `projects/principl-ai/revenue-residency/waitlist/page-copy.md`

Key implementation notes:
- All CSS inline in a `<style>` tag in `<head>`
- Visual design: off-white background (`#fafaf9`), dark text (`#1a1a1a`), system font stack, max-width 640px centered, generous line-height (1.7)
- Section dividers via margin/padding, no `<hr>` tags
- Form fields: full-width inputs with subtle borders, textarea for the "fix first" question
- Submit button: solid dark background, white text, no hover animation needed
- Inline `<script>` at bottom: intercepts form submit, posts JSON via fetch, replaces form with confirmation message on success, shows error inline on failure
- No external fonts, no external scripts, no external CSS
- `<meta name="viewport" content="width=device-width, initial-scale=1">` for mobile
- `<title>principl.ai — Revenue Residency</title>`
- No em dashes anywhere in the copy (Danny's preference)

The form HTML structure:

```html
<form id="apply-form">
  <input type="text" name="name" placeholder="Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="text" name="revenue" placeholder="Current annual revenue (approximate)" required>
  <textarea name="fix_first" placeholder="What's the one thing in your business you'd fix first if you knew exactly how?" rows="4" required></textarea>
  <button type="submit">Apply for Cohort 1</button>
</form>
<div id="confirmation" style="display:none">
  <p>Got it. We'll follow up within a few days. If it's a fit, we'll talk. If it's not, we'll tell you that too.</p>
</div>
```

The inline JS:

```javascript
document.getElementById('apply-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const fd = new FormData(form);
  const data = {
    name: fd.get('name').trim(),
    email: fd.get('email').trim(),
    revenue: fd.get('revenue').trim(),
    fix_first: fd.get('fix_first').trim(),
  };

  try {
    const res = await fetch('/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.ok) {
      form.style.display = 'none';
      document.getElementById('confirmation').style.display = 'block';
    } else {
      btn.disabled = false;
      btn.textContent = 'Apply for Cohort 1';
      alert(json.error || 'Something went wrong. Please try again.');
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Apply for Cohort 1';
    alert('Something went wrong. Please try again.');
  }
});
```

- [ ] **Step 2: Test locally end-to-end**

Run: `cd projects/principl-ai/site && bun server.ts`

Open `http://localhost:8080` in a browser. Verify:
1. Page loads with all 5 copy sections
2. Visual design is light, clean, readable on desktop and mobile
3. Form submits without page reload
4. Confirmation message appears after submit
5. Check `principl.db` has the row: `sqlite3 principl.db "SELECT * FROM applications;"`

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add waitlist page with copy, form, and inline styles"
```

---

### Task 6: Docker + Railway Config

**Files:**
- Create: `projects/principl-ai/site/Dockerfile`
- Create: `projects/principl-ai/site/railway.toml`

- [ ] **Step 1: Write Dockerfile**

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY server.ts db.ts notify.ts index.html ./

EXPOSE 8080

CMD ["bun", "server.ts"]
```

- [ ] **Step 2: Write railway.toml**

```toml
[build]
  dockerfilePath = "Dockerfile"

[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 60
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 3
```

- [ ] **Step 3: Test Docker build locally**

Run:
```bash
cd projects/principl-ai/site
docker build -t principl-ai .
docker run -p 8080:8080 -e DB_PATH=/data/principl.db -v $(pwd)/data:/data principl-ai
```

Open `http://localhost:8080`, verify page loads and form works.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile railway.toml
git commit -m "feat: add Dockerfile and Railway config"
```

---

### Task 7: Deploy to Railway

**Files:** None (infrastructure only)

- [ ] **Step 1: Push to GitHub**

Repo already created at `https://github.com/centeredmktg/principl-ai.git`.

Run:
```bash
cd projects/principl-ai/site
git remote add origin https://github.com/centeredmktg/principl-ai.git
git push -u origin main
```

- [ ] **Step 2: Create Railway service**

In Railway dashboard:
1. Create new project
2. Connect to the GitHub repo
3. Add environment variables: `RESEND_API_KEY`, `DB_PATH=/data/principl.db`
4. Add a volume, mount at `/data`
5. Deploy

- [ ] **Step 3: Configure custom domain**

In Railway service settings:
1. Add custom domain: `principl.ai`
2. Railway will provide DNS records (CNAME or A record)
3. Update DNS at your domain registrar to point to Railway

- [ ] **Step 4: Verify production**

1. Visit `https://principl.ai` — page loads
2. Submit a test application — confirmation appears
3. Check danny@principl.ai for the notification email
4. Redeploy to verify volume persistence (data survives)

- [ ] **Step 5: Commit any final tweaks and tag**

```bash
git tag v0.1.0
git push --tags
```

---

### Task Summary

| Task | What | Depends On |
|------|------|------------|
| 1 | Project scaffold (package.json, git init) | — |
| 2 | Database layer (db.ts) | 1 |
| 3 | Email notification (notify.ts) | 1 |
| 4 | HTTP server (server.ts) | 2, 3 |
| 5 | HTML page (index.html) | 4 |
| 6 | Docker + Railway config | 5 |
| 7 | Deploy to Railway | 6 |

Tasks 2 and 3 can run in parallel.
