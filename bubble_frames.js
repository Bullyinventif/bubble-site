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
  /* Abonnement caché des comptes admin : même progression que MAX. */
  admin: { maxLevel: 25, xpPerLevel: 400, color: '#E84A8A', dark: '#B02F6B', symbol: '🛠️', label: 'Admin'     },
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

/* Une VRAIE bulle : contour + reflet (série BASIC) */
function bubble(x, y, s, col, op){
  return `<g opacity="${op ?? 1}">
    <circle cx="${x}" cy="${y}" r="${s}" fill="${col}" opacity=".26"/>
    <circle cx="${x}" cy="${y}" r="${s}" fill="none" stroke="${col}" stroke-width="${Math.max(1.2, s*.3)}"/>
    <ellipse cx="${x - s*.34}" cy="${y - s*.36}" rx="${Math.max(.9, s*.3)}" ry="${Math.max(.7, s*.23)}"
             fill="#fff" opacity=".95" transform="rotate(-35 ${x - s*.34} ${y - s*.36})"/>
  </g>`;
}

/* Un petit joyau taillé (série BUBBLE+) */
function jewel(x, y, s, col){
  return `<path d="M${x} ${y-s} L${x+s*.78} ${y} L${x} ${y+s} L${x-s*.78} ${y} Z" fill="${col}"/>
          <path d="M${x} ${y-s} L${x+s*.78} ${y} L${x} ${y} Z" fill="#fff" opacity=".45"/>`;
}

const ORNAMENTS = {
  /* ── Série BASIC : de vraies bulles ── */

  /* Une seule petite bulle (niveau 1) */
  bubble1(col){
    const [x,y] = polar(R + 7, -48);
    return `<g class="bf-float">${bubble(x, y, 3.4, col)}</g>`;
  },

  /* Quelques bulles de tailles différentes qui flottent (niveau 2) */
  bubbleFew(col){
    const set = [[-55, 4.6], [10, 3.0], [125, 5.2], [205, 2.6], [255, 3.8]];
    return set.map(([a, s], i) => {
      const [x,y] = polar(R + 6 + s*.6, a);
      return `<g class="bf-float" style="animation-delay:${i*.55}s">${bubble(x, y, s, col)}</g>`;
    }).join('');
  },

  /* Une couronne de mousse tout autour (niveau 3) */
  bubbleCrown(col){
    const sizes = [2.4, 6.6, 3.2, 5.0, 7.2, 2.6, 5.6, 3.4, 6.2, 2.2];
    return sizes.map((s, i) => {
      const a = i * 36 + 12;
      const [x,y] = polar(R + 10 + s*.8, a);
      return `<g class="bf-float" style="animation-delay:${(i%5)*.42}s">${bubble(x, y, s, col)}</g>`;
    }).join('');
  },

  /* Petits points autour (BASIC niveau 1) */
  dots(col){
    return [20, 90, 160, 250, 320].map(a => {
      const [x,y] = polar(R + 6, a);
      return `<circle cx="${x}" cy="${y}" r="2.1" fill="${col}"/>`;
    }).join('');
  },

  /* ── Série BUBBLE+ : or et royauté ── */

  /* Deux étincelles discrètes (niveau 1) */
  sparkFew(col){
    return [-58, 145].map((a,i) => {
      const [x,y] = polar(R + 7, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.7}s">${star4(x, y, 3.6, col)}</g>`;
    }).join('');
  },

  /* Couronne de laurier qui remonte des deux côtés */
  laurel(col){
    let p = '';
    for (const dir of [1, -1]){
      for (let i = 0; i < 6; i++){
        const a   = 90 + dir * (16 + i * 16);
        const s   = 5 - i * .38;
        const [x,y] = polar(R + 4.5 + s * .45, a);
        p += `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s*.4}" fill="${col}" opacity=".95"
                transform="rotate(${a + (dir > 0 ? 116 : 64)} ${x} ${y})"/>`;
      }
    }
    /* le nœud du bas */
    const [bx,by] = polar(R + 5, 90);
    return p + `<circle cx="${bx}" cy="${by}" r="2.2" fill="${col}"/>`;
  },

  /* La couronne impériale du dernier niveau : plus large, 7 pointes */
  crownRoyal(col){
    const b = C - R - 1, w = 46, h = 22;
    const x0 = C - w/2, x1 = C + w/2;
    const pts = [];
    for (let i = 0; i <= 12; i++){
      const t = i / 12;
      const x = x0 + w * t;
      const up = i % 2 === 0;
      const mid = 1 - Math.abs(t - .5) * 1.5;      /* les pointes du centre sont plus hautes */
      pts.push([x, up ? b - h * (.45 + mid * .62) : b - h * .2]);
    }
    let out = `<path d="M${x0} ${b} L${pts.map(q => q.join(' ')).join(' L')} L${x1} ${b} Z" fill="${col}"/>
               <rect x="${x0 - 2}" y="${b - 3}" width="${w + 4}" height="5.4" rx="2.7" fill="${col}"/>`;
    pts.forEach((q, i) => { if (i % 2 === 0) out += jewel(q[0], q[1] - 2.4, i === 6 ? 3 : 1.9,
                                    i === 6 ? '#FF6363' : (i % 4 ? '#7DD3FC' : '#46CE62')); });
    return out + jewel(C, b - .2, 2.4, '#FF6363');
  },

  /* Vraie couronne de roi à 5 pointes, avec ses joyaux */
  crownBig(col){
    const b = C - R - 1, w = 34, h = 17;
    const x0 = C - w/2, x1 = C + w/2;
    const pts = [
      [x0, b], [x0 + 1.5, b - h*.72], [x0 + w*.26, b - h*.26],
      [C, b - h*1.16],
      [x1 - w*.26, b - h*.26], [x1 - 1.5, b - h*.72], [x1, b],
    ];
    return `<path d="M${pts.map(q => q.join(' ')).join(' L')} Z" fill="${col}"/>
            <rect x="${x0 - 1.4}" y="${b - 2.4}" width="${w + 2.8}" height="4.6" rx="2.3" fill="${col}"/>`
      + jewel(C, b - h*1.16 - 3.4, 2.8, '#FF6363')
      + jewel(x0 + 1.5, b - h*.72 - 2.6, 2, '#7DD3FC')
      + jewel(x1 - 1.5, b - h*.72 - 2.6, 2, '#7DD3FC')
      + jewel(C, b - .1, 2.1, '#FF6363');
  },

  /* Joyaux incrustés dans l'anneau lui-même */
  gems(col){
    const cols = ['#FF6363','#7DD3FC','#46CE62','#FF6363','#7DD3FC','#46CE62'];
    return [40, 90, 140, 220, 270, 320].map((a,i) => {
      const [x,y] = polar(R + 1, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.28}s">
                <circle cx="${x}" cy="${y}" r="5" fill="${col}"/>
                <circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#fff" stroke-width=".8" opacity=".5"/>
                ${jewel(x, y, 3.2, cols[i])}</g>`;
    }).join('');
  },

  /* Étincelles à 4 branches réparties autour */
  sparkles(col){
    return [30, 105, 180, 255, 330].map((a,i) => {
      const [x,y] = polar(R + 8, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.35}s">${star4(x, y, 4.2, col)}</g>`;
    }).join('');
  },

  /* ── Série BUBBLE X : glace et cristal ── */

  /* Trois petits flocons discrets (niveau 1) */
  frost(col){
    return [-70, 60, 190].map((a,i) => {
      const [x,y] = polar(R + 7, a);
      return `<g class="bf-twinkle" style="animation-delay:${i*.5}s" transform="rotate(45 ${x} ${y})">
                <rect x="${x-.8}" y="${y-3.4}" width="1.6" height="6.8" rx=".8" fill="${col}"/>
                <rect x="${x-3.4}" y="${y-.8}" width="6.8" height="1.6" rx=".8" fill="${col}"/></g>`;
    }).join('');
  },

  /* Éclats pointus tout autour (niveau 5) */
  shardsAll(col){
    return Array.from({length:10}, (_,i) => {
      const a  = i * 36;
      const ln = i % 2 ? 7 : 12;
      const [x1,y1] = polar(R + 1, a - 6);
      const [x2,y2] = polar(R + ln, a);
      const [x3,y3] = polar(R + 1, a + 6);
      return `<path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z" fill="${col}" opacity=".92"/>`;
    }).join('');
  },

  /* Traits de facettes sur le cristal (niveau 10) */
  facets(col){
    let p = '';
    for (let i = 0; i < 6; i++){
      const a = -90 + i * 60;
      const [x1,y1] = polar(R - 4, a);
      const [x2,y2] = polar(R + 2, a + 30);
      p += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}"
              stroke-width="1.5" opacity=".75" stroke-linecap="round"/>`;
    }
    return p;
  },

  /* Grands pics de glace (niveau 20) */
  icePeaks(col){
    return Array.from({length:6}, (_,i) => {
      const a  = -90 + i * 60;
      const [x1,y1] = polar(R + 2, a - 13);
      const [x2,y2] = polar(R + 27, a);
      const [x3,y3] = polar(R + 2, a + 13);
      const [m1,n1] = polar(R + 13, a);
      return `<g class="bf-twinkle" style="animation-delay:${(i%4)*.35}s">
        <path d="M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z" fill="${col}" opacity=".55"/>
        <path d="M${x1} ${y1} L${m1} ${n1} L${x3} ${y3} Z" fill="${col}" opacity=".9"/></g>`;
    }).join('');
  },

  /* ── Série BUBBLE MAX : cosmos et orbites ── */

  /* Une petite lune qui tourne (niveau 1) */
  moon(col){
    const [x,y] = polar(R + 8, -50);
    return `<circle cx="${x}" cy="${y}" r="3.4" fill="${col}"/>
            <circle cx="${x-1.1}" cy="${y-1.2}" r="1.1" fill="#fff" opacity=".7"/>`;
  },

  /* L'anneau de Saturne, incliné, avec deux planètes (niveau 8) */
  saturn(col){
    const [x1,y1] = [C - 46, C + 12], [x2,y2] = [C + 44, C - 14];
    return `<g transform="rotate(-18 ${C} ${C})">
      <ellipse cx="${C}" cy="${C}" rx="47" ry="15" fill="none" stroke="${col}"
               stroke-width="2.2" opacity=".85"/>
      <ellipse cx="${C}" cy="${C}" rx="47" ry="15" fill="none" stroke="${col}"
               stroke-width="1" opacity=".45" stroke-dasharray="3 4"/></g>
      <circle cx="${x1}" cy="${y1}" r="4" fill="${col}"/>
      <circle cx="${x1-1.3}" cy="${y1-1.4}" r="1.3" fill="#fff" opacity=".65"/>
      <circle cx="${x2}" cy="${y2}" r="2.8" fill="${col}"/>`;
  },

  /* Constellation : des étoiles reliées entre elles (niveau 16) */
  constellation(col){
    const angs = [-115, -60, 5, 68, 130, 185, 240];
    const pts  = angs.map((a,i) => polar(R + (i % 2 ? 13 : 7), a));
    let p = `<polyline points="${pts.map(q => q.join(',')).join(' ')}" fill="none"
               stroke="${col}" stroke-width="1" opacity=".55"/>`;
    pts.forEach(([x,y], i) => {
      p += `<g class="bf-twinkle" style="animation-delay:${(i%4)*.4}s">${star4(x, y, i % 2 ? 4 : 2.6, col)}</g>`;
    });
    return p;
  },

  /* Poussière d'étoiles (niveau 22) */
  stardust(col){
    let p = '';
    for (let i = 0; i < 26; i++){
      const a = i * 13.8;
      const [x,y] = polar(R + 4 + (i % 5) * 3.6, a);
      p += `<circle cx="${x}" cy="${y}" r="${(i % 3) * .5 + .7}" fill="${col}"
              opacity="${.3 + (i % 4) * .18}"/>`;
    }
    return p;
  },

  /* L'explosion finale : rayons tout autour + étoiles au bout (niveau 25) */
  bigbang(col){
    let p = '';
    for (let i = 0; i < 16; i++){
      const a  = i * 22.5;
      const ln = i % 2 ? 10 : 19;
      const [x1,y1] = polar(R + 3, a);
      const [x2,y2] = polar(R + ln, a);
      p += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}"
              stroke-width="${i % 2 ? 1.6 : 2.8}" stroke-linecap="round" opacity=".9"/>`;
      if (i % 2 === 0) p += star4(x2, y2, 3, col);
    }
    return `<g class="bf-pulse">${p}</g>`;
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
function ringPath(shape, col, width, dashed, r){
  r = r || R;
  const dash = dashed ? ' stroke-dasharray="7 5.5"' : '';

  /* Anneau en segments (façon engrenage) */
  if (shape === 'gear'){
    const n = 14, gap = 5;
    const circ = 2 * Math.PI * r;
    return `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${col}"
              stroke-width="${width}" stroke-linecap="round"
              stroke-dasharray="${(circ/n - gap).toFixed(2)} ${gap}"/>`;
  }
  /* Hexagone */
  if (shape === 'hex'){
    const pts = [];
    for (let i = 0; i < 6; i++){ const [x,y] = polar(r + 3, -90 + i*60); pts.push(`${x},${y}`); }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="${col}"
              stroke-width="${width}" stroke-linejoin="round"${dash}/>`;
  }
  if (shape === 'star'){
    /* Étoile à 4 branches : la taille de la pointe fait tout.
       Le creux reste au bord de l'avatar, les pointes filent loin. */
    const pts = [];
    for (let i = 0; i < 8; i++){
      const a = -90 + i * 45;
      const [x,y] = polar(i % 2 ? r + 30 : r - 2, a);
      pts.push(`${x},${y}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="none" stroke="${col}"
              stroke-width="${width}" stroke-linejoin="round"${dash}/>`;
  }
  if (shape === 'square'){
    return `<rect x="${C-r}" y="${C-r}" width="${r*2}" height="${r*2}" rx="8"
              fill="none" stroke="${col}" stroke-width="${width}"${dash}/>`;
  }
  return `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="${col}"
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
  .bf-float{ transform-origin:center; animation:bfFloat 3.4s ease-in-out infinite; }
  @keyframes bfFloat{ 0%,100%{ transform:translateY(1.6px) scale(.94) } 50%{ transform:translateY(-1.6px) scale(1.06) } }
  .bf-spin-slow{ transform-origin:50% 50%; animation:bfSpin 26s linear infinite reverse; }
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

  /* La couleur vient de la SÉRIE du cadre, pas de l'abonnement de celui qui
     le regarde : sinon un cadre BASIC porté par un MAX devient violet. */
  const col  = frame.color
            || (LEVEL_CONFIG[frame.tier] || LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic).color;
  const orn  = (frame.ornaments || []).map(o => ORNAMENTS[o] ? ORNAMENTS[o](col) : '').join('');
  const spin = frame.spin ? ' bf-spin' : '';
  const glow = frame.glow ? ' bf-glow' : '';

  /* Un dégradé sur l'anneau si le cadre en demande un */
  const uid  = 'bfg' + (drawFrame._n = (drawFrame._n || 0) + 1);
  const defs = frame.grad
    ? `<defs><linearGradient id="${uid}" x1="0" y1="0" x2="0.4" y2="1">
         <stop offset="0" stop-color="${frame.grad[0]}"/>
         <stop offset="1" stop-color="${frame.grad[1]}"/></linearGradient></defs>`
    : '';
  const paint = frame.grad ? `url(#${uid})` : col;

  /* Anneau extérieur facultatif : { shape, width, dashed, r, spin } */
  const o = frame.outer;
  const outer = o
    ? `<g class="${o.spin ? 'bf-spin-slow' : ''}">
         ${ringPath(o.shape || 'circle', o.color || col, o.width || 1.6, o.dashed, o.r || (R + 9))}
       </g>`
    : '';

  const wrap = document.createElement('div');
  wrap.className = 'bf-wrap';
  wrap.style.color = col;
  wrap.innerHTML =
    `<svg viewBox="0 0 100 100" class="${glow.trim()}">
       ${defs}
       ${outer}
       ${ringPath(frame.shape || 'circle', paint, frame.width || 4, frame.dashed)}
       <g class="${spin.trim()}">${orn}</g>
     </svg>`;
  el.appendChild(wrap);
  el.style.border = 'none';         /* l'anneau SVG remplace la bordure CSS */
}

/* ══ Les cadres d'un abonnement ══
   Les séries se CUMULENT : un MAX a aussi les cadres X, + et BASIC.
   Seule la série "admin" reste réservée aux comptes admin. */
const TIER_ORDER = ['basic','plus','x','max'];

function framesFor(sub){
  const all  = window.FRAMES || {};
  const tag  = (list, tier) => (list || []).map(f => ({ ...f, tier }));
  if (sub === 'admin')
    return TIER_ORDER.flatMap(t => tag(all[t], t)).concat(tag(all.admin, 'admin'));
  const i = TIER_ORDER.indexOf(sub);
  return TIER_ORDER.slice(0, (i < 0 ? 0 : i) + 1).flatMap(t => tag(all[t], t));
}

/* Tous les cadres du jeu, admin compris (pour retrouver un id) */
function allFrames(){
  const all = window.FRAMES || {};
  return TIER_ORDER.concat('admin').flatMap(t => (all[t] || []).map(f => ({ ...f, tier:t })));
}
function findFrame(id){
  if (!id) return null;
  return allFrames().find(f => f.id === id) || null;
}
/* Un cadre est débloqué si :
     • un admin l'a offert (champ Firestore "framesUnlocked"), OU
     • il vient d'une série INFÉRIEURE à ton abonnement → tout est débloqué
       (un MAX a d'office tous les cadres BASIC, + et X), OU
     • c'est ta propre série et ton niveau suffit.
   La série admin n'est débloquée que pour les comptes admin. */
function frameUnlocked(frame, level, sub){
  if (!frame) return false;
  if ((window.__frameGrants || []).includes(frame.id)) return true;

  const me   = sub || window.__userSub || 'basic';
  const tier = frame.tier || 'basic';

  if (tier === 'admin') return me === 'admin';
  if (me === 'admin')   return true;

  const ti = TIER_ORDER.indexOf(tier);
  const mi = TIER_ORDER.indexOf(me);
  if (ti >= 0 && mi > ti) return true;          /* série inférieure : cadeau */

  return (frame.level || 1) <= (level || 1);
}

/* Est-ce que ce cadre vient d'une série inférieure (donc offert) ? */
function frameIsBonus(frame, sub){
  const me = sub || window.__userSub || 'basic';
  if (!frame || frame.tier === 'admin') return false;
  if (me === 'admin') return true;
  return TIER_ORDER.indexOf(me) > TIER_ORDER.indexOf(frame.tier || 'basic');
}

/* Le meilleur cadre débloqué, si le joueur n'a rien choisi */
function defaultFrame(sub, level){
  const list = framesFor(sub).filter(f => frameUnlocked(f, level, sub));
  return list.length ? list[list.length - 1] : null;
}

/* ══ Applique le cadre partout sur la page ══ */
function applyFrame(sub, level, chosenId){
  injectCSS();
  const cfg   = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  let frame   = chosenId ? findFrame(chosenId, sub) : null;
  if (frame && !frameUnlocked(frame, level, sub)) frame = null;
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
window.frameIsBonus      = frameIsBonus;
window.defaultFrame      = defaultFrame;
window.allFrames         = allFrames;
window.TIER_ORDER        = TIER_ORDER;
window.renderLevelBadges = renderLevelBadges;
