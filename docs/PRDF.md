# PRDF - Transportation-group (Production Readiness & Design Findings)
Inspected: 2026-09-28. Real code, README ignored. Benchmark: Collins + gauntlet.

## VERDICT: TIER 2 - REAL AGENT INFRASTRUCTURE, DEAD FRONT DOOR
Live URL 404 (deploy dead). Next.js app "bones-driver-platform": a WhatsApp-first driver/transport booking platform with REAL agent plumbing - API routes: whatsapp (Twilio webhook: processBookingMessage, saveBooking, validateTwilioSignature, notify, analytics), voice, traffic-weather, leads, driving-mode, daily-summary, bookings, health. Plus blog ([slug]).

## EVIDENCE
- npm ci OK, `tsc --noEmit` CLEAN.
- `npm run build` OOM-killed on audit box (exit 137, 800MB free RAM - environment limit shared fleet-wide; tsc clean stands; no live deploy to lean on).
- Twilio signature validation present (webhook security done right); analytics + notification plumbing present.

## VIOLATIONS / GAPS
1. HIGH - Deploy dead (404). A platform with no front door. Fix: redeploy (Vercel billing is account-level - owner action) or Docker self-host on old-box lane.
2. MED - Build unverified in CI (local OOM) - needs a CI build or memory-constrained build profile to prove green.
3. MED - Zero tests for a booking pipeline (money-adjacent: bookings, leads). Fix: contract tests on whatsapp webhook + bookings route.
4. LOW - Env-key audit: Twilio/OpenAI-class keys required at runtime - none in tree (good); document required envs.
5. INFO - This is infrastructure, not a showcase site; Collins visual gates apply only to blog/marketing surface.

## FIX LIST TO PRODUCTION-READY
1 (owner billing + 1h) redeploy; 2 (1h) CI build; 3 (2-3h) webhook/booking contract tests; 4 (30m) env docs. Estimated: one day + owner action.

## PORTFOLIO ROLE
Proves she can ship real operations software (WhatsApp agent, booking pipeline) - a differentiator vs design-only studios. Fix the 404 before showing.
