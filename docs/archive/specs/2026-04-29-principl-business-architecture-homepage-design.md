# principl.ai Homepage — Business Architecture Repositioning

**Date:** 2026-04-29
**Status:** Draft (pending user review)
**Goal:** Expand the principl.ai homepage from a narrow "AI adoption advisory" wedge to the umbrella business architecture practice it actually is. Establish the "design and install your operating system" claim as the practice positioning. Vertical landing pages remain as direct-targeted sales/SEO assets but are NOT surfaced on the homepage.

---

## Context

The current `principl.ai` homepage is framed as "Digital Transformation & AI Advisory." That was the right wedge for the DISQO-type prospect that drove the previous redesign in 2026-04-03. The current frame catches AI-budget buyers but undersells the actual practice.

The actual practice is business architecture across seven operational gates: business model validation, GTM, revenue, accounting, HR, operations, and fulfillment. AI is a tool inside the practice, not the practice itself.

The decision is to expand the homepage to reflect the broader practice while vertical landing pages (`/mid-market-tech` already live, `/talent-casting` next, additional verticals to follow) continue functioning as productized line cards for direct outreach and SEO. They are NOT surfaced on the homepage. The first-principles methodology is universally applicable, so a vertical menu on the homepage would undercut the actual claim.

The mental model behind the practice is design-build general contractor for software and business operating systems. "Architect" is the public language for elevation and pricing precedent. "Design-build GC" is the operational truth. Both are useful in different contexts. The site uses the architectural language; the operational mental model informs scoping and pricing.

## Practice Positioning (locked language)

> Principl is a business architecture practice. We pressure-test every operational gate of your business (business model, GTM, revenue, accounting, HR, operations, fulfillment) through a first-principles process, then design and install the software architecture that operationalizes the decisions you make. You own the decisions. We own the architecture and the build.

Load-bearing elements:

- **"Design AND install"** distinguishes the practice from consultants (slides only) and software vendors (tools only). It signals accountability for the working result, not just the recommendation.
- **Seven gates** define the surface area. Danny does not claim domain depth in each gate. He facilitates intentional first-principles decisions across all of them and builds the software architecture that operationalizes whatever the operator decides.
- **"Operator owns the decisions, principl owns the architecture and the build"** solves the consulting-pattern-risk where prospects extract strategic maps and try to execute without the architect. The map IS the system. There is nothing to extract until it is built.

## Architecture

One route change:

- `GET /` — homepage rewrite (this spec)

Unchanged:

- `GET /revenue-residency` — existing waitlist page
- `GET /mid-market-tech` — existing vertical line card
- `POST /apply` — existing application endpoint
- `GET /health`, `GET /headshot.jpg` — unchanged

No `server.ts` changes required. This is an `homepage.html` rewrite plus title and meta updates.

### Design Language (unchanged)

Inherits the existing visual system. No design token changes.

- Fonts: Instrument Serif (headlines), Outfit (body)
- Colors: `--green: #226b03`, `--ink: #111`, `--surface: #fdfcfa`
- Paper grain texture, scroll-reveal animations, whitespace rhythm
- Inline styles in the HTML file, no CSS framework

## Homepage Structure

### Header

- Wordmark: `principl` (unchanged)
- Right-side rule changes from "Digital Transformation & AI Advisory" to **"Business Architecture Practice"**

### Hero

- **Eyebrow:** Business Architecture Practice
- **Headline:** Diagnostic mirror in serif statement form. The hook is recognition, not pitch. Working draft:
  > "Most businesses don't have an operating system. They have eight systems patched together with tribal knowledge."
  Final copy may sharpen the second clause, but the diagnostic-mirror direction is locked.
- **Body (2-3 paragraphs):**
  1. Name the symptoms operators feel. Tools layered on tools. Departments running on tribal knowledge. Integration debt that hides until it blocks growth. No single source of truth.
  2. Reframe what is actually missing. It is not more software. It is a coherent operating system designed against first principles, not vendor recommendations or inherited defaults.
  3. The practice claim. The locked positioning paragraph above is the body anchor. "Principl is a business architecture practice... You own the decisions. We own the architecture and the build."
- **CTA button:** "Book a Conversation" (existing HubSpot link)

### Breakout Quote

One serif statement that reframes the work. Working draft:
> "Architects design buildings. We design the businesses that run inside them."

Final copy may iterate. The architecture-of-businesses frame is the direction.

### Section: What's Actually Broken

- **Section label:** What we keep seeing
- Replaces the existing AI-specific copy with operating-system-specific copy. Same shape: name the failure mode, describe what it produces, point at the gap.
- Failure modes to surface:
  - Eight separate systems instead of one coherent OS
  - Decisions inherited rather than chosen (default vendor configs, last person's preferences, "we have always done it this way")
  - Integration debt invisible until it blocks growth
  - Operators making decisions across domains they do not have the time or context to think through carefully
- The section closes on the methodology gap. Tools are good enough. Models are good enough. What is missing is intentional architecture and someone accountable for installing it.

### Section: How We Work

- **Section label:** How we work
- Introduces the first-principles methodology and the seven-gate framework. Lists the gates: business model, GTM, revenue, accounting, HR, operations, fulfillment. Each is treated as a forced decision point, not a service line.
- Reinforces the through-line: every era of new technology follows the same pattern. Figure out where it generates value, build the system, teach the operator to run it. AI is the current era. The methodology spans social media, digital marketing, RevOps, and now AI-native infrastructure.
- States the deliverable explicitly: working software architecture, not a slide deck.

### Section: The Practitioner

- **Section label:** The practitioner
- Author intro block: headshot, name, title, LinkedIn link.
- **Title update:** "Revenue Infrastructure Architect" becomes **"Business Architect"** (final phrasing may be "Business Architect & Builder" or similar; locked direction is the architect identity).
- Beat structure preserved from the current homepage, but reframed from "look at all I have done" to career-as-culmination. Each era produced a piece of the practice.
  - **Big Agency Origins** (Razorfish): Enterprise digital transformation pedigree. Hands-on launch playbook for Samsung, Delta, Kellogg, Campbell's.
  - **Founder & Operator**: Cross-industry revenue system buildout. Agency $0 to $1M, solar org $0 to $3M, DTC brand $100K to $1.2M. Each required building revenue infrastructure from scratch in industries with no existing playbook.
  - **Enterprise AI Operator**: Currently inside an active AI transformation at Ridgeline. Top 1% Claude Code operator. Building real systems daily.
  - **Builder Across Domains**: Minority partner in Building NV (literal design-build general contractor). The metaphor isn't a metaphor — same role, different materials.
  - **Academic Practitioner**: University of Nevada, Reno College of Business faculty. MBA candidate. Methodology refined through teaching as well as doing.
- **Through-line copy update:** From "every wave of new technology" to "every domain of business operation." The methodology generalizes both ways: across technology eras and across the seven gates of business operation.

### Section: Programs

- **Section label:** Programs
- New section, secondary weight. Lighter visual treatment than the practitioner section.
- One offering: **Revenue Residency.** Brief copy describing it as the education arm of the practice. Founders learn to install their own operating system using the same first-principles methodology that the consulting practice uses on engagements. Link to `/revenue-residency`.
- Studio is NOT mentioned on this page. Held until the structure is ready to scale.

### CTA Section (dark)

- Same shape as current. Copy updates to fit the broader frame.
- Working draft headline: "If you're navigating an operating system rebuild and need a practitioner, not a vendor, let's talk."
- Same CTA button (HubSpot link), same email footnote.

### Footer

Unchanged.

## Page Title & Meta

- `<title>`: `principl.ai — Business Architecture Practice`
- `<meta name="description">`: Working draft: "Principl is a business architecture practice. We design and install the operating system that runs your business. Led by Danny Cox."

## Out of Scope

- **Vertical directory section.** Held until at least 3-4 vertical pages exist with proven traction. Until then, vertical pages route in via direct outreach and SEO, not from the homepage. Adding a vertical menu prematurely undercuts the universal-methodology claim.
- **Studio offering.** Not on the site yet. Held until cash flow is stable and at least one Studio test deal is in motion.
- **Library / product showcase.** You Should Hire, property sniffer, and future library entries remain on their own URLs. Not surfaced on principl.ai yet.
- **Vertical landing page rewrites.** `/mid-market-tech` stays as is. `/talent-casting` is a separate spec when that opportunity moves forward.
- **`/revenue-residency` rewrite.** Existing page stays as is. May warrant a small copy update later to align with the "Programs" framing, but that is a separate task.
- **Visual redesign.** Inherits existing design tokens. No design system changes.

## Implementation Notes

This is a single-file rewrite of `homepage.html`. Server, routing, design system, and all other pages remain unchanged. The implementation effort is primarily copy plus minor structural changes:

- Programs section is new (additive)
- "What's actually broken" and "How we work" sections are existing structure with new copy
- Practitioner section is existing structure with reframed copy and updated title
- Tagline, page title, and meta description update

The Programs section may warrant a small new style pattern. Could borrow the `.beat` style or create a lightweight new variant. Implementation can decide based on visual fit.

## Open Decisions

These are intentionally left to the writing-plans phase or implementation:

1. Final hero headline copy. Direction is locked (diagnostic mirror); exact phrasing iterates during implementation.
2. Final breakout quote phrasing.
3. Final practitioner title text ("Business Architect" vs. "Business Architect & Builder" vs. similar).
4. Whether the Programs section gets a small visual differentiator (icon, divider, alternate background) to separate it from the credential beats above.

## Acceptance Criteria

- Homepage hero presents the diagnostic-mirror headline and the practice-positioning paragraph as the body anchor.
- Header tagline reads "Business Architecture Practice."
- The seven-gate first-principles methodology is named explicitly in "How we work."
- "Design and install" appears in the body copy, not just implied.
- Practitioner section reframes the career arc as culmination, not greatest hits, with the title updated to the architect identity.
- Programs section exists, contains Revenue Residency only, in secondary visual position.
- No vertical directory, no Studio offering, no Library showcase appears on the homepage.
- Visual system identical to current homepage.
- Page title and meta description reflect the practice frame.
