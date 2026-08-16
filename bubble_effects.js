/* ══════════════════════════════════════════════════════════════════
   bubble_effects.js — Thèmes Bubble Inc. (version fond CLAIR)
   Même API qu'avant : window.applyTheme(effectType)
   Ce que ça fait :
     1. teinte le fond de la page selon le thème
     2. met à jour --accent / --accent-soft (utilisés par style.css)
     3. dessine les particules du thème sur un canvas de fond
   ══════════════════════════════════════════════════════════════════ */

/* ── Fond dégradé clair par thème ── */
const THEME_BG = {
  null:      ['#F2F8FF','#E7F1FC','#EFF4FA'],
  bubbles:   ['#F2F8FF','#E7F1FC','#EFF4FA'],
  lightning: ['#F6F2FF','#EDE6FC','#F3F0FB'],
  snow:      ['#F4FAFF','#E8F4FD','#EFF6FC'],
  fire:      ['#FFF6EF','#FFEDE0','#FDF2EA'],
  sparkles:  ['#FFFBEE','#FFF5DC','#FCF7E8'],
  aura:      ['#FAF4FF','#F2E7FD','#F6F0FC'],
  aurora:    ['#F0FCFA','#E3F7F3','#EDF8F7'],
  portal:    ['#FFF9EE','#FDEFDA','#FAF3E7'],
  leaves:    ['#F3FBF1','#E8F6E4','#EFF7ED'],
};

/* ── Couleur d'accent (boutons focus, icônes, cadres) ── */
const THEME_ACCENT = {
  null:      '#2BB7F2',
  bubbles:   '#2BB7F2',
  lightning: '#8B5CF6',
  snow:      '#4BA8E8',
  fire:      '#F97316',
  sparkles:  '#E8A700',
  aura:      '#A855F7',
  aurora:    '#0FB5A0',
  portal:    '#E09B00',
  leaves:    '#3EAE55',
};

/* ── Palette des particules (visibles sur fond clair) ── */
const P = {
  bubbles:   ['#4EC0F5','#7BD3F7','#2BB7F2'],
  lightning: ['#8B5CF6','#A78BFA','#6D28D9'],
  snow:      ['#7EC4EE','#A8D8F5','#5BA9DD'],
  fire:      ['#F97316','#FB923C','#EA580C'],
  sparkles:  ['#F0B400','#FFCE3D','#E0A011'],
  aura:      ['#A855F7','#C084FC','#7E22CE'],
  aurora:    ['#10B9A2','#22D3C4','#0E9488'],
  portal:    ['#E09B00','#F5B942','#C77E00'],
  leaves:    ['#3EAE55','#6CC77E','#2E8B45'],
};

/* ── Helpers ── */
function rnd(min, max){ return min + Math.random() * (max - min); }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
function hexA(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

function createBgCanvas(){
  const old = document.getElementById('bubble-theme-canvas');
  if (old) old.remove();
  const c = document.createElement('canvas');
  c.id = 'bubble-theme-canvas';
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.insertBefore(c, document.body.firstChild);
  const fit = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
  fit();
  window.addEventListener('resize', fit);
  return c;
}

/* ══════════════ LES THÈMES ══════════════ */

/* ── BULLES (défaut) ── */
function initBubbles(w, h){
  return [...Array(26)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), r: rnd(8, 34),
    speed: rnd(.25, .75), alpha: rnd(.10, .26),
    col: pick(P.bubbles), ph: rnd(0, Math.PI * 2)
  }));
}
function tickBubbles(p, ctx, w, h){
  ctx.clearRect(0, 0, w, h);
  p.forEach(b => {
    b.y -= b.speed; b.x += Math.sin(b.ph) * .5; b.ph += .012;
    if (b.y < -b.r * 2){ b.y = h + b.r; b.x = rnd(0, w); }
    const g = ctx.createRadialGradient(b.x - b.r*.35, b.y - b.r*.35, 0, b.x, b.y, b.r);
    g.addColorStop(0, hexA('#FFFFFF', b.alpha * .9));
    g.addColorStop(.6, hexA(b.col, b.alpha * .55));
    g.addColorStop(1, hexA(b.col, 0));
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.strokeStyle = hexA(b.col, b.alpha * .7); ctx.lineWidth = 1.2; ctx.stroke();
  });
}

/* ── ÉCLAIRS ── */
function initLightning(w, h){
  return { bolts: [], timer: 0, motes: [...Array(30)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), vx: rnd(-.3, .3), vy: rnd(-.3, .3),
    r: rnd(1.5, 3.5), alpha: rnd(.15, .4), col: pick(P.lightning)
  }))};
}
function tickLightning(s, ctx, w, h, dt){
  ctx.clearRect(0, 0, w, h);
  s.timer += dt;
  if (s.timer > rnd(1100, 2600)){
    s.timer = 0;
    const bolt = { segs: [], life: 1 };
    let x = rnd(w * .15, w * .85), y = 0;
    while (y < h){ bolt.segs.push({ x: x + rnd(-16, 16), y }); y += rnd(16, 30); }
    s.bolts.push(bolt);
  }
  s.bolts = s.bolts.filter(b => b.life > 0);
  s.bolts.forEach(b => {
    b.life -= .035;
    ctx.save();
    ctx.strokeStyle = hexA('#7C3AED', b.life * .55);
    ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(b.segs[0].x, 0);
    b.segs.forEach(sg => ctx.lineTo(sg.x, sg.y));
    ctx.stroke();
    ctx.strokeStyle = hexA('#C4B5FD', b.life * .8); ctx.lineWidth = .9; ctx.stroke();
    ctx.restore();
  });
  s.motes.forEach(m => {
    m.x += m.vx; m.y += m.vy;
    if (m.x < 0) m.x = w; if (m.x > w) m.x = 0;
    if (m.y < 0) m.y = h; if (m.y > h) m.y = 0;
    ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI*2);
    ctx.fillStyle = hexA(m.col, m.alpha); ctx.fill();
  });
}

/* ── NEIGE ── */
function initSnow(w, h){
  return [...Array(55)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), r: rnd(2, 6), speed: rnd(.2, .6),
    alpha: rnd(.18, .45), ph: rnd(0, Math.PI*2), rot: rnd(0, Math.PI), col: pick(P.snow)
  }));
}
function tickSnow(p, ctx, w, h){
  ctx.clearRect(0, 0, w, h);
  p.forEach(b => {
    b.y += b.speed; b.x += Math.sin(b.ph) * .4; b.ph += .018; b.rot += .008;
    if (b.y > h + 10){ b.y = -10; b.x = rnd(0, w); }
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.strokeStyle = hexA(b.col, b.alpha); ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++){
      ctx.save(); ctx.rotate(i * Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, b.r * 1.8); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  });
}

/* ── FEU (braises qui montent) ── */
function initFire(w, h){
  return [...Array(45)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), r: rnd(2.5, 7), speed: rnd(.4, 1.1),
    life: rnd(.2, 1), alpha: rnd(.2, .5), col: pick(P.fire)
  }));
}
function tickFire(p, ctx, w, h){
  ctx.clearRect(0, 0, w, h);
  p.forEach(b => {
    b.y -= b.speed; b.x += (Math.random() - .5) * .9; b.life -= .006;
    if (b.life <= 0 || b.y < -10){ b.y = h + b.r; b.x = rnd(0, w); b.life = rnd(.5, 1); }
    const a = b.life * b.alpha;
    const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.2);
    g.addColorStop(0, hexA(b.col, a));
    g.addColorStop(1, hexA(b.col, 0));
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 2.2, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
  });
}

/* ── ÉTINCELLES (petites étoiles) ── */
function initSparkles(w, h){
  return [...Array(48)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), r: rnd(2, 6),
    vx: rnd(-.25, .25), vy: rnd(-.45, -.1),
    alpha: rnd(.15, .45), life: rnd(.3, 1), maxLife: rnd(.5, 1), col: pick(P.sparkles)
  }));
}
function tickSparkles(p, ctx, w, h){
  ctx.clearRect(0, 0, w, h);
  p.forEach(b => {
    b.x += b.vx; b.y += b.vy; b.life -= .004;
    if (b.life <= 0){ b.x = rnd(0, w); b.y = rnd(h * .4, h + 20); b.life = b.maxLife; }
    ctx.save(); ctx.translate(b.x, b.y);
    ctx.fillStyle = hexA(b.col, b.life * b.alpha);
    ctx.beginPath();
    for (let i = 0; i < 5; i++){
      const a1 = i * Math.PI * 2 / 5 - Math.PI / 2, a2 = a1 + Math.PI / 5;
      i === 0 ? ctx.moveTo(Math.cos(a1)*b.r, Math.sin(a1)*b.r)
              : ctx.lineTo(Math.cos(a1)*b.r, Math.sin(a1)*b.r);
      ctx.lineTo(Math.cos(a2)*b.r*.42, Math.sin(a2)*b.r*.42);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  });
}

/* ── AURA (halos qui respirent) ── */
function initAura(w, h){
  return { t: 0, orbs: [...Array(10)].map(() => ({
    angle: rnd(0, Math.PI*2), r: rnd(.22, .48), speed: rnd(.15, .4),
    size: rnd(20, 46), alpha: rnd(.05, .13)
  }))};
}
function tickAura(s, ctx, w, h, dt){
  ctx.clearRect(0, 0, w, h);
  s.t += dt * .0004;
  const cx = w/2, cy = h/2, maxR = Math.min(w, h) * .48;
  for (let i = 0; i < 3; i++){
    const r = maxR * (.5 + i*.2) + Math.sin(s.t*1.1 + i) * 18;
    const g = ctx.createRadialGradient(cx, cy, r*.65, cx, cy, r);
    g.addColorStop(0, hexA('#A855F7', 0));
    g.addColorStop(1, hexA('#A855F7', .05 - i*.012));
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
  }
  s.orbs.forEach(o => {
    o.angle += o.speed * dt * .0004;
    const x = cx + Math.cos(o.angle) * maxR * o.r;
    const y = cy + Math.sin(o.angle) * maxR * o.r;
    const g = ctx.createRadialGradient(x, y, 0, x, y, o.size);
    g.addColorStop(0, hexA('#C084FC', o.alpha * 2));
    g.addColorStop(1, hexA('#C084FC', 0));
    ctx.beginPath(); ctx.arc(x, y, o.size, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
  });
}

/* ── AURORE (voiles ondulants) ── */
function initAurora(){ return { t: 0 }; }
function tickAurora(s, ctx, w, h, dt){
  ctx.clearRect(0, 0, w, h);
  s.t += dt * .00035;
  const cols = ['#10B9A2','#22D3C4','#4EC0F5','#0E9488'];
  cols.forEach((col, i) => {
    const base = h * (.18 + i * .1);
    const g = ctx.createLinearGradient(0, base - 90, 0, base + 150);
    g.addColorStop(0, hexA(col, 0));
    g.addColorStop(.45, hexA(col, .10));
    g.addColorStop(1, hexA(col, 0));
    ctx.beginPath(); ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10){
      const y = base + Math.sin(x * .004 + s.t * (1 + i*.25) + i) * 42
                     + Math.sin(x * .011 + s.t * 1.6) * 14;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(w, base + 160); ctx.lineTo(0, base + 160); ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
  });
}

/* ── PORTAIL (anneaux + poussière d'étoiles) ── */
function initPortal(w, h){
  return { t: 0, stars: [...Array(60)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), r: rnd(1, 3),
    alpha: rnd(.12, .4), tw: rnd(0, Math.PI*2)
  }))};
}
function tickPortal(s, ctx, w, h, dt){
  ctx.clearRect(0, 0, w, h);
  s.t += dt * .0005;
  const cx = w/2, cy = h/2;
  s.stars.forEach(st => {
    st.tw += dt * .0012;
    const a = st.alpha * (.45 + Math.sin(st.tw) * .55);
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    ctx.fillStyle = hexA('#E09B00', a); ctx.fill();
  });
  for (let i = 0; i < 5; i++){
    const r = 90 + i * 62 + Math.sin(s.t + i) * 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, s.t * (1 + i*.18), s.t * (1 + i*.18) + Math.PI * (1.1 + i*.12));
    ctx.strokeStyle = hexA('#E09B00', .16 - i*.022);
    ctx.lineWidth = 2.2; ctx.stroke();
  }
}

/* ── FEUILLES ── */
function initLeaves(w, h){
  return [...Array(30)].map(() => ({
    x: rnd(0, w), y: rnd(0, h), vx: rnd(-.35, .35), vy: rnd(.2, .55),
    r: rnd(5, 12), rot: rnd(0, Math.PI*2), rs: rnd(-.022, .022),
    alpha: rnd(.14, .35), col: pick(P.leaves)
  }));
}
function tickLeaves(p, ctx, w, h){
  ctx.clearRect(0, 0, w, h);
  p.forEach(b => {
    b.y += b.vy; b.x += b.vx + Math.sin(b.rot) * .35; b.rot += b.rs;
    if (b.y > h + 14){ b.y = -14; b.x = rnd(0, w); }
    if (b.x < -14) b.x = w + 14; if (b.x > w + 14) b.x = -14;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.beginPath(); ctx.ellipse(0, 0, b.r * .55, b.r, 0, 0, Math.PI*2);
    ctx.fillStyle = hexA(b.col, b.alpha); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -b.r); ctx.lineTo(0, b.r);
    ctx.strokeStyle = hexA('#FFFFFF', b.alpha * .8); ctx.lineWidth = .9; ctx.stroke();
    ctx.restore();
  });
}

/* ── Table des thèmes ── */
const THEMES = {
  bubbles:   { init: initBubbles,   tick: tickBubbles },
  lightning: { init: initLightning, tick: tickLightning },
  snow:      { init: initSnow,      tick: tickSnow },
  fire:      { init: initFire,      tick: tickFire },
  sparkles:  { init: initSparkles,  tick: tickSparkles },
  aura:      { init: initAura,      tick: tickAura },
  aurora:    { init: initAurora,    tick: tickAurora },
  portal:    { init: initPortal,    tick: tickPortal },
  leaves:    { init: initLeaves,    tick: tickLeaves },
};

/* ══════════════ MOTEUR ══════════════ */
let _rafId = null;
let _resizeHandler = null;
let _applied = false;   /* un thème a-t-il déjà été appliqué par la page ? */

function applyBgGradient(type){
  const c = THEME_BG[type] || THEME_BG.bubbles;
  document.body.style.background =
    `linear-gradient(165deg, ${c[0]} 0%, ${c[1]} 55%, ${c[2]} 100%)`;
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.minHeight = '100vh';
}

function applyAccent(type){
  const a = THEME_ACCENT[type] || THEME_ACCENT.bubbles;
  const n = parseInt(a.slice(1), 16);
  document.documentElement.style.setProperty('--accent', a);
  document.documentElement.style.setProperty('--accent-soft',
    `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},.14)`);
}

function applyTheme(effectType){
  /* Les pages pas encore refaites (ancien design sombre) portent pas d'attribut
     data-v2 : on ne touche ni à leur fond ni à leur canvas, sinon leur texte
     blanc deviendrait illisible. À supprimer quand tout le site sera en v2. */
  if (!document.body || document.body.dataset.v2 === undefined) return;

  if (_rafId){ cancelAnimationFrame(_rafId); _rafId = null; }
  if (_resizeHandler){ window.removeEventListener('resize', _resizeHandler); _resizeHandler = null; }

  const type = (!effectType || effectType === 'none') ? 'bubbles' : effectType;
  _applied = true;

  applyBgGradient(type);
  applyAccent(type);
  document.body.dataset.theme = type;

  const theme = THEMES[type] || THEMES.bubbles;

  /* Respecte "réduire les animations" du système */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const old = document.getElementById('bubble-theme-canvas');
    if (old) old.remove();
    return;
  }

  const canvas = createBgCanvas();
  const ctx = canvas.getContext('2d');
  const w = () => canvas.width, h = () => canvas.height;
  let state = theme.init(w(), h());

  _resizeHandler = () => { state = theme.init(w(), h()); };
  window.addEventListener('resize', _resizeHandler);

  let last = 0;
  function loop(ts){
    const dt = Math.min(ts - last, 50); last = ts;
    theme.tick(state, ctx, w(), h(), dt);
    _rafId = requestAnimationFrame(loop);
  }
  _rafId = requestAnimationFrame(loop);
}

/* Compatibilité avec l'ancien nom */
window.applyAvatarEffect = applyTheme;
window.applyTheme = applyTheme;

/* Thème par défaut dès le chargement (évite le fond blanc au 1er rendu).
   On ne l'applique QUE si la page n'a pas déjà choisi son thème entre-temps,
   sinon on écraserait l'effet de l'utilisateur au moment du DOMContentLoaded. */
function applyDefaultTheme(){ if (!_applied) applyTheme(null); }
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', applyDefaultTheme);
} else {
  applyDefaultTheme();
}
