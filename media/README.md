# Media

`render.cjs` genera i visual con il design system Castel (`brand/tokens.json`, `brand/assets/`).

```bash
node media/render.cjs media/examples/esempio-dato.json
```

Una slide → `<out>.png`; due o più → carosello `<out>.pdf` + `<out>.png` (copertina). Sempre anche `<out>.preview.jpg` (≤ 70 KB) per le mail di bozza.

## Template

| Template | Sfondo | Campi | Uso |
|---|---|---|---|
| `data` | sabbia | `kicker`, `value`, `label`, `body?`, `source` | Un dato da un report |
| `quote` | verde 600 | `quote`, `author?`, `role?` | Citazione, opinione di Gilberto |
| `announce` | verde 800 | `kicker`, `title`, `body?`, `pill?`, `footer?` | Feature, evento, partnership, traguardo |
| `cover` | sabbia 400 | `kicker?`, `title`, `body?`, `footer?` | Copertina o chiusura di un carosello |
| `point` | bianco | `index?`, `title`, `body`, `source?` | Pagina di carosello |

`**testo**` evidenzia (menta su chiaro, ambra su scuro); `\n` va a capo.

Formati: `portrait` 1080×1350 (default), `square` 1080×1080, `landscape` 1200×627.

Esempi in `examples/`. Per visual più complessi: Claude Design con il design system Castel (vedi `.claude/skills/media-creator/SKILL.md`).
