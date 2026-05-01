# principl.ai Consulting Homepage — Design Spec

**Date:** 2026-04-03
**Status:** Draft
**Goal:** Establish principl.ai as the front door for Danny Cox's AI adoption / digital transformation consulting practice. Pass the sniff test for enterprise prospects evaluating legitimacy before engaging.

---

## Context

Danny has a strong lead on a $10-15K AI adoption / digital transformation engagement with DISQO. The current principl.ai homepage is a Revenue Residency cohort waitlist page — wrong message for an enterprise prospect evaluating a consultant's bonafides.

This redesign makes principl.ai the practice brochure. The existing Revenue Residency waitlist page moves to `/revenue-residency`.

## Architecture

Two routes replace the current single-page setup:

- `GET /` — new consulting practice homepage (this spec)
- `GET /revenue-residency` — current waitlist page, relocated
- `POST /apply` — existing application endpoint (unchanged, form lives on `/revenue-residency`)
- `GET /health` — unchanged
- `GET /headshot.jpg` — unchanged

### Technical Changes

- `server.ts` updated to serve two HTML files based on route
- New `homepage.html` for `/`
- Current `index.html` renamed to `revenue-residency.html`, served at `/revenue-residency`
- Internal links updated: header wordmark on `/revenue-residency` links back to `/`. Homepage wordmark is not a link (you're already there).
- Form action on `/revenue-residency` unchanged (`POST /apply`)
- Calendly embed or link on homepage CTA (external link, no backend changes)

### Design Language

Inherits the existing visual system — no redesign of the design tokens:

- Fonts: Instrument Serif (headlines) + Outfit (body)
- Colors: `--green: #226b03`, `--ink: #111`, `--surface: #fdfcfa`
- Same whitespace rhythm, scroll-reveal animations, paper grain texture
- Same responsive breakpoints
- No CSS framework. Inline styles in the HTML file.

## Homepage Structure

### Section 1: Header

Same pattern as current site. Wordmark "principl" left, descriptor right.

Right-side descriptor changes from "Revenue Residency — Cohort 1" to "Digital Transformation & AI Advisory" (or similar).

Navigation: none for now. Keep it clean.

### Section 2: Hero

**Label:** Digital Transformation & AI Advisory

**Headline:** A serif statement that frames the core claim — AI adoption is an operations problem, not a technology problem.

**Body:** 2-3 paragraphs establishing the problem space: organizations recognize AI's potential and threat, but lack a plan. Leadership mandates adoption without methodology → tool sprawl, fractured efforts, wasted investment, uncertainty. Principl brings a first-principles approach that produces bespoke operating systems mapped to the org's real challenges and existing infrastructure.

**CTA button:** "Book a Conversation" — links to Calendly (external URL, configured as a variable or hardcoded).

### Section 3: The Problem (Breakout + Section)

Breakout quote reinforcing the core tension (the dual-edged sword of AI — transformative potential meets organizational paralysis).

Section copy expanding on why most AI adoption efforts fail: no rollout plan, tool-first thinking, fractured efforts across teams, no connection to existing systems of record. The gap isn't awareness — it's methodology.

### Section 4: The Approach

**Label:** How We Work

First-principles, not vendor-driven. Industry-agnostic methodology refined over nearly two decades of technology-forward organizational transformation. Starts with what the business actually needs. Maps to existing systems of record and infrastructure investment. Produces a bespoke, finely tuned operating system to address real business challenges — not a slide deck, not a tool recommendation, not a generic playbook.

Brief mention of the through-line: every wave of new technology follows the same pattern — figure out how it generates value, build the system, teach the organization to run it. Danny has done this across social, digital marketing, revenue operations, and now AI.

### Section 5: The Track Record

**Label:** The Practitioner

This is the credibility section. NOT a bullet list — a narrative credential ladder that builds the connective tissue: big agency operator → founder → enterprise AI operator → academic practitioner.

**Beat 1 — Big Agency Origins:**
Started in Chicago at a major agency. Launched brands on emerging social platforms when social publishing was the new, misunderstood technology. Personally built the pages for Campbell's Chunky Soup and Kellogg NutriGrain. Helped define the digital and social support strategy for every Samsung mobile launch from the Galaxy S2 through the Note 4. Built the analytics framework that demonstrated social media as a revenue channel for Delta Air Lines as content lead.

**Beat 2 — Founder Operator:**
Took the playbook independent. Built a marketing agency to $1M in 14 months with 9 FTEs. Built a solar sales organization from $0 to $3M. Grew a DTC brand from $100K to $1.2M. Each venture required building revenue systems from scratch in industries with no existing playbook.

**Beat 3 — Enterprise AI Operator:**
Currently in customer marketing at a growth-stage, AI-forward B2B software company. Not advising on AI from the outside — operating inside it daily. Top Claude Code user in a 540-person organization. Living inside the tools, building with them, understanding where they work and where they break.

**Beat 4 — Academic Practitioner:**
Professor at the University of Nevada, Reno — College of Business (R1 research institution). MBA candidate. Teaching while doing. The methodology isn't theoretical — it's refined in real engagements and pressure-tested in academic rigor.

**The through-line (closing paragraph):**
Every time a new technology emerges — social media, digital marketing, AI — the pattern is the same: figure out how it generates revenue, build the system, teach others to run it. That's what Principl does.

### Section 6: Book a Conversation (CTA)

Dark background section (matching the current apply section's `--ink` background).

**Label:** Let's Talk

**Headline:** Something like "If your organization is navigating AI adoption and needs a practitioner, not a vendor — let's talk."

**CTA button:** "Book a Conversation" — same Calendly link as hero.

**Footnote:** danny@principl.ai for those who prefer email.

### Section 7: Footer

Same as current: principl.ai left, danny@principl.ai right. Optionally add a LinkedIn link.

## Content Principles

- Write in Danny's voice — confident, direct, warm but not saccharine
- No banned words (see CLAUDE.md voice guide)
- Proof points use specific numbers, not adjectives
- No portfolio screenshots or case study links in v1 — that's a future conversation
- No client logos or testimonials
- The page should feel like a person wrote it, not a template

## What's NOT Changing

- SQLite database, application form, Resend notifications — all unchanged
- Dockerfile, railway.toml, deployment config — unchanged
- The Revenue Residency page content — unchanged except route and minor link updates
- Design tokens (fonts, colors, spacing) — unchanged

## What's NOT In Scope

- Portfolio / screenshots section (future phase)
- Case studies page
- Blog or content hub
- Analytics
- Additional sub-pages beyond `/revenue-residency`
- Calendly embed (just a link for now — embed is a future nicety)
- Navigation menu (two pages doesn't warrant one)

## Future Considerations (not building now)

- Portfolio section with screenshots of custom builds
- Diagnostic intake form replacing or supplementing "Book a Conversation" CTA
- `/case-studies` or `/approach` sub-pages if practice grows
- Calendly inline embed instead of external link
