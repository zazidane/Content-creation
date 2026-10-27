---
name: post-writer
description: Writes or revises a gCASTEL LinkedIn post (Italian + English) for the company page or Gilberto Castelluzzo's profile, as a structured JSON ready for review, visuals and email. Use whenever a LinkedIn post must be drafted or revised from a brief, an intake email or Ettore's feedback.
---

# post-writer

## Read first

`brand/company-context.md`, `brand/voice.md`, `brand/guardrails.md`, `brand/playbook.md`, and `references/tipi.md` (structure per content type).

## Input

A brief: ID, channel (`pagina` | `gilberto`), slot (e.g. "mar 4/11 08:30") and `publish_date`, type, pillar, angle, sources/intake material, and for a revision the current JSON plus Ettore's feedback (apply it literally; when it is ambiguous, apply the most reasonable reading and say so in `notes_for_ettore`).

## Writing rules

- Italian first, then the English **adaptation** (see `voice.md`).
- Hook in the first two lines; one idea per paragraph; empty line between paragraphs.
- Length: page 600–1,300 characters; Gilberto 800–1,800.
- Every figure must be in `sources` with the exact quote. No source → no figure.
- Only features listed in `company-context.md` → "Cosa fa la piattaforma oggi", or announced by Ettore.
- Links go in `first_comment`.
- 3–5 hashtags.
- Provide 2 alternative hooks.

## Output: post JSON

```json
{
  "id": "GC-2026W45-1",
  "version": 1,
  "channel": "pagina",
  "slot": "mar 4/11 08:30",
  "publish_date": "2026-11-04",
  "type": "mercato | piattaforma | filiera | evento | feature | partnership | vita | gilberto",
  "pillar": "mercato",
  "format": "data | carousel | announce | quote | text",
  "title": "Short internal title",
  "it": "Italian text without hashtags",
  "en": "English text without hashtags",
  "first_comment": "Fonte: … https://…",
  "hashtags": ["#realestate", "#Milano"],
  "hook_alternatives": ["…", "…"],
  "sources": [{"title": "OMI, Rapporto Immobiliare 2026", "url": "https://…", "quote": "exact text", "accessed": "2026-10-27"}],
  "intake": "subject and date of Ettore's email, if any",
  "visual": {"template_hint": "data", "cid": "visual", "caption": ""},
  "notes_for_ettore": "only if something needs his attention"
}
```

`media-creator` fills `visual.spec`; `post-reviewer` fills `review`.
