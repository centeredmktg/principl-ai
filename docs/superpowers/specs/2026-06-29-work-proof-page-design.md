# Design: `/work` proof page

**Date:** 2026-06-29
**Status:** Approved (design) — ready for implementation plan
**Repo:** `site/` (principl.ai, Bun server, Railway)

---

## Purpose

De-abstract what Danny actually does. The current homepage `work` section
(`id="work"`, *"First-principles. Not vendor-driven."*) is conceptual — prospects
can't see the work. This page replaces abstraction with evidence: real systems,
not slides about them.

The page is also a positioning argument, not a gallery. The thesis:

> **Danny is a continuous improvement engineer. He builds systems that solve
> problems, then finds the people who have them — and increasingly, people bring
> him the problem directly.**

The two operating modes map onto the page's two bands. This is deliberate: the
confidentiality structure (owned vs. client work) and the positioning structure
(build-first vs. commissioned) are the same structure, so the page argues itself.

- **Build-first** = proof of the *instinct*. The hook — most consultants have
  nothing here.
- **Commissioned** = proof others *pay* for it. The ask — the mode Danny wants more of.

---

## Decisions (locked)

| Decision | Resolution |
|---|---|
| Placement | Dedicated `/work` page. Homepage `work` section → teaser + link. |
| Layout | Two labeled bands of static cards (no accordion). |
| Naming | Capability-first. Name only what's safe; genericize client work. |
| Asset source | Capture reachable tools from here; stylized/Danny-supplied for the rest. |
| DSCRme tile | Included, genericized as "a DSCR lending lab." No DSCRme/Host branding. |
| Lead order | Speculative band first (hook), commissioned band last (ask → CTA). |
| Proof numbers | Placeholders, pre-filled where known; Danny confirms before deploy. |

---

## Page structure

```
/work
┌─────────────────────────────────────────────┐
│  Thesis line                                  │
│  "I build systems that solve problems, then   │
│   find the people who have them. Increasingly,│
│   they find me first."                        │
├─────────────────────────────────────────────┤
│  BAND 1 — Built before anyone asked           │
│  ┌────────┬────────┐                          │
│  │ pricing│ hiring │   (2×2 desktop,          │
│  ├────────┼────────┤    1-col mobile)         │
│  │premiere│ li/slack│                         │
│  └────────┴────────┘                          │
├─────────────────────────────────────────────┤
│  BAND 2 — Built for the problem in front of me│
│  ┌────────┬────────┐                          │
│  │ icp    │ eisen  │                          │
│  └────────┴────────┘                          │
├─────────────────────────────────────────────┤
│  Close → existing apply/CTA flow              │
│  "Have a problem in front of you? Let's build."│
└─────────────────────────────────────────────┘
```

Design language inherits the existing architectural/operator-system aesthetic and
green brand from `homepage.html`. No new design system; reuse existing CSS tokens
and section patterns.

### Card anatomy

Each card is **static** (all content visible — better for scanning, and for the
later video swap). Structure:

- **Visual** — thumbnail (screenshot or stylized tile), normalized to one aspect
  ratio so the grid stays even.
- **Capability title** — what the system does, not what it's called.
- **Challenge → System → Result** — one line each.
- **Reserved video slot** — empty `data-video` attribute now. Adding a case-study
  video later = COPY-allowlist add + one attribute, not a rebuild.

---

## The six tiles

Copy below is **draft** — Danny tunes voice/numbers. Proof lines marked `[CONFIRM]`
need a real number before deploy.

### Band 1 — Built before anyone asked

**1. Automated loan pricing engine** *(bridge tile — the thesis in one card)*
- Naming: "in a DSCR lending lab" — no DSCRme/Host branding.
- Challenge: A lender priced every deal by hand — analyst time, inconsistent terms, slow turnarounds.
- System: Borrower intake flows into a pricing matrix that returns rate, terms, and a draft term sheet with no analyst in the loop.
- Result: ~10K-line production app, multi-source intake, pricing real deals. *Built speculatively — now found its buyer.*
- Asset: **reachable** — capture from live app, crop/redact branding.

**2. Candidate marketing-site generator** (You Should Hire)
- Naming: yours, nameable.
- Challenge: A strong candidate looks like one more PDF résumé in a stack.
- System: Turns a candidate into a branded pitch site — company visuals, candidate voice, pain-first positioning.
- Result: first candidate live. `[CONFIRM]` whether to name Nicole or keep generic.
- Asset: **unsure if hosted** — Danny's frame or stylized tile.

**3. Transcript-to-edit highlight engine** (Content Sync Engine)
- Naming: yours.
- Challenge: Hours of multicam footage, manual hunt for the moments worth keeping.
- System: Transcribes the call, detects highlight moments, exports markers straight into the Premiere timeline.
- Result: first-pass edit hunt cut from hours to `[CONFIRM minutes]`.
- Asset: **not web-reachable** (local NLE). Danny meeting CPS design partner
  2026-06-30 — opportunity to capture a real Premiere-timeline-with-markers frame.
  Tile built to accept real screenshot or stylized fallback.

**4. Multi-exec LinkedIn pipeline, approved in Slack** (Exec Content Engine)
- Naming: yours.
- Challenge: Execs want a presence but won't touch a CMS.
- System: Drafts run through Slack for one-tap review/approve, then publish — multi-tenant across execs.
- Result: POC live, first post published.
- Asset: **lives in Slack** — Danny's frame (clean approval thread) or stylized tile.

### Band 2 — Built for the problem in front of me (preferred)

**5. ICP-matched pipeline + per-account message generator** (Sixth City)
- Naming: "for a B2B agency client" — Sixth City genericized.
- Challenge: Generic outbound to a vague audience.
- System: Scores accounts against a defined ICP, then generates a unique value-prop message per account from that account's own signals.
- Result: running against live lead flow. `[CONFIRM]` any volume/throughput number.
- Asset: **internal tool, not reachable** — stylized/redacted tile.

**6. Rich Eisen Show merch engine** (JV)
- Naming: **named** — Rich Eisen, JV with element23.
- Challenge: A show audience with no real commerce engine behind it.
- System: Shopify storefront reskin + WordPress content engine + YouTube → product pipeline.
- Result: live store. `[CONFIRM]` any sales/traffic number that's OK to publish.
- Asset: **reachable** — capture from live Shopify storefront.

---

## Asset reality (honest scope on "I'll capture them")

Capture-from-here only works cleanly for tools with a reachable web UI:

| Tile | Reachable? | Plan |
|---|---|---|
| 1 pricing engine | ✅ live (Railway) | Capture + crop/redact |
| 6 Rich Eisen shop | ✅ live (Shopify) | Capture |
| 3 Premiere | ❌ local NLE | CPS meeting 6/30 frame, or stylized |
| 4 LinkedIn/Slack | ❌ in Slack | Danny's frame, or stylized |
| 5 ICP engine | ❌ internal | Stylized/redacted |
| 2 You Should Hire | ❓ unsure hosted | Danny's frame, or stylized |

For stylized tiles: clean abstract/diagram-style frames (architecture sketch,
terminal frame, redacted UI) consistent with the brand — looks intentional, not
like a missing image.

---

## Technical implementation surface

1. `work.html` — new page, reusing homepage CSS tokens/patterns.
2. `server.ts` — add `loadPage("work.html")` + `GET /work` route.
3. `homepage.html` — replace `work` section body with teaser + "See the work →" link.
4. `site/assets/work/` — new image directory for tile thumbnails.
5. **`Dockerfile` COPY allowlist** — add `work.html` AND `assets/work/`. This is a
   known landmine (studio-os.html and partials/ were both bitten). New top-level
   HTML files and new directories must both be added explicitly.
6. Local review before any Railway deploy. No full redeploy for text-only changes later.

### Known gotchas (from project memory)

- Dockerfile COPY allowlist must cover every new file/dir or the page 404s on prod
  while working locally ("text still on prod" = dropped commit / missing COPY).
- Branch + PR, never push straight to main. Verify commits are in the branch
  (`git log origin/main..HEAD --oneline`) before pushing.

---

## Out of scope (YAGNI)

- Video case studies (slot reserved, content later).
- CMS / templating — pages stay as static HTML strings gzipped at boot.
- Per-tile detail pages or modals (static cards only for v1).
- Analytics events beyond the existing umami partial.

---

## Open items for Danny before deploy

- Premiere time-savings number (tile 3).
- Name Nicole or keep generic (tile 4 / You Should Hire).
- Any publishable numbers for ICP engine (tile 5) and Rich Eisen (tile 6).
- Supply frames for tiles 3, 4, 5 (and YSH) or approve stylized treatment.
