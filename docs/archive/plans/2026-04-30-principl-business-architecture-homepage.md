# principl.ai Business Architecture Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `projects/principl-ai/site/homepage.html` to reflect the broader business architecture practice frame established in the design spec at `docs/specs/2026-04-29-principl-business-architecture-homepage-design.md`. Single-file rewrite, no server or routing changes.

**Architecture:** Single-file edit. The existing HTML structure (header, hero, breakout, three content sections, practitioner section, CTA, footer) is mostly preserved. Copy is rewritten section by section. One new section ("Programs") is added between the practitioner section and the CTA. Visual system, design tokens, and CSS layout remain unchanged. A small CSS addition for inline anchor styling inside `.section-content` is the only style change.

**Tech Stack:** Bun (server), vanilla HTML/CSS (no framework), inline styles in `homepage.html`. Local dev via `bun run` from `projects/principl-ai/site/`. Deploy via Railway (per project conventions, do NOT redeploy for text changes — Railway picks up automatically on push to main).

---

## File Structure

- **Modify:** `projects/principl-ai/site/homepage.html` (entire copy rewrite + one new section + minor CSS addition)

That is the only file changed. `server.ts`, `db.ts`, `notify.ts`, `revenue-residency.html`, `mid-market-tech.html` are all unchanged.

## Verification Approach

There are no automated tests for the HTML pages in this project. Verification at each step is visual:

1. Run the dev server: `cd projects/principl-ai/site && bun run server.ts`
2. Open `http://localhost:8080` in a browser
3. Visually confirm the change renders correctly and the section structure is intact
4. Confirm no broken layout (especially after adding the new Programs section)

Per Danny's standing rule (`feedback_deploy_discipline.md` in memory): always review locally before Railway deploy. Railway picks up changes from `main` automatically. Do NOT manually redeploy for text changes.

## Commit Strategy

Each task produces its own commit using conventional-commit format with `principl` as the scope. Example: `feat(principl): rewrite homepage hero for business architecture frame`. Frequent atomic commits over one large commit. Co-author trailer per project convention.

---

## Task 1: Update `<head>` (title and meta description)

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (line 6 title, line 7 meta description)

- [ ] **Step 1: Update the `<title>` tag**

Find:
```html
<title>principl.ai — Digital Transformation & AI Advisory</title>
```

Replace with:
```html
<title>principl.ai — Business Architecture Practice</title>
```

- [ ] **Step 2: Update the meta description**

Find:
```html
<meta name="description" content="Principl helps organizations move from AI experimentation to infrastructure. First-principles methodology, not vendor recommendations. Led by Danny Cox.">
```

Replace with:
```html
<meta name="description" content="Principl is a business architecture practice. We design and install the operating system that runs your business. First-principles methodology, not vendor recommendations. Led by Danny Cox.">
```

- [ ] **Step 3: Verify locally**

Run: `cd projects/principl-ai/site && bun run server.ts`
Open: `http://localhost:8080` in browser
Check: Browser tab shows new title. View source confirms new meta description. Page itself unchanged at this point.
Stop server (Ctrl+C) before next task.

- [ ] **Step 4: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update homepage title and meta for business architecture frame

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Update header tagline

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (line 558)

- [ ] **Step 1: Update the header rule div**

Find:
```html
<div class="header-rule">Digital Transformation & AI Advisory</div>
```

Replace with:
```html
<div class="header-rule">Business Architecture Practice</div>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, confirm the right-side header text reads "Business Architecture Practice". Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update homepage header tagline to business architecture practice

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Rewrite hero section

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (lines 562-571)

This task replaces the hero eyebrow, headline, and body copy. The CTA button and Calendly/HubSpot link stay unchanged. The `<section>`, `<div>`, and animation classes stay unchanged.

- [ ] **Step 1: Replace the entire `<section class="hero">` block**

Find:
```html
  <!-- Hero -->
  <section class="hero">
    <div class="hero-label">Digital Transformation & AI Advisory</div>
    <h1>AI adoption isn't a technology problem. It's an <em>operations</em> problem.</h1>
    <div class="hero-body">
      <p>Every organization recognizes AI's potential. Most don't know where to start, and the ones that do are usually starting in the wrong place.</p>
      <p>Leadership says "we need to be using AI" and what follows is predictable: tool purchases without a rollout plan, fractured pilot programs, teams experimenting in isolation, and a growing sense that everyone else has figured this out already.</p>
      <p><strong>The gap isn't awareness, it's methodology.</strong> Principl helps organizations move from experimentation to infrastructure with a first-principles approach that connects AI adoption to the systems, workflows, and revenue motions that already exist.</p>
      <a href="https://meetings.hubspot.com/danny482" target="_blank" rel="noopener" class="cta-button">Book a Conversation</a>
    </div>
  </section>
```

Replace with:
```html
  <!-- Hero -->
  <section class="hero">
    <div class="hero-label">Business Architecture Practice</div>
    <h1>Most businesses don't have an <em>operating system.</em> They have eight systems patched together with tribal knowledge.</h1>
    <div class="hero-body">
      <p>Tools layered on tools, departments running on inherited assumptions, integration debt that hides until growth exposes it, and no single source of truth, just a collection of dashboards everyone has agreed not to compare.</p>
      <p>The gap isn't software, the market has more than enough of that. What's missing is a coherent operating system designed against first principles instead of vendor recommendations and last-person-out preferences.</p>
      <p><strong>Principl is a business architecture practice.</strong> We pressure-test every operational gate of your business (business model, GTM, revenue, accounting, HR, operations, fulfillment) through a first-principles process, then design and install the software architecture that operationalizes the decisions you make. <strong>You own the decisions. We own the architecture and the build.</strong></p>
      <a href="https://meetings.hubspot.com/danny482" target="_blank" rel="noopener" class="cta-button">Book a Conversation</a>
    </div>
  </section>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost. Confirm:
- Eyebrow reads "Business Architecture Practice"
- Headline is the diagnostic mirror with "operating system" in green italic
- Body has three paragraphs with the practice positioning paragraph last
- CTA button still works and links to HubSpot
Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): rewrite homepage hero for business architecture frame

Diagnostic-mirror headline. Body anchors on the practice positioning
paragraph. Eyebrow updated. CTA unchanged.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Update breakout quote

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (lines 574-578)

- [ ] **Step 1: Replace the breakout content**

Find:
```html
  <!-- Breakout -->
  <div class="breakout">
    <div class="breakout-inner reveal">
      The companies that win with AI won't be the ones that <em>adopted it first.</em> They'll be the ones that adopted it <em>intentionally.</em>
    </div>
  </div>
```

Replace with:
```html
  <!-- Breakout -->
  <div class="breakout">
    <div class="breakout-inner reveal">
      Architects design buildings. We design the <em>businesses</em> that run inside them.
    </div>
  </div>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost. Scroll past hero and confirm the breakout reads correctly with "businesses" in green italic. Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update breakout quote to architecture-of-businesses frame

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Rewrite "What we keep seeing" section

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (lines 581-589)

- [ ] **Step 1: Replace the section content**

Find:
```html
  <!-- The Problem -->
  <section class="section reveal">
    <div class="section-label">What we keep seeing</div>
    <div class="section-content">
      <p>AI adoption efforts fail for the same reasons, over and over. There's no operating plan. Tools get purchased before the problem is clearly defined. Teams experiment in silos without sharing what works or what doesn't. Nobody connects the AI initiative back to the existing systems of record, the workflows that actually run the business.</p>
      <p>The result is churn, not progress. Six months and three tools later, the organization has a collection of disconnected experiments and no measurable change in how work gets done.</p>
      <p><strong>This isn't a technology gap.</strong> The tools are good enough. The models are good enough. What's missing is a methodology for figuring out where AI creates value in your specific operation, building it into the infrastructure you already have, and giving your team the confidence to actually use it.</p>
      <p>That's a solvable problem.</p>
    </div>
  </section>
```

Replace with:
```html
  <!-- The Problem -->
  <section class="section reveal">
    <div class="section-label">What we keep seeing</div>
    <div class="section-content">
      <p>Most businesses fail to build an operating system for the same reasons over and over. Systems get bought before the problem gets defined, departments run on tribal knowledge that lives in a few people's heads, decisions about how the business actually operates get inherited from vendor defaults instead of made on purpose, and nothing connects back to the workflows that actually run the business.</p>
      <p>The result is a business that operates by accident. Six tools, three sources of truth, a growing list of integrations nobody can fully explain, and a team that's tired of asking the same questions in different forms.</p>
      <p><strong>This isn't a tooling gap.</strong> The tools are good enough and the models are good enough. What's missing is intentional architecture, someone accountable for designing the system instead of accumulating it, and someone accountable for installing the structure once the decisions are made.</p>
      <p>That's a solvable problem.</p>
    </div>
  </section>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to the section. Confirm new copy renders, four paragraphs, "tooling gap" bolded, closing line "That's a solvable problem." intact. Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): rewrite 'what we keep seeing' for operating-system framing

Replaces AI-adoption-specific copy with broader business-operating-system
diagnostic. Closes on the architecture gap rather than the methodology gap.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Rewrite "How we work" section

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (lines 592-600)

- [ ] **Step 1: Replace the section content**

Find:
```html
  <!-- The Approach -->
  <section class="section reveal">
    <div class="section-label">How we work</div>
    <div class="section-content">
      <p>First-principles, not vendor-driven. Industry-agnostic. Every engagement starts with the same question: what does this business actually need?</p>
      <p>From there, we map to existing systems and infrastructure, identify where AI creates measurable value, and produce a bespoke operating system your team can run without us. The deliverable is working infrastructure, not a slide deck or a tool recommendation.</p>
      <p>The through-line across nearly two decades of work has been the same: when a new technology emerges, most organizations buy it before they understand it. The ones that win are the ones that figure out how it connects to the way they already operate, then build the system around that connection.</p>
      <p><strong>Social media. Digital marketing. AI.</strong> The technology changes. The pattern doesn't.</p>
    </div>
  </section>
```

Replace with:
```html
  <!-- The Approach -->
  <section class="section reveal">
    <div class="section-label">How we work</div>
    <div class="section-content">
      <p>First-principles, not vendor-driven. Industry-agnostic. Every engagement starts with the same question: what does this business actually need?</p>
      <p>From there, the methodology is consistent. We pressure-test seven operational gates: <strong>business model, GTM, revenue, accounting, HR, operations, and fulfillment.</strong> Each gate is a forced decision point. Some surface that the business model has drifted from what's actually working, others that the financial reporting cadence makes timely decisions impossible, others that the fulfillment infrastructure is the bottleneck the GTM team has been blamed for. Whatever the gates surface, the operator decides. We architect and install the software that operationalizes those decisions.</p>
      <p>The through-line across nearly two decades of work has been the same: when a new technology emerges, most organizations buy it before they understand it. The ones that win figure out how it connects to the way they already operate, then build the system around that connection.</p>
      <p><strong>Social media. Digital marketing. AI.</strong> The technology changes. The pattern doesn't.</p>
    </div>
  </section>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to the section. Confirm:
- Opening paragraph unchanged
- Second paragraph names the seven gates with bold treatment
- Third paragraph (through-line) intact
- Closing punch ("Social media. Digital marketing. AI.") intact
Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): rewrite 'how we work' to introduce seven-gate methodology

Names the operational gates explicitly. Reinforces design-and-install
deliverable. Existing through-line and closing punch preserved.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Update practitioner title

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (line 610)

- [ ] **Step 1: Update the author title**

Find:
```html
          <div class="author-title">Revenue Infrastructure Architect · <a href="https://www.linkedin.com/in/principlai/" target="_blank" rel="noopener">LinkedIn</a></div>
```

Replace with:
```html
          <div class="author-title">Business Architect · <a href="https://www.linkedin.com/in/principlai/" target="_blank" rel="noopener">LinkedIn</a></div>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to "The practitioner" section. Confirm title under headshot reads "Business Architect · LinkedIn". Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update practitioner title to business architect

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Add "Builder Across Domains" beat to practitioner section

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (insert new beat between current "Enterprise AI Operator" and "Academic Practitioner" beats, around line 627)

- [ ] **Step 1: Insert new beat after the Enterprise AI Operator beat**

Find:
```html
      <div class="beat">
        <div class="beat-label">Enterprise AI Operator</div>
        <p>Currently in customer marketing at a growth-stage, AI-forward B2B software company. Not advising on AI from the outside, operating inside it daily. Top Claude Code user in a 540-person organization. Living inside the tools, building with them, understanding where they work and where they break.</p>
      </div>

      <div class="beat">
        <div class="beat-label">Academic Practitioner</div>
```

Replace with:
```html
      <div class="beat">
        <div class="beat-label">Enterprise AI Operator</div>
        <p>Currently in customer marketing at a growth-stage, AI-forward B2B software company. Not advising on AI from the outside, operating inside it daily. Top Claude Code user in a 540-person organization. Living inside the tools, building with them, understanding where they work and where they break.</p>
      </div>

      <div class="beat">
        <div class="beat-label">Builder Across Domains</div>
        <p>Minority partner in Building NV, a literal design-build general contractor. The architecture metaphor isn't really a metaphor, it's the same role applied to different materials. Software systems instead of structural beams, business models instead of floor plans, the same accountability for whether the structure stands up.</p>
      </div>

      <div class="beat">
        <div class="beat-label">Academic Practitioner</div>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to "The practitioner" section. Confirm there are now FIVE beats in order: Big Agency Origins, Founder & Operator, Enterprise AI Operator, Builder Across Domains, Academic Practitioner. Layout still clean. Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): add 'builder across domains' beat to practitioner section

Calls out Building NV partnership as the literal design-build experience
that mirrors the practice's metaphor.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Update through-line copy

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (around line 635 in `.through-line` div)

- [ ] **Step 1: Replace the through-line paragraph**

Find:
```html
      <div class="through-line">
        <p>Every time a new technology emerges, social media, digital marketing, AI, the pattern is the same. Figure out how it <em>generates revenue.</em> Build the system. Teach others to run it.</p>
      </div>
```

Replace with:
```html
      <div class="through-line">
        <p>Every wave of new technology, every domain of business operation, follows the same pattern. Figure out how it <em>generates value.</em> Design the system. Install it. Teach the operator to run it.</p>
      </div>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to the bottom of the practitioner section. Confirm the through-line block has updated copy with "generates value" in green italic. Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update through-line to span technology eras AND business domains

Replaces revenue-only framing with value framing, adds 'install' to the
sequence to reinforce design-and-install deliverable.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Add Programs section + supporting CSS

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (add CSS to `<style>` block; add new `<section>` after practitioner section, before CTA section)

This task adds inline-link styling for the section content area (used by the Programs link to `/revenue-residency`) and adds the new Programs section between the practitioner section and the CTA section.

- [ ] **Step 1: Add inline-link CSS rule**

Find this block in the `<style>` section (around line 246-253):
```css
    .section-content p strong {
      font-weight: 500;
      color: var(--ink);
    }

    /* ─── Breakout quote ─── */
```

Replace with:
```css
    .section-content p strong {
      font-weight: 500;
      color: var(--ink);
    }

    .section-content a {
      color: var(--green);
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color 0.2s ease;
    }

    .section-content a:hover {
      color: var(--green-light);
    }

    /* ─── Breakout quote ─── */
```

- [ ] **Step 2: Insert the Programs section**

Find:
```html
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
```

(This is the boundary between the practitioner section closing tag and the CTA section opening tag, around line 640-642.)

Replace with:
```html
  </section>

  <!-- Programs -->
  <section class="section reveal">
    <div class="section-label">Programs</div>
    <div class="section-content">
      <p><strong>Revenue Residency.</strong> Founders learn to install their own operating system using the same first-principles methodology principl runs on engagements. An eight-week cohort, six to eight founders, real deliverables, no content consumption.</p>
      <p>Cohort 1 opens Q2 2026. <a href="/revenue-residency">Get on the list</a>.</p>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
```

- [ ] **Step 3: Verify locally**

Run server, open localhost. Scroll through the entire page top to bottom and confirm:
- Practitioner section ends with the through-line block as before
- New "Programs" section appears next, with the same visual treatment as other sections (green label, content body)
- Two paragraphs in the Programs section, the second containing a green underlined link "Get on the list"
- Click the link and confirm it routes to `/revenue-residency` correctly (loads the existing waitlist page)
- CTA dark section still appears after Programs section
Stop server.

- [ ] **Step 4: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): add programs section with revenue residency link

New section between practitioner and CTA. Secondary placement positions
residency as the education arm of the practice. Adds inline-link CSS for
section-content anchors.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Update CTA section copy

**Files:**
- Modify: `projects/principl-ai/site/homepage.html` (line 645)

- [ ] **Step 1: Update the CTA headline**

Find:
```html
      <h2>If your organization is navigating AI adoption and needs a practitioner, not a vendor, let's talk.</h2>
```

Replace with:
```html
      <h2>If you're navigating an operating system rebuild and need a practitioner, not a vendor, let's talk.</h2>
```

- [ ] **Step 2: Verify locally**

Run server, open localhost, scroll to the dark CTA section near the bottom. Confirm new headline copy. Button and email footnote unchanged. Stop server.

- [ ] **Step 3: Commit**

```bash
git add projects/principl-ai/site/homepage.html
git commit -m "$(cat <<'EOF'
feat(principl): update CTA copy to operating-system rebuild framing

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: End-to-end visual review

**Files:**
- None (verification only)

- [ ] **Step 1: Full page visual review**

Run server: `cd projects/principl-ai/site && bun run server.ts`
Open: `http://localhost:8080`

Walk through the entire page top to bottom. For each section, confirm:

| Section | Expected |
|---------|----------|
| Browser tab | Title reads "principl.ai — Business Architecture Practice" |
| Header | Wordmark "principl" left, "Business Architecture Practice" right |
| Hero | Eyebrow "Business Architecture Practice", diagnostic-mirror headline, three body paragraphs ending with practice positioning paragraph, CTA button works |
| Breakout | "Architects design buildings. We design the businesses that run inside them." |
| What we keep seeing | Operating-system diagnostic copy, four paragraphs |
| How we work | Seven gates named in bold, through-line + closing punch preserved |
| The practitioner | Five beats: Big Agency, Founder & Operator, Enterprise AI Operator, Builder Across Domains, Academic Practitioner. Title under headshot reads "Business Architect" |
| Through-line | "Every wave of new technology, every domain..." |
| Programs | Revenue Residency intro + link to /revenue-residency, link is green and underlined |
| CTA section | "If you're navigating an operating system rebuild..." headline |
| Footer | Unchanged |

- [ ] **Step 2: Mobile responsive check**

In the browser dev tools, toggle responsive view. Test at:
- 768px width (tablet breakpoint)
- 480px width (mobile breakpoint)

Confirm all sections still render readably, no horizontal scroll, no overflow issues with the new Programs section or extended practitioner section.

- [ ] **Step 3: Cross-page link check**

From the homepage, click the "Get on the list" link in the Programs section. Confirm it routes to `/revenue-residency` and loads the existing waitlist page correctly. Click the principl wordmark on `/revenue-residency` to confirm it routes back to `/`.

- [ ] **Step 4: Stop server, mark complete**

Stop the server. The implementation is complete. Push to remote when ready (Railway picks up automatically per project deploy convention).

---

## Self-Review Checklist (already run on this plan)

- **Spec coverage:** Every section in the design spec has a corresponding task. Header, hero, breakout, "what we keep seeing", "how we work", practitioner (title + new beat + through-line), Programs section, CTA, page title/meta. All covered.
- **Placeholder scan:** No TBDs, no "implement appropriate X", no "similar to Task N". All copy is final or marked as the working draft Danny approved.
- **Type/path consistency:** All file paths absolute and correct. CSS class names match existing site (`.section`, `.section-content`, `.beat`, `.through-line`, `.cta-section`). Link target `/revenue-residency` matches the existing route in `server.ts`.
- **Out-of-scope discipline:** No tasks for vertical directory, Studio offering, Library showcase, /revenue-residency rewrite, or visual redesign. Spec scope respected.
