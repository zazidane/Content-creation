#!/usr/bin/env python3
"""Saves an APPROVED post into the content archive.

Usage:
    python3 scripts/archive_post.py <post.json> <approved_by> [visual files...]

Creates content/<year>/<yyyy-mm-dd>_<id>_<slug>/ with:
  post.md      frontmatter + IT + EN + first comment
  post.json    the full post data (as approved)
  visual.*     the rendered files passed as arguments (png, pdf, spec json)
Prints the folder path. Call it ONLY after Ettore's OK.
"""
import json
import re
import shutil
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def slugify(s, n=50):
    s = unicodedata.normalize("NFKD", s or "post").encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:n].strip("-") or "post"


def yaml_value(v):
    return json.dumps(v, ensure_ascii=False)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    p = json.loads(Path(sys.argv[1]).read_text())
    approved_by = sys.argv[2]
    visuals = [Path(f) for f in sys.argv[3:]]

    date = p.get("publish_date") or datetime.now().strftime("%Y-%m-%d")
    folder = ROOT / "content" / date[:4] / f"{date}_{p['id']}_{slugify(p.get('title'))}"
    folder.mkdir(parents=True, exist_ok=True)

    p["status"] = "approved"
    p["approved_by"] = approved_by
    p["approved_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")

    front = {
        "id": p["id"],
        "title": p.get("title"),
        "channel": p.get("channel"),
        "type": p.get("type"),
        "pillar": p.get("pillar"),
        "format": p.get("format"),
        "publish_date": date,
        "slot": p.get("slot"),
        "version": p.get("version"),
        "approved_by": approved_by,
        "approved_at": p["approved_at"],
        "hashtags": p.get("hashtags", []),
        "sources": p.get("sources", []),
        "intake": p.get("intake"),
        "review_score": p.get("review", {}).get("score"),
    }
    lines = ["---"] + [f"{k}: {yaml_value(v)}" for k, v in front.items()] + ["---", ""]
    lines += [f"# {p.get('title', p['id'])}", "", "## IT", "", p.get("it", ""), ""]
    if p.get("en"):
        lines += ["## EN", "", p["en"], ""]
    if p.get("first_comment"):
        lines += ["## Primo commento", "", p["first_comment"], ""]
    if p.get("hashtags"):
        lines += ["## Hashtag", "", " ".join(p["hashtags"]), ""]
    (folder / "post.md").write_text("\n".join(lines))

    for v in visuals:
        name = "visual" + "".join(v.suffixes[-2:]) if v.name.endswith(".preview.jpg") else "visual" + v.suffix
        shutil.copy(v, folder / name)
    (folder / "post.json").write_text(json.dumps(p, ensure_ascii=False, indent=2))
    print(folder.relative_to(ROOT))


if __name__ == "__main__":
    main()
