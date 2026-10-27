---
name: linkedin-analytics
description: Handles gCASTEL LinkedIn analytics - Friday email asking Ettore for engagement screenshots, extraction of metrics from the screenshots he sends, weekly summary, monthly report with playbook proposals, and applying approved playbook changes. Use for the Friday and monthly scheduled runs and whenever Ettore sends [ANALYTICS] or statistics screenshots.
---

# linkedin-analytics

Data lives in `analytics/` (see `analytics/README.md`).

## 1. Friday request (scheduled, Friday 15:50)

List the posts with `publish_date` in the last 7 days from `content/` (both channels) plus any older post with fewer than 3 snapshots in `analytics/metrics.csv`. Send `[gCASTEL LI] Statistiche W<ww>` asking for, per post, a screenshot of the post analytics (impressions, reactions, comments, reposts, clicks) and one screenshot of the page analytics overview (followers, page views) — and, for Gilberto, his post analytics. Include the list with IDs, dates and first line of each post so Ettore can find them. One short paragraph, no more.

## 2. Ingest (called by linkedin-inbox)

1. Read the email with `read_email`. If the screenshots are not readable from the tool output, reply asking Ettore to paste the numbers in the email body (format: `ID: impression / reazioni / commenti / repost / clic`) and stop.
2. Match each screenshot to a post (first words of the text, date, ID).
3. Append one row per post to `analytics/metrics.csv` (`snapshot_date`, days since publication, all metrics; empty if not visible). Page-level numbers go to `analytics/page.csv`.
4. Write `analytics/weekly/<yyyy>-W<ww>.md`: table of the week, engagement rate = (reactions + comments + reposts + clicks) / impressions, best and worst post with one hypothesis each.
5. Commit (`Add LinkedIn metrics W<ww>`) and push; reply to Ettore with 3–5 lines of highlights.

## 3. Monthly report (scheduled, 1st of the month)

From `metrics.csv` (latest snapshot per post) compute by pillar, type, format, weekday, channel, hook style, length band. Compare with the previous month. Send `[gCASTEL LI] Report <mese> <anno>`: key numbers, what worked, what did not, and **numbered proposals** to change `brand/playbook.md` (each with the data that supports it). Save the draft report text in the email only.

## 4. Apply playbook (reply to the monthly report)

`OK` → apply all proposals; `OK 1 3` → only those; feedback → revise and resend. Write the approved report to `analytics/monthly/<yyyy-mm>.md`, update `brand/playbook.md` ("Apprendimenti misurati" with period and numbers), commit and push.
