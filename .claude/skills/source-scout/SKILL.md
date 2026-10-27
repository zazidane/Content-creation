---
name: source-scout
description: Finds and scores recent market reports, data releases and sector news relevant to gCASTEL (new-build residential sales, Milan market, proptech, BIM, e-signature) for LinkedIn content. Use when planning content or when asked for sources or report commentary ideas.
---

# source-scout

## How

1. Read `config/sources.yaml` and `brand/company-context.md` (themes we are entitled to talk about).
2. Search the web (WebSearch, then WebFetch on the primary source) for items from the requested window (default: last 14 days): new reports, quarterly statistics, regulatory changes, notable news on Milan/Italy new-build residential, SGR and family office residential investment, proptech and digital transactions, BIM, e-signature/eIDAS.
3. Always open the **primary source**. A figure seen only in a news article must be traced to the report it comes from; if you cannot, mark it `non verificato`.
4. Score each item 1–5 on: relevance for our clients (developers, SGR, family offices), freshness, authority of the source, our angle (can gCASTEL say something non-obvious?). Discard items below 12/20.

## Output (returned to the caller, not saved in the repo)

For each item: title, publisher, date, URL, 1–3 key figures with exact quote and page/section, suggested angle for gCASTEL, suggested format (`data` card, carousel, text), score.

Never copy charts or images: figures are re-drawn with `media-creator` templates, citing the source.
