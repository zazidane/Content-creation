#!/usr/bin/env python3
"""Builds the HTML and plain-text body of the LinkedIn workflow emails.

Usage:
    python3 scripts/email_body.py <post.json> <kind> <out_dir>

kind: draft | ready | reminder
Writes <out_dir>/<id>.<kind>.html and .txt and prints the suggested subject.

The post JSON is the one produced by post-writer (schema in
.claude/skills/post-writer/SKILL.md). The full JSON is embedded at the end of
both bodies between GCLI-DATA markers so that a later session can rebuild the
draft from the Sent folder.
"""
import html
import json
import sys
from pathlib import Path

PREFIX = "[gCASTEL LI]"
GREEN = "#004A32"
INK = "#181D27"
MUTED = "#535862"
SAND = "#FCF9F3"
MINT = "#7AFFD9"


def esc(s):
    return html.escape(s or "")


def para(text):
    return "".join(
        f'<p style="margin:0 0 12px">{esc(p).replace(chr(10), "<br>")}</p>'
        for p in (text or "").split("\n\n")
    )


def block(title, inner, bg="#FFFFFF"):
    return (
        f'<div style="background:{bg};border:1px solid #E9EAEB;border-radius:8px;'
        f'padding:16px 20px;margin:0 0 16px">'
        f'<div style="font-size:12px;font-weight:600;color:{GREEN};text-transform:uppercase;'
        f'letter-spacing:.04em;margin-bottom:8px">{esc(title)}</div>{inner}</div>'
    )


def subject(p, kind):
    base = f"{PREFIX} {p['id']}"
    chan = "Profilo Gilberto" if p.get("channel") == "gilberto" else "Pagina"
    if kind == "draft":
        return f"{base} · Bozza v{p.get('version', 1)} · {chan} · {p.get('slot', '')} · {p.get('title', '')}"
    if kind == "ready":
        return f"{base} · Pronto · {chan} · {p.get('slot', '')}"
    return f"{base} · Promemoria · {chan} · {p.get('slot', '')}"


def build(p, kind):
    data = json.dumps(p, ensure_ascii=False)
    hashtags = " ".join(p.get("hashtags", []))
    review = p.get("review", {})
    parts_html, parts_txt = [], []

    intro = {
        "draft": f"Bozza v{p.get('version', 1)} per <b>{esc(p.get('slot', ''))}</b> — {esc(p.get('type', ''))}, pilastro {esc(p.get('pillar', ''))}.",
        "ready": f"Approvato. Da pubblicare <b>{esc(p.get('slot', ''))}</b>. Testo finale qui sotto.",
        "reminder": f"Il post di <b>{esc(p.get('slot', ''))}</b> non è ancora approvato. Rispondi con OK o con le modifiche.",
    }[kind]
    if p.get("channel") == "gilberto" and kind != "ready":
        intro += " <b>Profilo di Gilberto</b>: giralo a Gilberto e rispondi <b>GILBERTO OK</b> o con il suo feedback."
    parts_html.append(f'<p style="margin:0 0 16px">{intro}</p>')
    parts_txt.append(html.unescape(intro.replace("<b>", "").replace("</b>", "")))

    if p.get("notes_for_ettore") and kind == "draft":
        parts_html.append(block("Nota", para(p["notes_for_ettore"]), SAND))
        parts_txt.append("NOTA\n" + p["notes_for_ettore"])

    it_body = (p.get("it") or "") + (f"\n\n{hashtags}" if hashtags else "")
    parts_html.append(block("Testo IT", para(it_body)))
    parts_txt.append("TESTO IT\n" + it_body)
    if p.get("en"):
        en_body = p["en"] + (f"\n\n{hashtags}" if hashtags else "")
        parts_html.append(block("Testo EN", para(en_body)))
        parts_txt.append("TESTO EN\n" + en_body)
    if p.get("first_comment"):
        parts_html.append(block("Primo commento", para(p["first_comment"])))
        parts_txt.append("PRIMO COMMENTO\n" + p["first_comment"])

    if p.get("visual", {}).get("cid"):
        parts_html.append(
            block(
                "Visual",
                f'<img src="cid:{esc(p["visual"]["cid"])}" style="max-width:100%;border-radius:8px">'
                + (f'<p style="color:{MUTED};font-size:12px;margin:8px 0 0">{esc(p["visual"].get("caption", ""))}</p>' if p["visual"].get("caption") else ""),
            )
        )
        parts_txt.append("VISUAL: in allegato")

    if kind == "ready" and p.get("repo_url"):
        parts_html.append(block("File in alta risoluzione", f'<a href="{esc(p["repo_url"])}">{esc(p["repo_url"])}</a>'))
        parts_txt.append("FILE: " + p["repo_url"])

    if kind == "draft":
        if p.get("hook_alternatives"):
            items = "".join(f"<li>{esc(h)}</li>" for h in p["hook_alternatives"])
            parts_html.append(block("Attacchi alternativi", f'<ol style="margin:0;padding-left:20px">{items}</ol>'))
            parts_txt.append("ATTACCHI ALTERNATIVI\n" + "\n".join(f"{i+1}. {h}" for i, h in enumerate(p["hook_alternatives"])))
        if p.get("sources"):
            items = "".join(
                f'<li><a href="{esc(s.get("url", ""))}">{esc(s.get("title", ""))}</a>'
                + (f' — <i>{esc(s.get("quote", ""))}</i>' if s.get("quote") else "")
                + "</li>"
                for s in p["sources"]
            )
            parts_html.append(block("Fonti", f'<ul style="margin:0;padding-left:20px">{items}</ul>'))
            parts_txt.append("FONTI\n" + "\n".join(f"- {s.get('title', '')} {s.get('url', '')}" for s in p["sources"]))
        if review:
            warn = "".join(f"<li>{esc(w)}</li>" for w in review.get("warnings", []))
            inner = f'<p style="margin:0 0 8px">Punteggio: <b>{esc(str(review.get("score", "–")))}/100</b></p>'
            if warn:
                inner += f'<p style="margin:0 0 4px">Da verificare:</p><ul style="margin:0;padding-left:20px">{warn}</ul>'
            parts_html.append(block("Review automatica", inner, SAND))
            parts_txt.append(f"REVIEW: {review.get('score', '–')}/100\n" + "\n".join(f"- {w}" for w in review.get("warnings", [])))
        cmds = (
            "Rispondi a questa mail: <b>OK</b> per approvare · <b>OK</b> + correzioni · "
            "feedback libero per una nuova versione · <b>SCARTA</b> · <b>RIMANDA</b>"
        )
        parts_html.append(f'<p style="color:{MUTED};font-size:13px;margin:16px 0 0">{cmds}</p>')
        parts_txt.append("Rispondi: OK · OK + correzioni · feedback libero · SCARTA · RIMANDA")

    body_html = (
        f'<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.5;color:{INK};max-width:680px">'
        f'<div style="height:4px;background:{MINT};border-radius:2px;margin-bottom:16px"></div>'
        + "".join(parts_html)
        + f"</div>\n<!-- GCLI-DATA {html.escape(data, quote=False)} GCLI-DATA -->"
    )
    body_txt = "\n\n".join(parts_txt) + f"\n\n---\nDati tecnici (non modificare)\nGCLI-DATA {data} GCLI-DATA\n"
    return body_html, body_txt


def main():
    if len(sys.argv) != 4 or sys.argv[2] not in ("draft", "ready", "reminder"):
        sys.exit(__doc__)
    p = json.loads(Path(sys.argv[1]).read_text())
    kind = sys.argv[2]
    out = Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)
    h, t = build(p, kind)
    (out / f"{p['id']}.{kind}.html").write_text(h)
    (out / f"{p['id']}.{kind}.txt").write_text(t)
    print(subject(p, kind))


if __name__ == "__main__":
    main()
