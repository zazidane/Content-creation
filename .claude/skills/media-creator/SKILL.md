---
name: media-creator
description: Creates the visual for a gCASTEL LinkedIn post (data card, quote card, announcement, PDF carousel) with the Castel design system, renders full-size PNG/PDF and a light JPEG preview for email, and optionally a Claude Design canvas for hand edits. Use whenever a post needs an image or carousel.
---

# media-creator

Brand: `brand/design-system.md`. Renderer and templates: `media/README.md`.

## Steps

1. Pick template and format from the post JSON (`format`, `visual.template_hint`) and `brand/playbook.md`:
   - `data` → one `data` slide; `quote` → one `quote` slide; `announce` → one `announce` slide;
   - `carousel` → `cover` + 3–6 `point` slides (+ optional closing `announce` or `quote`);
   - `text` → no visual.
   Default format `portrait` (1080×1350).
2. Write the spec JSON in the scratchpad (`out` relative to the spec file). Text on slides must be short: titles ≤ 60 characters, body ≤ 160, figures exactly as in the post, source on every slide with figures. Use the post's language (IT) for the visual unless `bilingual_mode` says otherwise.
3. Render: `node media/render.cjs <spec.json>` → `<out>.png`, `<out>.pdf` (carousel), `<out>.preview.jpg` (≤ 70 KB).
4. **Look at the PNG** (Read the image) and fix overflow, awkward line breaks or contrast problems before returning.
5. Store the spec in the post JSON as `visual.spec`, the preview path as `visual.preview`, `visual.cid = "visual"`.

## Claude Design (optional)

When a template is not enough (event banner with photos, co-branded partnership visual, custom infographic) or Ettore asks for an editable visual: create a Design artifact with the Artifact tool (`action: quickstart`, intent `design`), using the **Castel** design system (https://claude.ai/artifact/4rmG4bVMrnFrTWUFaZRUAp), and put its link in `notes_for_ettore`. Still render a PNG for the email preview.

## Design system updates

If Ettore says the design system changed: read `project/tokens.json` and the Logos assets from the Castel artifact, update `brand/tokens.json` and `brand/assets/`, re-render `media/examples/*.json`, and commit only after his OK.
