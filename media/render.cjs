#!/usr/bin/env node
// Renders gCASTEL LinkedIn visuals from a JSON spec, using the Castel design
// system tokens (brand/tokens.json) and logos (brand/assets/).
//
// Usage:  node media/render.cjs <spec.json> [--html]
//
// Spec:
// {
//   "out": "path/without/extension",          // .png (1 slide) or .pdf (carousel) is added
//   "format": "portrait" | "square" | "landscape",
//   "slides": [ { "template": "data", ...fields }, ... ]
// }
// One slide -> PNG. Two or more slides -> PDF carousel (+ PNG of the cover).
// Always also writes <out>.preview.jpg, a light preview for draft emails.
// Templates and their fields: see TEMPLATES below and media/README.md.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const FORMATS = {
  portrait: { w: 1080, h: 1350 },
  square: { w: 1080, h: 1080 },
  landscape: { w: 1200, h: 627 },
};

function loadTokens() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'brand/tokens.json'), 'utf8'));
  const map = {};
  for (const t of raw.color.tokens) map[t.name] = typeof t.value === 'string' ? t.value : t.value.light;
  // resolve aliases like "{green-600}"
  for (const k of Object.keys(map)) {
    let v = map[k];
    while (typeof v === 'string' && v.startsWith('{')) v = map[v.slice(1, -1)];
    map[k] = v;
  }
  return map;
}

function logo(color) {
  const file = path.join(ROOT, `brand/assets/logo-castel-${color}.png`);
  return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// **bold** -> highlighted span, newlines -> <br>
const rich = (s = '') => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

const TEMPLATES = {
  // Big number from a report. Fields: kicker, value, label, body?, source
  data: (d, c) => ({
    bg: c['sand-100'], logo: 'green',
    html: `
      <div class="kicker" style="color:${c['green-500']}">${esc(d.kicker)}</div>
      <div class="grow center">
        <div class="value" style="color:${c['green-700']}">${esc(d.value)}</div>
        <div class="label" style="color:${c['gray-900']}">${rich(d.label)}</div>
        ${d.body ? `<div class="body" style="color:${c['gray-700']}">${rich(d.body)}</div>` : ''}
      </div>
      <div class="source" style="color:${c['gray-600']}">${d.source ? 'Fonte: ' + esc(d.source) : ''}</div>`,
  }),
  // Quote or opinion. Fields: quote, author?, role?
  quote: (d, c) => ({
    bg: c['green-600'], logo: 'amber', dark: true,
    html: `
      <div class="rule" style="background:${c['amber-400']}"></div>
      <div class="grow">
        <div class="quote" style="color:${c.white}">${rich(d.quote)}</div>
      </div>
      ${d.author ? `<div class="author" style="color:${c['green-100']}">${esc(d.author)}<span style="color:${c['sand-400']}">${d.role ? ' · ' + esc(d.role) : ''}</span></div>` : ''}`,
  }),
  // Announcement (feature, event, partnership, milestone).
  // Fields: kicker, title, body?, pill?, footer?
  announce: (d, c) => ({
    bg: c['green-800'], logo: 'amber', dark: true,
    html: `
      <div class="kicker" style="color:${c['amber-400']}">${esc(d.kicker)}</div>
      <div class="grow center">
        <div class="title" style="color:${c.white}">${rich(d.title)}</div>
        ${d.body ? `<div class="body" style="color:${c['sand-400']}">${rich(d.body)}</div>` : ''}
        ${d.pill ? `<div><span class="pill" style="background:${c['green-100']};color:${c['ink-green']}">${esc(d.pill)}</span></div>` : ''}
      </div>
      <div class="source" style="color:${c['sand-500']}">${esc(d.footer || '')}</div>`,
  }),
  // Carousel content slide. Fields: index?, title, body, source?
  point: (d, c) => ({
    bg: c.white, logo: 'green',
    html: `
      ${d.index ? `<div class="index" style="background:${c['green-100']};color:${c['ink-green']}">${esc(d.index)}</div>` : ''}
      <div class="grow center">
        <div class="title dark" style="color:${c['green-700']}">${rich(d.title)}</div>
        <div class="body" style="color:${c['gray-700']}">${rich(d.body)}</div>
      </div>
      <div class="source" style="color:${c['gray-600']}">${d.source ? 'Fonte: ' + esc(d.source) : ''}</div>`,
  }),
  // Carousel cover / closing slide. Fields: kicker?, title, body?
  cover: (d, c) => ({
    bg: c['sand-400'], logo: 'green',
    html: `
      <div class="kicker" style="color:${c['green-500']}">${esc(d.kicker || '')}</div>
      <div class="grow center">
        <div class="title dark" style="color:${c['ink-green']}">${rich(d.title)}</div>
        ${d.body ? `<div class="body" style="color:${c['gray-800']}">${rich(d.body)}</div>` : ''}
      </div>
      <div class="source" style="color:${c['gray-600']}">${esc(d.footer || '')}</div>`,
  }),
};

function page(slide, fmt, c) {
  const t = TEMPLATES[slide.template];
  if (!t) throw new Error(`Unknown template "${slide.template}". Use: ${Object.keys(TEMPLATES).join(', ')}`);
  const { bg, logo: logoColor, html, dark } = t(slide, c);
  const s = fmt.w / 1080; // scale factor so landscape stays proportional
  return `
  <section class="slide${dark ? ' on-dark' : ''}" style="width:${fmt.w}px;height:${fmt.h}px;background:${bg};padding:${88 * s}px ${88 * s}px ${72 * s}px">
    ${html}
    <img class="logo" src="${logo(logoColor)}" style="height:${56 * s}px">
  </section>`;
}

function documentHtml(spec, c) {
  const fmt = FORMATS[spec.format || 'portrait'];
  const s = fmt.w / 1080;
  const fs_ = (px) => `${Math.round(px * s)}px`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page { size: ${fmt.w}px ${fmt.h}px; margin: 0 }
    * { box-sizing: border-box; margin: 0 }
    body { font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased }
    .slide { position: relative; display: flex; flex-direction: column; overflow: hidden; page-break-after: always }
    .grow { flex: 1; display: flex; flex-direction: column; gap: ${fs_(32)} }
    .center { justify-content: center }
    .kicker { font-size: ${fs_(28)}; font-weight: 600; letter-spacing: .02em }
    .value { font-size: ${fs_(220)}; font-weight: 700; line-height: 1; letter-spacing: -.03em }
    .label { font-size: ${fs_(48)}; line-height: 1.2; font-weight: 600; max-width: 90% }
    .title { font-size: ${fs_(76)}; line-height: 1.1; font-weight: 700; letter-spacing: -.02em }
    .title.dark { font-size: ${fs_(68)} }
    .body { font-size: ${fs_(34)}; line-height: 1.45; font-weight: 400; max-width: 92% }
    .quote { font-size: ${fs_(58)}; line-height: 1.25; font-weight: 600; letter-spacing: -.01em }
    .rule { width: ${fs_(96)}; height: ${fs_(8)}; border-radius: 4px; margin-bottom: ${fs_(56)} }
    .author { font-size: ${fs_(30)}; font-weight: 600; margin-bottom: ${fs_(90)} }
    .pill { display: inline-block; font-size: ${fs_(28)}; font-weight: 600; padding: ${fs_(14)} ${fs_(28)}; border-radius: 9999px }
    .index { width: ${fs_(84)}; height: ${fs_(84)}; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: ${fs_(36)}; font-weight: 700 }
    .source { font-size: ${fs_(22)}; line-height: 1.4; max-width: 70%; min-height: ${fs_(44)} }
    .logo { position: absolute; right: ${fs_(88)}; bottom: ${fs_(72)} }
    b { font-weight: 700; background: linear-gradient(transparent 62%, ${c['green-100']}88 62%) }
    .on-dark b { background: none; color: ${c['amber-300']} }
  </style></head><body>${spec.slides.map((sl) => page(sl, fmt, c)).join('')}</body></html>`;
}

async function main() {
  const specPath = process.argv[2];
  if (!specPath) {
    console.error('Usage: node media/render.cjs <spec.json> [--html]');
    process.exit(1);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const c = loadTokens();
  const fmt = FORMATS[spec.format || 'portrait'];
  const html = documentHtml(spec, c);
  const out = path.resolve(path.dirname(specPath), spec.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (process.argv.includes('--html')) fs.writeFileSync(out + '.html', html);

  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: fmt.w, height: fmt.h } });
  await pg.setContent(html, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  const written = [];
  const slides = pg.locator('.slide');
  const shots = [];
  for (let i = 0; i < spec.slides.length; i++) shots.push(await slides.nth(i).screenshot());
  // PNG of the first slide (the only one for single images, the cover for carousels)
  fs.writeFileSync(out + '.png', shots[0]);
  written.push(out + '.png');
  if (spec.slides.length > 1) {
    await pg.pdf({ path: out + '.pdf', width: `${fmt.w}px`, height: `${fmt.h}px`, printBackground: true });
    written.push(out + '.pdf');
  }
  // Light JPEG preview for draft emails: the image itself, or a grid of the
  // carousel pages, shrunk until it fits in PREVIEW_MAX_KB.
  const maxKb = Number(process.env.PREVIEW_MAX_KB || 70);
  const cols = Math.min(shots.length, 3);
  const rows = Math.ceil(shots.length / cols);
  const cellW = shots.length === 1 ? 720 : 360;
  const cellH = Math.round((cellW * fmt.h) / fmt.w);
  const gap = shots.length === 1 ? 0 : 12;
  const pw = cols * cellW + (cols - 1) * gap;
  const ph = rows * cellH + (rows - 1) * gap;
  const prev = await browser.newPage({ viewport: { width: pw, height: ph } });
  await prev.setContent(`<body style="margin:0;background:#fff;display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:${gap}px">${shots
    .map((b) => `<img style="width:${cellW}px;height:${cellH}px;display:block" src="data:image/png;base64,${b.toString('base64')}">`)
    .join('')}</body>`);
  let quality = 82;
  let jpg;
  do {
    jpg = await prev.screenshot({ type: 'jpeg', quality, fullPage: true });
    quality -= 8;
  } while (jpg.length > maxKb * 1024 && quality > 20);
  fs.writeFileSync(out + '.preview.jpg', jpg);
  written.push(`${out}.preview.jpg (${Math.round(jpg.length / 1024)} KB)`);
  await browser.close();
  console.log(written.join('\n'));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
