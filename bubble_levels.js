/* ══════════════════════════════════════
   BUBBLE INC. — SYSTÈME DE NIVEAUX
   bubble_levels.js
   Importé sur toutes les pages
══════════════════════════════════════ */

/* ── XP par action ── */
export const XP_ACTIONS = {
  scan_read:       50,   // Lire un scan
  game_played:     30,   // Jouer à un jeu
  daily_login:     20,   // Connexion quotidienne
  profile_updated: 10,   // Modifier son profil
};

/* ── Config niveaux par abonnement ── */
export const LEVEL_CONFIG = {
  basic: {
    maxLevel: 3,
    xpPerLevel: 100,      // 100 XP par niveau
    symbol: '🫧',
    label: 'Bulle',
    colors: ['#5bc8ff', '#2e7dd4'],
  },
  plus: {
    maxLevel: 20,
    xpPerLevel: 200,
    symbol: '✦',
    label: 'Étoile +',
    colors: ['#ffcc00', '#e6a800'],
  },
  x: {
    maxLevel: 20,
    xpPerLevel: 300,
    symbol: '✕',
    label: 'Étoile X',
    colors: ['#44ccff', '#0099dd'],
  },
  max: {
    maxLevel: 25,
    xpPerLevel: 400,
    symbol: '🫧',
    label: 'Bulle MAX',
    colors: ['#cc44ff', '#8800cc'],
  },
};

/* ── Calcule le niveau depuis l'XP ── */
export function getLevel(xp, sub) {
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  const level = Math.min(Math.floor(xp / cfg.xpPerLevel) + 1, cfg.maxLevel);
  const currentLevelXP = (level - 1) * cfg.xpPerLevel;
  const nextLevelXP    = level < cfg.maxLevel ? level * cfg.xpPerLevel : currentLevelXP + cfg.xpPerLevel;
  const progress       = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return { level, progress: Math.min(progress, 100), xpNeeded: nextLevelXP - xp, cfg };
}

/* ══════════════════════════════════════
   CADRES DE PROFIL — CSS injecté dynamiquement
══════════════════════════════════════ */

/* ── Génère le CSS du cadre selon abonnement + niveau ── */
function getFrameStyle(sub, level) {
  if (sub === 'basic') {
    // Bulles simples bleues
    const intensity = level / 3;
    return {
      border: `3px solid rgba(91,200,255,${0.5 + intensity * 0.5})`,
      boxShadow: `0 0 ${8 + level * 4}px rgba(91,200,255,${0.4 + intensity * 0.3}), 0 0 ${16 + level * 6}px rgba(46,125,212,0.3)`,
      animation: 'frame-pulse-basic',
    };
  }
  if (sub === 'plus') {
    // Étoiles + jaunes, éclat croissant
    const glow = 6 + level * 2;
    return {
      border: `3px solid rgba(255,200,0,${0.4 + (level/20)*0.6})`,
      boxShadow: `0 0 ${glow}px rgba(255,200,0,0.7), 0 0 ${glow*2}px rgba(230,168,0,0.4), inset 0 0 ${glow/2}px rgba(255,220,0,0.15)`,
      animation: level >= 10 ? 'frame-shimmer-plus' : 'frame-pulse-plus',
    };
  }
  if (sub === 'x') {
    // Étoiles X cyan
    const glow = 6 + level * 2;
    return {
      border: `3px solid rgba(68,204,255,${0.4 + (level/20)*0.6})`,
      boxShadow: `0 0 ${glow}px rgba(68,204,255,0.7), 0 0 ${glow*2}px rgba(0,153,221,0.4), inset 0 0 ${glow/2}px rgba(68,204,255,0.15)`,
      animation: level >= 10 ? 'frame-shimmer-x' : 'frame-pulse-x',
    };
  }
  if (sub === 'max') {
    // Bulles scintillantes violet/rose
    const glow = 8 + level * 2;
    return {
      border: `3px solid rgba(204,68,255,${0.5 + (level/25)*0.5})`,
      boxShadow: `0 0 ${glow}px rgba(204,68,255,0.8), 0 0 ${glow*2}px rgba(136,0,204,0.5), 0 0 ${glow*3}px rgba(180,80,255,0.2), inset 0 0 ${glow/2}px rgba(220,100,255,0.2)`,
      animation: level >= 15 ? 'frame-shimmer-max' : 'frame-pulse-max',
    };
  }
  return { border: '2px solid rgba(255,255,255,0.3)', boxShadow: 'none', animation: '' };
}

/* ── Injecte le CSS des animations (une seule fois) ── */
function injectFrameCSS() {
  if (document.getElementById('bubble-frame-css')) return;
  const style = document.createElement('style');
  style.id = 'bubble-frame-css';
  style.textContent = `
    /* Basic — bulles bleues */
    @keyframes frame-pulse-basic {
      0%,100% { box-shadow: 0 0 8px rgba(91,200,255,0.4), 0 0 16px rgba(46,125,212,0.2); }
      50%      { box-shadow: 0 0 16px rgba(91,200,255,0.8), 0 0 28px rgba(46,125,212,0.5); }
    }
    /* Plus — étoiles jaunes */
    @keyframes frame-pulse-plus {
      0%,100% { box-shadow: 0 0 8px rgba(255,200,0,0.5), 0 0 16px rgba(230,168,0,0.3); }
      50%      { box-shadow: 0 0 16px rgba(255,200,0,0.9), 0 0 28px rgba(230,168,0,0.6); }
    }
    @keyframes frame-shimmer-plus {
      0%   { box-shadow: 0 0 14px rgba(255,200,0,0.8), 0 0 28px rgba(230,168,0,0.5); border-color: rgba(255,220,0,0.9); }
      33%  { box-shadow: 0 0 20px rgba(255,230,0,1),   0 0 40px rgba(255,200,0,0.7); border-color: rgba(255,240,100,1); }
      66%  { box-shadow: 0 0 14px rgba(255,180,0,0.8), 0 0 28px rgba(200,140,0,0.5); border-color: rgba(255,180,0,0.9); }
      100% { box-shadow: 0 0 14px rgba(255,200,0,0.8), 0 0 28px rgba(230,168,0,0.5); border-color: rgba(255,220,0,0.9); }
    }
    /* X — étoiles cyan */
    @keyframes frame-pulse-x {
      0%,100% { box-shadow: 0 0 8px rgba(68,204,255,0.5), 0 0 16px rgba(0,153,221,0.3); }
      50%      { box-shadow: 0 0 16px rgba(68,204,255,0.9), 0 0 28px rgba(0,153,221,0.6); }
    }
    @keyframes frame-shimmer-x {
      0%   { box-shadow: 0 0 14px rgba(68,204,255,0.8), 0 0 28px rgba(0,153,221,0.5); border-color: rgba(68,220,255,0.9); }
      33%  { box-shadow: 0 0 22px rgba(100,230,255,1),  0 0 44px rgba(68,204,255,0.7); border-color: rgba(150,240,255,1); }
      66%  { box-shadow: 0 0 14px rgba(0,180,255,0.8),  0 0 28px rgba(0,120,200,0.5); border-color: rgba(0,200,255,0.9); }
      100% { box-shadow: 0 0 14px rgba(68,204,255,0.8), 0 0 28px rgba(0,153,221,0.5); border-color: rgba(68,220,255,0.9); }
    }
    /* MAX — bulles scintillantes violet */
    @keyframes frame-pulse-max {
      0%,100% { box-shadow: 0 0 12px rgba(204,68,255,0.6), 0 0 24px rgba(136,0,204,0.4); }
      50%      { box-shadow: 0 0 22px rgba(204,68,255,1),   0 0 40px rgba(136,0,204,0.7); }
    }
    @keyframes frame-shimmer-max {
      0%   { box-shadow: 0 0 16px rgba(204,68,255,0.9),  0 0 32px rgba(136,0,204,0.6),  0 0 48px rgba(180,80,255,0.3);  border-color: rgba(220,100,255,0.95); }
      25%  { box-shadow: 0 0 24px rgba(255,100,255,1),   0 0 48px rgba(180,0,255,0.8),  0 0 64px rgba(220,80,255,0.4);  border-color: rgba(255,150,255,1); }
      50%  { box-shadow: 0 0 20px rgba(180,0,255,0.9),   0 0 40px rgba(100,0,200,0.7),  0 0 56px rgba(150,0,220,0.3);  border-color: rgba(200,80,255,0.95); }
      75%  { box-shadow: 0 0 28px rgba(255,80,220,1),    0 0 56px rgba(200,0,255,0.8),  0 0 72px rgba(255,100,255,0.4); border-color: rgba(255,120,240,1); }
      100% { box-shadow: 0 0 16px rgba(204,68,255,0.9),  0 0 32px rgba(136,0,204,0.6),  0 0 48px rgba(180,80,255,0.3);  border-color: rgba(220,100,255,0.95); }
    }
    /* Bulle de profil avec cadre */
    .profile-bubble.framed {
      transition: box-shadow 0.3s, border-color 0.3s;
    }
  `;
  document.head.appendChild(style);
}

/* ── Applique le cadre sur tous les éléments .profile-bubble ── */
export function applyFrame(sub, level) {
  injectFrameCSS();
  const frame = getFrameStyle(sub, level);
  const bubbles = document.querySelectorAll('.profile-bubble');
  bubbles.forEach(b => {
    b.style.border     = frame.border;
    b.style.boxShadow  = frame.boxShadow;
    if (frame.animation) {
      b.style.animation = `${frame.animation} ${sub === 'max' ? '2s' : '2.5s'} ease-in-out infinite`;
    }
    b.classList.add('framed');
  });
}

/* ── Génère les symboles de niveau ── */
export function renderLevelBadges(level, sub) {
  const cfg = LEVEL_CONFIG[sub] || LEVEL_CONFIG.basic;
  let html = '';

  if (sub === 'basic') {
    // Bulles bleues simples
    for (let i = 1; i <= cfg.maxLevel; i++) {
      const active = i <= level;
      html += `<span class="lvl-symbol ${active ? 'active' : 'inactive'}" title="Niveau ${i}">🫧</span>`;
    }
  } else if (sub === 'plus') {
    // Étoiles +
    for (let i = 1; i <= Math.min(level, 20); i++) {
      html += `<span class="lvl-symbol active plus" title="Niveau ${i}">✦</span>`;
    }
  } else if (sub === 'x') {
    // Étoiles X
    for (let i = 1; i <= Math.min(level, 20); i++) {
      html += `<span class="lvl-symbol active x-sym" title="Niveau ${i}">✕</span>`;
    }
  } else if (sub === 'max') {
    // Bulles MAX
    for (let i = 1; i <= Math.min(level, 25); i++) {
      html += `<span class="lvl-symbol active max-sym" title="Niveau ${i}">🫧</span>`;
    }
  }
  return html;
}

/* ── Ajoute l'XP en Firebase ── */
export async function addXP(db, userId, action) {
  const { doc, getDoc, setDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  const xpGain = XP_ACTIONS[action] || 0;
  if (!xpGain) return;
  try {
    await setDoc(doc(db, 'users', userId), { xp: increment(xpGain) }, { merge: true });
  } catch(e) { console.warn('XP save failed:', e); }
}
