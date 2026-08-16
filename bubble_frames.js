/* ══════════════════════════════════════════════════════════════════
   bubble_frames.js — NIVEAUX + CADRES DE PROFIL
   Les cadres sont dessinés en SVG autour de l'avatar. Chaque cadre est
   décrit dans window.FRAMES (bubble_data.js) par un anneau + des ornements.

   API :
     window.getLevel(xp, sub)         → { level, progress, xpNeeded, maxLevel, isMax }
     window.applyFrame(sub, level, id)→ dessine le cadre sur tous les avatars
     window.framesFor(sub)            → la série de cadres de cet abonnement
     window.frameUnlocked(frame, lvl) → true si le niveau suffit
     window.drawFrame(el, frameId, sub) → dessine un cadre dans un élément précis
   ══════════════════════════════════════════════════════════════════ */

const LEVEL_CONFIG = {
  basic: { maxLevel: 3,  xpPerLevel: 100, color: '#2BB7F2', dark: '#1690C6', symbol: '🫧', label: 'Bulle'     },
  plus:  { maxLevel: 20, xpPerLevel: 200, color: '#FFC53D', dark: '#DFA111', symbol: '✦',  label: 'Étoile +'  },
  x:     { maxLevel: 20, xpPerLevel: 300, color: '#38BDF8', dark: '#0284C7', symbol: '✕',  label: 'Étoile X'  },
  max:   { maxLevel: 25, xpPerLevel: 400, color: '#A855F7', dark: '#7E22CE', symbol: '🫧', label: 'Bulle MAX' },
};

function getLevel(xp, sub){
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  xp = Number(xp) || 0;
  const level  = Math.min(Math.floor(xp / cfg.xpPerLevel) + 1, cfg.maxLevel);
  const curXP  = (level - 1) * cfg.xpPerLevel;
  const nextXP = level < cfg.maxLevel ? level * cfg.xpPerLevel : curXP + cfg.xpPerLevel;
  const isMax  = level >= cfg.maxLevel;
  return {
    level,
    progress: isMax ? 100 : Math.min(((xp - curXP) / (nextXP - curXP)) * 100, 100),
    xpNeeded: isMax ? 0 : Math.max(nextXP - xp, 0),
    maxLevel: cfg.maxLevel, cfg, isMax,
  };
}

/* ══════════════════════════════════════
   LES ORNEMENTS — les briques de tes dessins
   Tout est dessiné dans un carré de 100×100, avatar centré, rayon 34.
══════════════════════════════════════ */
const C = 50;          /* centre */
const R = 37;          /* rayon de l'anneau */

const polar = (r, deg) => [ C + r * Math.cos(deg * Math.PI/180), C + r * Math.sin(deg * Math.PI/180) ];

/* Petite étoile à 4 branches (les "+" et "✦" de tes dessins) */
function star4(x, y, s, col, op){
  return `<path d="M${x} ${y-s} Q${x+s*.18} ${y-s*.18} ${x+s} ${y}
                   Q${x+s*.18} ${y+s*.18} ${x} ${y+s}
                   Q${x-s*.18} ${y+s*.18} ${x-s} ${y}
                   Q${x-s*.18} ${y-s*.18} ${x} ${y-s} Z"
           fill="${col}" opacity="${op ?? 1}"/>`;
}
/* Fleur / astérisque à 6 branches (série MAX) */
function flower(x, y, s, col, op){
  let p = '';
  for (let i = 0; i < 6; i++){
    const a = i * 60;
    const [x1,y1] = [ x + Math.cos(a*Math.PI/180)*s, y + Math.sin(a*Math.PI/180)*s ];
    p += `<ellipse cx="${x1}" cy="${y1}" rx="${s*.42}" ry="${s*.42}" fill="${col}" opacity="${op ?? 1}"/>`;
  }
  return p + `<circle cx="${x}" cy="${y}" r="${s*.3}" fill="${col}" opacity="${op ?? 1}"/>`;
}

const ORNAMENTS = {
  /* Petits points autour (BASIC niveau 1) */
  dots(col){
    return [20, 90, 160, 250, 320].map(a => {
      const [x,y] = polar(R + 6, a);
      return `<circle cx="${x}" cy="${y}" r="2.1" fill="${col}"/>`;
    }).join('');
  },

  /* Étincelles à 4 branches réparties autour */
  sparkles(col){
    return [30, 105, 180, 255, 330].map((a,i) => {
      const [x,y] = polar(R + 8, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.35}s">${star4(x, y, 4.2, col)}</g>`;
    }).join('');
  },

  /* Croix / "X" autour (série X) */
  crosses(col){
    return [25, 95, 165, 235, 305].map((a,i) => {
      const [x,y] = polar(R + 8, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.3}s" transform="rotate(45 ${x} ${y})">
                <rect x="${x-.9}" y="${y-4}" width="1.8" height="8" rx="0.9" fill="${col}"/>
                <rect x="${x-4}" y="${y-.9}" width="8" height="1.8" rx="0.9" fill="${col}"/>
              </g>`;
    }).join('');
  },

  /* Spirales (BASIC niveau 3) */
  spirals(col){
    return [200, 250, 300, 340].map(a => {
      const [x,y] = polar(R + 7, a);
      return `<path d="M${x} ${y} a2.6 2.6 0 1 1 -2.2 -2.2 a1.5 1.5 0 1 0 1.2 1.2"
               fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>`;
    }).join('');
  },

  /* Rayons au-dessus (le "soleil" de tes dessins) */
  rays(col){
    let p = '';
    for (let a = -140; a <= -40; a += 12.5){
      const [x1,y1] = polar(R + 3, a);
      const [x2,y2] = polar(R + 12, a);
      p += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    return `<g class="bf-pulse">${p}</g>`;
  },

  /* Couronne à pointes (les créneaux de tes dessins) */
  crown(col){
    const pts = [];
    for (let i = 0; i <= 8; i++){
      const a = -150 + i * (120 / 8);
      const [x,y] = polar(i % 2 ? R + 13 : R + 4, a);
      pts.push(`${x},${y}`);
    }
    return `<polyline points="${pts.join(' ')}" fill="none" stroke="${col}"
              stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  },

  /* Vraie couronne de roi (Bubble+ haut niveau) */
  king(col){
    const w = 30, b = C - R - 3, h = 15;   /* b = la base, juste au-dessus de l'anneau */
    return `<path d="M${C-w/2} ${b} L${C-w/2} ${b-h} L${C-w/4} ${b-h*.45}
                     L${C} ${b-h-4} L${C+w/4} ${b-h*.45} L${C+w/2} ${b-h} L${C+w/2} ${b} Z"
              fill="${col}" opacity=".95"/>
            <rect x="${C-w/2}" y="${b-1.5}" width="${w}" height="3.5" rx="1.6" fill="${col}"/>` +
           star4(C, b - h - 8, 3.6, col);
  },

  /* Éclats de cristal (série X) */
  shards(col){
    return [-125, -95, -65, -35, 200, 250].map(a => {
      const [x1,y1] = polar(R + 1, a - 7);
      const [x2,y2] = polar(R + 14, a);
      const [x3,y3] = polar(R + 1, a + 7);
      return `<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z" fill="${col}" opacity=".9"/>`;
    }).join('');
  },

  /* Fleurs / astérisques (série MAX) */
  flowers(col){
    return [20, 100, 175, 250, 320].map((a,i) => {
      const [x,y] = polar(R + 9, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.4}s">${flower(x, y, 3.4, col)}</g>`;
    }).join('');
  },

  /* Explosion / feu d'artifice au-dessus */
  burst(col){
    let p = '';
    for (let i = 0; i < 7; i++){
      const a = -145 + i * 18;
      const [x1,y1] = polar(R + 3, a);
      const [x2,y2] = polar(R + 10 + (i % 2 ? 6 : 0), a);
      p += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}"
              stroke-width="2.4" stroke-linecap="round"/>`;
      p += star4(x2, y2, 2.6, col);
    }
    return `<g class="bf-pulse">${p}</g>`;
  },
};

/* ══ Les formes d'anneau ══ */
function ringPath(shape, col, width, dashed){
  const dash = dashed ? ' stroke-dasharray="7 5.5"' : '';
  if (shape === 'star'){
    /* Étoile à 4 branches : la taille de la pointe fait tout.
       Le creux reste au bord de l'avatar, les pointes filent loin. */
    const pts = [];
    for (let i = 0; i < 8; i++){
      const a = -90 + i * 45;
      const [x,y] = polar(i % 2 ? R + 30 : R - 2, a);
      pts.push(`${x},${y}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="${col}"
              stroke-width="${width}" stroke-linejoin="round"${dash}/>`;
  }
  if (shape === 'square'){
    return `<rect x="${C-R}" y="${C-R}" width="${R*2}" height="${R*2}" rx="8"
              fill="none" stroke="${col}" stroke-width="${width}"${dash}/>`;
  }
  return `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="${col}"
            stroke-width="${width}"${dash}/>`;
}

/* ══ CSS injecté une seule fois ══ */
function injectCSS(){
  if (document.getElementById('bubble-frame-css')) return;
  const s = document.createElement('style');
  s.id = 'bubble-frame-css';
  s.textContent = `
  .bf-wrap{ position:absolute; inset:-22%; pointer-events:none; z-index:2; }
  .bf-wrap svg{ width:100%; height:100%; overflow:visible; display:block; }
  .bf-spin{ transform-origin:50% 50%; animation:bfSpin 14s linear infinite; }
  @keyframes bfSpin{ to{ transform:rotate(360deg) } }
  .bf-twinkle{ transform-origin:center; animation:bfTwinkle 2.4s ease-in-out infinite; }
  @keyframes bfTwinkle{ 0%,100%{ opacity:.45; transform:scale(.82) } 50%{ opacity:1; transform:scale(1.12) } }
  .bf-pulse{ transform-origin:50% 50%; animation:bfPulse 2.6s ease-in-out infinite; }
  @keyframes bfPulse{ 0%,100%{ opacity:.7 } 50%{ opacity:1 } }
  .bf-glow{ filter:drop-shadow(0 0 4px currentColor); }

  .profile-bubble, .big-avatar, .me-avatar, .preview-bubble{ overflow:visible; }
  .profile-bubble .lvl-chip{
    position:absolute; bottom:-4px; right:-6px; z-index:3;
    min-width:19px; height:19px; padding:0 5px; border-radius:999px;
    color:#fff; font-family:'Baloo 2',sans-serif; font-size:.66rem; font-weight:800;
    line-height:19px; text-align:center; border:2px solid #fff;
    box-shadow:0 1px 4px rgba(22,40,63,.25); pointer-events:none;
  }`;
  document.head.appendChild(s);
}

/* ══ Dessine un cadre dans un élément ══ */
function drawFrame(el, frameId, sub){
  injectCSS();
  const frame = findFrame(frameId, sub);
  if (!el) return;

  el.querySelector('.bf-wrap')?.remove();
  if (!frame){ el.style.border = ''; return; }

  const col  = frame.color || (LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic).color;
  const orn  = (frame.ornaments || []).map(o => ORNAMENTS[o] ? ORNAMENTS[o](col) : '').join('');
  const spin = frame.spin ? ' bf-spin' : '';
  const glow = frame.glow ? ' bf-glow' : '';

  const wrap = document.createElement('div');
  wrap.className = 'bf-wrap';
  wrap.style.color = col;
  wrap.innerHTML =
    `<svg viewBox="0 0 100 100" class="${glow.trim()}">
       ${ringPath(frame.shape || 'circle', col, frame.width || 4, frame.dashed)}
       <g class="${spin.trim()}">${orn}</g>
     </svg>`;
  el.appendChild(wrap);
  el.style.border = 'none';         /* l'anneau SVG remplace la bordure CSS */
}

/* ══ Les cadres d'un abonnement ══ */
function framesFor(sub){
  const all = window.FRAMES || {};
  return all[sub] || all.basic || [];
}
function findFrame(id, sub){
  if (!id) return null;
  for (const s of ['basic','plus','x','max']){
    const hit = framesFor(s).find(f => f.id === id);
    if (hit) return hit;
  }
  return null;
}
function frameUnlocked(frame, level){ return (frame?.level || 1) <= (level || 1); }

/* Le meilleur cadre débloqué, si le joueur n'a rien choisi */
function defaultFrame(sub, level){
  const list = framesFor(sub).filter(f => frameUnlocked(f, level));
  return list.length ? list[list.length - 1] : null;
}

/* ══ Applique le cadre partout sur la page ══ */
function applyFrame(sub, level, chosenId){
  injectCSS();
  const cfg   = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  let frame   = chosenId ? findFrame(chosenId, sub) : null;
  if (frame && !frameUnlocked(frame, level)) frame = null;
  if (!frame) frame = defaultFrame(sub, level);

  document.querySelectorAll('.profile-bubble, .big-avatar, .me-avatar').forEach(el => {
    drawFrame(el, frame?.id, sub);

    if (el.classList.contains('profile-bubble')){
      let chip = el.querySelector('.lvl-chip');
      if (!chip){
        chip = document.createElement('span');
        chip.className = 'lvl-chip';
        el.appendChild(chip);
      }
      chip.textContent = level;
      chip.style.background = cfg.color;
      chip.style.color = sub === 'plus' ? '#4A3200' : '#fff';
    }
  });
  return frame;
}

/* ══ Symboles de niveau (page profil) ══ */
function renderLevelBadges(level, sub){
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  let html = '';
  if (sub === 'basic'){
    for (let i = 1; i <= cfg.maxLevel; i++)
      html += `<span class="lvl-symbol ${i <= level ? 'on' : 'off'}">${cfg.symbol}</span>`;
  } else {
    for (let i = 1; i <= Math.min(level, cfg.maxLevel); i++)
      html += `<span class="lvl-symbol on" style="color:${cfg.color}">${cfg.symbol}</span>`;
  }
  return html;
}

window.LEVEL_CONFIG      = LEVEL_CONFIG;
window.getLevel          = getLevel;
window.applyFrame        = applyFrame;
window.drawFrame         = drawFrame;
window.framesFor         = framesFor;
window.findFrame         = findFrame;
window.frameUnlocked     = frameUnlocked;
window.defaultFrame      = defaultFrame;
window.renderLevelBadges = renderLevelBadges;
