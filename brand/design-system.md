# Design system

- **Fonte di verità**: design system **Castel** in Claude Design → https://claude.ai/artifact/4rmG4bVMrnFrTWUFaZRUAp
- **Copia locale** usata dal renderer: `brand/tokens.json` e `brand/assets/logo-castel-{green,amber}.png` (copiati il 2026-10-27).
  Se il design system cambia in Claude Design, `media-creator` rilegge `project/tokens.json` e aggiorna la copia (con OK).

## Riassunto

- **Colori**: verde profondo (`green-600` #004A32 per fondi e azioni, `green-700` #0F3623 per titoli), menta (`green-100` #7AFFD9 / `green-200` #00DDAF) per evidenziare, ambra (`amber-400` #E2C15C) solo su verdi scuri, neutri sabbia (`sand-100` … `sand-400`).
- **Font**: Inter.
- **Raggi**: 8px per card e bottoni, pill per i tag.
- **Logo**: wordmark verde su chiaro, ambra su verde scuro; mai sotto 160px di larghezza.
- **Accessibilità**: bianco su `green-600` 10,37:1; ambra-400 su `green-800` 9,79:1; mai testo ambra su bianco.

## Nota

Il README del design system descrive Castel come piattaforma di investimento immobiliare tokenizzato ("Investi"): è il lessico di una versione precedente del prodotto. Per i contenuti valgono `brand/company-context.md` e `brand/voice.md`; dal design system si prende solo la parte visiva.

## Template disponibili

Vedi `media/README.md`: `data`, `quote`, `announce`, `cover`, `point` in formato portrait 1080×1350, square 1080×1080, landscape 1200×627.
