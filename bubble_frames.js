/* ══════════════════════════════════════════════════════════════════
   bubble_frames.js — Cadres de profil (version claire)
   Remplace les 5 copies de applyFrame() qui traînaient dans les pages.
   API :
     window.applyFrame(sub, level)   → applique le cadre à tous les .profile-bubble
     window.getLevel(xp, sub)        → { level, progress, xpNeeded, maxLevel, isMax }
     window.LEVEL_CONFIG             → config des paliers
   ══════════════════════════════════════════════════════════════════ */

const LEVEL_CONFIG = {
  basic: { maxLevel: 3,  xpPerLevel: 100, color: '#2BB7F2', dark: '#1690C6', symbol: '🫧', label: 'Bulle'      },
  plus:  { maxLevel: 20, xpPerLevel: 200, color: '#FFC53D', dark: '#DFA111', symbol: '✦',  label: 'Étoile +'   },
  x:     { maxLevel: 20, xpPerLevel: 300, color: '#38BDF8', dark: '#0284C7', symbol: '✕',  label: 'Étoile X'   },
  max:   { maxLevel: 25, xpPerLevel: 400, color: '#A855F7', dark: '#7E22CE', symbol: '🫧', label: 'Bulle MAX'  },
};

function getLevel(xp, sub){
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  xp = Number(xp) || 0;
  const level   = Math.min(Math.floor(xp / cfg.xpPerLevel) + 1, cfg.maxLevel);
  const curXP   = (level - 1) * cfg.xpPerLevel;
  const nextXP  = level < cfg.maxLevel ? level * cfg.xpPerLevel : curXP + cfg.xpPerLevel;
  const isMax   = level >= cfg.maxLevel;
  return {
    level,
    progress: isMax ? 100 : Math.min(((xp - curXP) / (nextXP - curXP)) * 100, 100),
    xpNeeded: isMax ? 0 : Math.max(nextXP - xp, 0),
    maxLevel: cfg.maxLevel,
    cfg, isMax,
  };
}

/* ── CSS injecté une seule fois ── */
function injectFrameCSS(){
  if (document.getElementById('bubble-frame-css')) return;
  const s = document.createElement('style');
  s.id = 'bubble-frame-css';
  s.textContent = `
  .profile-bubble{
    --ring: #CBD8E8;
    --ring-soft: rgba(203,216,232,.35);
    border: 3px solid var(--ring) !important;
    box-shadow: 0 0 0 3px var(--ring-soft), 0 3px 10px rgba(22,40,63,.12);
    transition: border-color .3s, box-shadow .3s;
  }

  /* Palier atteint : l'anneau respire doucement */
  .profile-bubble.frame-breathe{ animation: frameBreathe 3s ease-in-out infinite; }
  @keyframes frameBreathe{
    0%,100%{ box-shadow: 0 0 0 3px var(--ring-soft), 0 3px 10px rgba(22,40,63,.12); }
    50%    { box-shadow: 0 0 0 6px var(--ring-soft), 0 3px 14px rgba(22,40,63,.16); }
  }

  /* Haut niveau : anneau dégradé qui tourne lentement autour de l'avatar */
  .profile-bubble.frame-orbit::before{
    content:''; position:absolute; inset:-8px;
    border-radius:50%; z-index:-1;
    background: conic-gradient(from 0deg,
      var(--ring) 0deg, transparent 90deg,
      var(--ring) 180deg, transparent 270deg, var(--ring) 360deg);
    opacity:.55;
    animation: frameSpin 5s linear infinite;
  }
  @keyframes frameSpin{ to{ transform: rotate(360deg); } }

  /* Badge de niveau, collé en bas à droite de l'avatar */
  .profile-bubble .lvl-chip{
    position:absolute; bottom:-4px; right:-6px;
    min-width:19px; height:19px; padding:0 5px;
    border-radius:999px;
    background: var(--ring); color:#fff;
    font-family:'Baloo 2',sans-serif; font-size:.66rem; font-weight:800;
    line-height:19px; text-align:center;
    border:2px solid #fff;
    box-shadow:0 1px 4px rgba(22,40,63,.25);
    pointer-events:none;
  }
  .profile-bubble.lvl-chip-yellow .lvl-chip{ color:#4A3200; }

  /* Grand avatar de la page profil */
  .big-avatar{ position:relative; }
  `;
  document.head.appendChild(s);
}

/* ── Applique le cadre ── */
function applyFrame(sub, level, opts){
  injectFrameCSS();
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  level = Number(level) || 1;
  const ratio = Math.min(level / cfg.maxLevel, 1);

  /* Plus le niveau est haut, plus l'anneau est net */
  const soft = hexToRgba(cfg.color, .18 + ratio * .3);
  const showChip  = opts?.chip !== false;
  const breathe   = ratio >= .34;              // 1/3 du chemin
  const orbit     = ratio >= .7;               // dernier tiers

  const targets = document.querySelectorAll(opts?.selector || '.profile-bubble, .big-avatar');
  targets.forEach(el => {
    el.style.setProperty('--ring', cfg.color);
    el.style.setProperty('--ring-soft', soft);
    el.classList.toggle('frame-breathe', breathe);
    el.classList.toggle('frame-orbit', orbit);
    el.classList.toggle('lvl-chip-yellow', sub === 'plus');

    /* La pastille de niveau ne s'affiche que sur les petits avatars de la nav */
    if (showChip && el.classList.contains('profile-bubble')){
      let chip = el.querySelector('.lvl-chip');
      if (!chip){
        chip = document.createElement('span');
        chip.className = 'lvl-chip';
        el.appendChild(chip);
      }
      chip.textContent = level;
    }
  });
}

function hexToRgba(hex, a){
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

/* ── Symboles de niveau (page profil) ── */
function renderLevelBadges(level, sub){
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  let html = '';
  const shown = Math.min(level, cfg.maxLevel);
  if (sub === 'basic'){
    for (let i = 1; i <= cfg.maxLevel; i++)
      html += `<span class="lvl-symbol ${i <= level ? 'on' : 'off'}">${cfg.symbol}</span>`;
  } else {
    for (let i = 1; i <= shown; i++)
      html += `<span class="lvl-symbol on" style="color:${cfg.color}">${cfg.symbol}</span>`;
  }
  return html;
}

window.LEVEL_CONFIG      = LEVEL_CONFIG;
window.getLevel          = getLevel;
window.applyFrame        = applyFrame;
window.renderLevelBadges = renderLevelBadges;
