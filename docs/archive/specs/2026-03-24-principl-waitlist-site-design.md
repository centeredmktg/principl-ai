# principl.ai Waitlist Site — Design Spec

**Date:** 2026-03-24
**Status:** Approved
**Goal:** Passive waitlist collection for Revenue Residency Cohort 1 via content and referrals.

---

## Overview

A single-page site at principl.ai that serves the Revenue Residency waitlist copy and collects applications. Deployed as a standalone Railway service. Not a marketing site, not a content hub. A vehicle for capturing intent from people who already trust Danny through content or referrals.

## Architecture

Single Bun HTTP server with 3 routes:

- `GET /` — serves the waitlist page (static HTML with inline CSS and minimal JS)
- `POST /apply` — accepts application form submission (JSON via fetch)
- `GET /health` — Railway health check

## File Structure

```
projects/principl-ai/site/
  server.ts        — Bun HTTP server, 3 routes
  index.html       — waitlist page (copy from page-copy.md + form + inline JS)
  db.ts            — SQLite init + insert/upsert
  notify.ts        — email notification via Resend
  Dockerfile       — oven/bun:1, matches centered-os pattern
  railway.toml     — deploy config with /health healthcheck
  package.json     — bun project, resend dependency
  bun.lock         — lockfile for frozen installs
```

## Visual Design

Light and clean. White/off-white background, professional but warm. No CSS framework. Inline styles. Good typography, generous whitespace. Should feel like a person wrote it, not a template.

## Page Content

Copy is finalized in `revenue-residency/waitlist/page-copy.md`. Five sections in order:

1. The Problem — pain recognition
2. The Diagnosis — why it happens
3. The Program — Revenue Residency details (6 weeks, no more than 8 founders, $8K Cohort 1 / $10K future)
4. Why Me — credential stack + $30M loss + DSCR lab proof
5. Application Close — form + confirmation

## Application Form

Four fields:

- Name (text, required)
- Email (email, required)
- Current annual revenue, approximate (text, required)
- What's the one thing in your business you'd fix first if you knew exactly how? (textarea, required)

Submit button. No CAPTCHA. No progressive profiling. Keep it simple.

### Form Submission Behavior

The form uses inline JavaScript to submit via `fetch` as JSON (`Content-Type: application/json`). This allows an inline confirmation message to replace the form on success without a page reload. On error, the form stays visible and displays the error message.

### Duplicate Handling

If an email already exists in the database, upsert: update the existing row with the new submission data and timestamp. Do not send a duplicate email notification to Danny. This prevents notification spam and avoids confusing the applicant with an error.

## Data Flow

1. Visitor lands on `/`, gets the HTML page
2. Fills out 4-field form, submits via JS fetch
3. `POST /apply` receives JSON, validates all fields are present and non-empty
4. Upserts row into SQLite (`applications` table: id, name, email, revenue, fix_first, created_at, updated_at). If email exists, updates the row and sets updated_at.
5. If new row (not update): sends email to danny@principl.ai via Resend with application details
6. Returns JSON: `{ "ok": true }` with `Content-Type: application/json`
7. Inline JS replaces the form with confirmation: "Got it. We'll follow up within a few days. If it's a fit, we'll talk. If it's not, we'll tell you that too."

## Error Handling

- Missing/empty fields: return 400 JSON with a message indicating which fields are missing
- Resend failure: log the error, still return success to the user (the SQLite row is the source of truth, email is a convenience notification)
- SQLite failure: return 500 JSON with generic error message
- All error responses use `Content-Type: application/json`

## Environment Variables

- `PORT` — server port (defaults to 8080)
- `RESEND_API_KEY` — API key for Resend email service

## Deployment

- Separate Railway service from centered-os
- New git repo initialized inside `projects/principl-ai/site/`, pushed to a new GitHub remote. Railway connects to this repo for deploys.
- Custom domain: principl.ai (configured in Railway)
- Railway volume mount for SQLite persistence (mounted at `/data`, database file at `/data/principl.db`). Without this, deploys wipe the database.
- Dockerfile: `oven/bun:1`, same pattern as centered-os, uses `--frozen-lockfile`
- railway.toml: healthcheck at `/health`

## Accepted Risks

- No rate limiting on `POST /apply`. Traffic is referral/content-driven, not public-facing advertising. Risk of abuse is low. If it becomes a problem, add IP-based throttling later.
- No CAPTCHA. Same rationale.

## Not In Scope

- No auth, no admin panel, no dashboard
- No analytics
- No additional pages (/about, /experiments)
- No CSS framework
- No advertising or conversion optimization
