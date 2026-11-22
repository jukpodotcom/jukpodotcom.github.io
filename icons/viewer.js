// Jukpo icon viewer: the mark, generic neighbour apps, and the desktop/phone
// mock. A page defines its options and calls startViewer(OPTIONS, title).
// An option is { group, name, icons: [{ bg, j, l, r, label? }] }; one icon or a set.
// ---------- the mark (shape A: bold flat-ended j, tall-V leaves) ----------
const SAGE = '#8fc39a', PEACH = '#ff9e7d', INK = '#1e1e1e', PAPER = '#f7f7f7', SNOW = '#ececec';
const J_PATH = 'M54 48 V68 Q54 84 38 84 Q30 84 26 77';
function leaf(x, y, ang, ln, w, fill) {
  return `<path d="M0 0 C${ln*.35} ${-w} ${ln*.75} ${-w} ${ln} 0 C${ln*.75} ${w} ${ln*.35} ${w} 0 0Z" fill="${fill}" transform="translate(${x} ${y}) rotate(${ang})"/>`;
}
function markBody(j, l, r) {
  return `<path d="${J_PATH}" fill="none" stroke="${j}" stroke-width="14" stroke-linecap="butt"/>` +
         leaf(54, 46, -118, 34, 10, l) + leaf(54, 44, -62, 34, 10, r);
}
// Bounding box of the mark in its own units, measured once in the page so the
// mark is centred by its real outline (stroke included) in every icon.
const BOX = (() => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', 1000); svg.setAttribute('height', 1000); svg.setAttribute('viewBox', '0 0 100 100');
  svg.style.cssText = 'position:absolute;left:-2000px;top:0';
  svg.innerHTML = markBody('#000', '#000', '#000');
  document.body.appendChild(svg);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const grow = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  const [j, ...leaves] = svg.children;
  const len = j.getTotalLength(), half = 7;
  for (let i = 0; i <= 200; i++) { const p = j.getPointAtLength(len * i / 200); grow(p.x - half, p.y - half); grow(p.x + half, p.y + half); }
  const top = j.getPointAtLength(0); y0 = Math.min(y0, top.y); // butt cap: the top end does not extend upward
  const sr = svg.getBoundingClientRect();
  for (const el of leaves) {
    const r = el.getBoundingClientRect();
    grow((r.left - sr.left) / 10, (r.top - sr.top) / 10); grow((r.right - sr.left) / 10, (r.bottom - sr.top) / 10);
  }
  svg.remove();
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
})();
function icon(o, px, round) {
  const s = (round ? 60 : 70) / BOX.h; // the mark is 70% of a square's height, 60% of a circle's
  const tx = 50 - (BOX.x + BOX.w / 2) * s, ty = 50 - (BOX.y + BOX.h / 2) * s;
  const size = px ? ` width="${px}" height="${px}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"${size}><rect width="100" height="100" rx="${round ? 50 : 22}" fill="${o.bg}"/><g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">${markBody(o.j, o.l, o.r)}</g></svg>`;
}
function lockup(j, l, r, bg, fg) {
  return `<div class="lock" style="background:${bg}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="18 8 140 86">${markBody(j, l, r)}<text x="66" y="68" font-family="Geist, system-ui, sans-serif" font-weight="700" font-size="40" letter-spacing="-1" fill="${fg}">ukpo</text></svg></div>`;
}

// ---------- generic neighbour icons ----------
const G = (bg, inner) => ({ bg, inner });
const gsvg = (g, rx = 22) => `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="${rx}" fill="${g.bg}"/>${g.inner}</svg>`;
const OTHERS = [
  G('#3b82f6', '<circle cx="50" cy="50" r="25" fill="none" stroke="#fff" stroke-width="11"/>'),
  G('#2d2d2d', '<text x="50" y="62" text-anchor="middle" font-family="ui-monospace,monospace" font-weight="700" font-size="34" fill="#7ee787">&gt;_</text>'),
  G('#f59e0b', '<rect x="22" y="34" width="56" height="40" rx="6" fill="#fde68a"/><rect x="22" y="28" width="24" height="12" rx="4" fill="#fde68a"/>'),
  G('#10b981', '<rect x="26" y="24" width="48" height="54" rx="6" fill="#fff"/><path d="M34 40h32M34 52h32M34 64h20" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>'),
  G('#a855f7', '<circle cx="42" cy="66" r="9" fill="#fff"/><path d="M49 66V28h20" stroke="#fff" stroke-width="7" fill="none"/>'),
  G('#ef4444', '<rect x="24" y="30" width="52" height="40" rx="6" fill="#fff"/><path d="M28 34l22 18 22-18" stroke="#ef4444" stroke-width="5" fill="none"/>'),
  G('#f3f4f6', '<rect x="24" y="26" width="52" height="50" rx="7" fill="#fff" stroke="#ddd"/><rect x="24" y="26" width="52" height="14" rx="7" fill="#ef4444"/><text x="50" y="68" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="24" fill="#222">22</text>'),
];
const [BROWSER, TERMINAL, FILES, NOTES, MUSIC, MAIL, CALENDAR] = OTHERS;
const PHOTOS = G('#ffffff', [['#f59e0b',0],['#ef4444',60],['#a855f7',120],['#3b82f6',180],['#10b981',240],['#84cc16',300]].map(([c,a]) => `<ellipse cx="50" cy="33" rx="9" ry="17" fill="${c}" opacity=".85" transform="rotate(${a} 50 50)"/>`).join(''));
const CAMERA = G('#6b7280', '<rect x="20" y="34" width="60" height="40" rx="8" fill="#e5e7eb"/><rect x="38" y="27" width="24" height="10" rx="3" fill="#e5e7eb"/><circle cx="50" cy="54" r="12" fill="#374151"/><circle cx="50" cy="54" r="6" fill="#9ca3af"/>');
const MAPS = G('#e7f3e1', '<path d="M0 62 L100 38" stroke="#fbbf24" stroke-width="9"/><path d="M38 0 L58 100" stroke="#fff" stroke-width="9"/><circle cx="60" cy="40" r="10" fill="#ef4444"/><circle cx="60" cy="40" r="4" fill="#fff"/>');
const WEATHER = G('#38bdf8', '<circle cx="42" cy="42" r="14" fill="#fde047"/><rect x="34" y="50" width="44" height="20" rx="10" fill="#fff"/><circle cx="50" cy="52" r="12" fill="#fff"/>');
const CLOCK = G('#111111', '<circle cx="50" cy="50" r="30" fill="#fff"/><path d="M50 50V30M50 50l14 8" stroke="#111" stroke-width="5" stroke-linecap="round"/>');
const SETTINGS = G('#9ca3af', '<circle cx="50" cy="50" r="24" fill="none" stroke="#f3f4f6" stroke-width="10" stroke-dasharray="9 6"/><circle cx="50" cy="50" r="12" fill="none" stroke="#f3f4f6" stroke-width="7"/>');
const MESSAGES = G('#22c55e', '<ellipse cx="50" cy="48" rx="27" ry="21" fill="#fff"/><path d="M32 62 L28 74 L42 66Z" fill="#fff"/>');
const PHONE = G('#22c55e', '<path d="M36 26c4 0 7 10 6 13s-6 4-5 7c3 7 8 12 15 15 3 1 4-4 7-5s13 2 13 6-6 11-12 11C46 73 27 54 27 37c0-6 5-11 9-11z" fill="#fff"/>');

const mix = (hex, to, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - t) + parseInt(to.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
function startViewer(OPTIONS, title) {
document.body.insertAdjacentHTML('afterbegin', `<div class="tabs">
  <div class="tab on" id="tab"><span id="tabIcon"></span><span>Jukpo — Home</span></div>
  <div class="tab"><span id="tabOther"></span><span>Docs</span></div>
  <div class="tools">
    <button id="btnPrev" title="Previous (↑)">↑</button>
    <button id="btnNext" title="Next (↓)">↓</button>
    <button id="btnOS">Android</button>
    <button id="btnMode">Dark</button>
    <button id="btnAll">All</button>
  </div>
</div>

<main class="stage">
  <section class="card">
    <div id="big"></div>
    <div class="meta">
      <h1 id="name"></h1>
      <div class="sub" id="sub"></div>
      <div class="sizes" id="sizes"></div>
      <div class="count" id="count"></div>
    </div>
    <div class="lockups" id="lockups"></div>
  </section>
</main>
<div class="hint">Swipe up or down, scroll, or use ↑ ↓ to switch the Jukpo icon · “All” to jump</div>

<div class="phone-wrap" id="phoneWrap"><div class="pcap" id="pcap"></div><div class="phone" id="phone"></div></div>
<div class="dock-wrap"><div class="dock" id="dock"></div></div>
<div class="grid" id="grid"></div>`);
if (title) document.title = title;
// ---------- state + rendering ----------
let idx = 0;
const $ = (id) => document.getElementById(id);
function buildDock() {
  const half = Math.floor(OTHERS.length / 2);
  $('dock').innerHTML =
    OTHERS.slice(0, half).map(s => `<div class="app">${gsvg(s)}</div>`).join('') +
    `<div class="jslots" id="jslots"></div>` +
    OTHERS.slice(half).map(s => `<div class="app">${gsvg(s)}</div>`).join('') +
    '';
}
// Every place a Jukpo icon appears holds one slot per icon of the option: one for a
// single option, three for a leaf-colour set.
function fillSlots(container, icons, dir, round) {
  container.innerHTML = icons.map(() => `<div class="slot"><div class="app jukpo"></div></div>`).join('');
  [...container.querySelectorAll('.app.jukpo')].forEach((el, i) => {
    el.innerHTML = icon(icons[i], 0, round);
    if (dir) el.classList.add(dir > 0 ? 'anim-up' : 'anim-down');
  });
}
function render(dir) {
  const o = OPTIONS[idx], first = o.icons[0];
  const coloured = o.lock || o.icons.find(c => c.l !== INK) || first; // o.lock: leaves for the ukpo lockups
  $('big').innerHTML = (o.icons.length > 1)
    ? `<div class="trio">${o.icons.map(c => `<figure>${icon(c).replace('<svg ', '<svg class="big3" ')}<figcaption>${c.label}</figcaption></figure>`).join('')}</div>`
    : icon(first).replace('<svg ', '<svg class="big" ');
  $('name').textContent = o.name;
  $('sub').textContent = (o.icons.length > 1) ? o.group : `${o.group} · background ${first.bg}`;
  $('count').textContent = `${idx + 1} / ${OPTIONS.length}`;
  $('sizes').innerHTML = o.icons.map(c => `<span class="sizeset">${((o.icons.length > 1) ? [32, 16] : [64, 32, 16]).map(px => icon(c, px)).join('')}</span>`).join('');
  const ink = coloured.l === INK;
  $('lockups').innerHTML = lockup(INK, ink ? INK : coloured.l, ink ? INK : coloured.r, PAPER, INK) +
                           lockup(SNOW, ink ? SNOW : coloured.l, ink ? SNOW : coloured.r, INK, SNOW);
  fillSlots($('jslots'), o.icons, dir, false);
  $('tabIcon').innerHTML = icon(first, 16);
  $('favicon').href = 'data:image/svg+xml,' + encodeURIComponent(icon(first));
  document.querySelectorAll('.cell').forEach((c, i) => c.classList.toggle('on', i === idx));
  if (document.body.dataset.phone === 'on') { buildPhone(); renderPhone(dir); }
  $('pcap').innerHTML = `<b>${o.name}</b> · ${idx + 1} / ${OPTIONS.length} · swipe to change`;
  history.replaceState(null, '', '#' + (idx + 1));
}
const SIG = '<svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
const WIFI = '<svg viewBox="0 0 16 12"><path d="M8 12 5.6 9.2a3.4 3.4 0 0 1 4.8 0zM8 4.2a8.6 8.6 0 0 1 6 2.4l-1.7 1.9a6 6 0 0 0-8.6 0L2 6.6A8.6 8.6 0 0 1 8 4.2zM8 0c3.4 0 6.4 1.3 8 3.2l-1.6 1.9A10 10 0 0 0 8 2.6a10 10 0 0 0-6.4 2.5L0 3.2C1.6 1.3 4.6 0 8 0z"/></svg>';
const BATT = '<svg viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2" y="2" width="17" height="8" rx="1.6"/><rect x="23.5" y="4" width="2" height="4" rx="1"/></svg>';
function buildPhone() {
  const android = document.body.dataset.os === 'android', rx = android ? 50 : 22;
  const a = (g, label) => `<div class="papp">${gsvg(g, rx)}<span>${label}</span></div>`;
  const n = OPTIONS[idx].icons.length;
  const jk = Array.from({ length: n }, (_, i) => `<div class="papp"><div class="pslot"><div class="phoneJukpo" data-i="${i}"></div></div><span>Jukpo</span></div>`);
  const fill = [a(MAPS, 'Maps'), a(WEATHER, 'Weather'), a(CLOCK, 'Clock')].slice(0, 4 - n);
  const grid = [a(MAIL, 'Mail'), a(CALENDAR, 'Calendar'), a(PHOTOS, 'Photos'), a(CAMERA, 'Camera'),
    ...jk, ...fill, a(NOTES, 'Notes'), a(MUSIC, 'Music'), a(FILES, 'Files'), a(SETTINGS, 'Settings')].join('');
  const time = new Date().toTimeString().slice(0, 5);
  $('phone').innerHTML = `<div class="screen">
    <div class="status">${android ? '<div class="punch"></div>' : '<div class="island"></div>'}<span>${time}</span><span class="sicons">${SIG}${WIFI}${BATT}</span></div>
    <div class="home">${grid}</div>
    <div class="pdots"><i></i><i></i></div>
    ${android
      ? `<div class="pdock" style="background:transparent;backdrop-filter:none">${[PHONE, MESSAGES, BROWSER, CAMERA].map(g => gsvg(g, 50)).join('')}</div><div class="search"><b>G</b><span>Search</span><span class="mic"></span></div>`
      : `<div class="pdock">${[PHONE, BROWSER, MESSAGES, MUSIC].map(g => gsvg(g, 22)).join('')}</div>`}
    <div class="bar"></div></div>`;
}
function renderPhone(dir) {
  const icons = OPTIONS[idx].icons, round = document.body.dataset.os === 'android';
  document.querySelectorAll('.phoneJukpo').forEach(el => {
    el.innerHTML = icon(icons[+el.dataset.i], 0, round);
    if (dir) el.classList.add(dir > 0 ? 'anim-up' : 'anim-down');
  });
}
function go(d) { idx = (idx + d + OPTIONS.length) % OPTIONS.length; render(d); }
function buildGrid() {
  const groups = [...new Set(OPTIONS.map(o => o.group))];
  $('grid').innerHTML = groups.map(g =>
    `<h2>${g}</h2><div class="cells${OPTIONS.find(o => o.group === g).icons.length > 1 ? ' wide' : ''}">` +
    OPTIONS.map((o, i) => o.group === g ? `<div class="cell" data-i="${i}"><div class="mini">${o.icons.map(c => icon(c)).join('')}</div><div>${o.name.split(' · ').pop()}</div></div>` : '').join('') +
    `</div>`).join('');
  $('grid').addEventListener('click', e => {
    const c = e.target.closest('.cell'); if (!c) return;
    idx = +c.dataset.i; render(0); $('grid').classList.remove('open');
  });
}

// input: swipe, wheel, keys, buttons
let ty = null;
addEventListener('touchstart', e => { if (!$('grid').classList.contains('open')) ty = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', e => {
  if (ty === null) return; const dy = e.changedTouches[0].clientY - ty; ty = null;
  if (Math.abs(dy) > 40) go(dy < 0 ? 1 : -1);
});
let wheelLock = 0;
addEventListener('wheel', e => {
  if ($('grid').classList.contains('open')) return;
  const now = Date.now(); if (now < wheelLock || Math.abs(e.deltaY) < 8) return;
  wheelLock = now + 320; go(e.deltaY > 0 ? 1 : -1);
}, { passive: true });
addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'j') go(1);
  else if (e.key === 'ArrowUp' || e.key === 'k') go(-1);
  else if (e.key === 'Escape') $('grid').classList.remove('open');
});
$('btnNext').onclick = () => go(1);
$('btnPrev').onclick = () => go(-1);
$('btnAll').onclick = () => $('grid').classList.toggle('open');
$('btnMode').onclick = () => {
  const dark = document.body.dataset.mode === 'light';
  document.body.dataset.mode = dark ? 'dark' : 'light';
  $('btnMode').textContent = dark ? 'Light' : 'Dark';
};
$('btnOS').onclick = () => {
  const android = document.body.dataset.os !== 'android';
  document.body.dataset.os = android ? 'android' : 'ios';
  $('btnOS').textContent = android ? 'iPhone' : 'Android';
  buildPhone(); renderPhone(0);
};

buildDock(); buildGrid();
$('tabOther').innerHTML = gsvg(BROWSER).replace('<svg ', '<svg width="16" height="16" ');
const start = parseInt(location.hash.slice(1), 10);
if (start >= 1 && start <= OPTIONS.length) idx = start - 1;
if (matchMedia('(prefers-color-scheme: dark)').matches) $('btnMode').click();
render(0);
}
