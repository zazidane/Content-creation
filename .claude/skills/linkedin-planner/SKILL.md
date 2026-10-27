---
name: linkedin-planner
description: Builds and emails the weekly LinkedIn editorial plan for gCASTEL (next week's slots for the company page and Gilberto's profile, with option A plus alternatives B/C). Use for the scheduled Thursday planning run or when asked for the editorial plan.
---

# linkedin-planner

Runs on **Thursday 08:40** and plans the **following week**.

## Inputs

1. `CLAUDE.md`, `config/calendar.yaml`, `config/events.yaml`, `brand/playbook.md`, `brand/guardrails.md`, `brand/company-context.md`.
2. **Already published**: `content/` of the last 6 weeks (pillars, topics, formats): avoid repeats, keep the monthly `pillar_mix`.
3. **Pending intake**: in `INBOX.LinkedIn` and `INBOX`, Ettore's emails of the last 30 days tagged `[REPORT]`, `[IDEA]`, `[GILBERTO]`, and drafts answered `RIMANDA`. An intake is used if a post in `content/` cites it in `intake`.
4. **Events**: events in `config/events.yaml` falling in the next 3 weeks (announcement 7–10 days before, recap within 2 days after).
5. **Fresh signals**: run `source-scout` (last 14 days).
6. **Learnings**: the latest `analytics/monthly/*.md` and `analytics/weekly/*.md`.

## Output

For each slot of next week (page: 3 slots; Gilberto: per `calendar.yaml`):
- **A** (recommended) and **B**, **C**: title, angle in one sentence, pillar, type, format, main source/intake, why now.
- Gilberto's slot: first-person angle, ideally linked to one of the page's topics.
- "Altri spunti" section: up to 5 signals not used.
- Upcoming events and missing information to request (e.g. event photos).

Send one email: subject `[gCASTEL LI] Piano W<ww> · <n> slot`, clear HTML (one block per slot) and plain text, ending with: "Rispondi OK per le proposte A, oppure ad esempio 1B 2A 3C G1A, oppure scrivi cosa cambiare."

IDs: assign `GC-<year>W<ww>-<n>` per page slot and `GC-<year>W<ww>-G<n>` for Gilberto, and write them in the plan so the inbox run reuses them.

Do not draft posts here: drafts start when Ettore replies (handled by `linkedin-inbox`).
