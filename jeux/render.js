// ============================================================
// RENDU PARTAGE - style NEO-BRUTALISME
// Script classique (pas de module). Depend de games-data.js
// charge AVANT ce fichier (variable globale GAMES).
// ============================================================

const MAX_ID = Math.max(...GAMES.map(g => g.id));

// Verifie si l'utilisateur peut acceder a un jeu selon son abonnement
function canAccessGame(g) {
  const SUB_ORDER = { free: 0, basic: 1, plus: 2, x: 3, max: 4, admin: 5 };
  const userLevel = SUB_ORDER[typeof USER_SUBSCRIPTION !== 'undefined' ? USER_SUBSCRIPTION : 'basic'] || 0;
  const requiredLevel = SUB_ORDER[g.requiredSubscription || 'basic'] || 0;
  return userLevel >= requiredLevel;
}

function isNew(g) { return g.id >= MAX_ID - 1; }
function isPopular(g) { return (g.categories || []).includes('popular'); }
function gamesByRecent() { 
  return [...GAMES].sort((a, b) => b.id - a.id); 
}

function sticker(g) {
  if (isNew(g)) return '<span class="sticker">NEW</span>';
  if (isPopular(g)) return '<span class="sticker pop">POP</span>';
  return '';
}

// Affiche le badge d'abonnement requis
function subBadge(g) {
  const SUB_LABELS = { free: "GRATUIT", basic: "BASIC", plus: "BUBBLE+", x: "BUBBLE X", max: "BUBBLE MAX", admin: "ADMIN" };
  const req = g.requiredSubscription || 'basic';
  if (req === 'basic') return '';
  const accessible = canAccessGame(g);
  const label = SUB_LABELS[req] || req;
  const icon = accessible ? '\u2705' : '\u274c';
  return `<span class="sub-badge ${accessible ? '' : 'locked'}" title="${accessible ? 'Accessible' : 'Abonnement requis: ' + label}">${icon} ${label}</span>`;
}

// Carte "sticker" a gros contour noir
function gameCard(g) {
  const accessible = canAccessGame(g);
  const SUB_LABELS = { free: "GRATUIT", basic: "BASIC", plus: "BUBBLE+", x: "BUBBLE X", max: "BUBBLE MAX", admin: "ADMIN" };
  const req = g.requiredSubscription || 'basic';
  const reqLabel = SUB_LABELS[req] || req;
  
  if (accessible) {
    return `
      <a class="card" href="${g.url}" target="_blank" rel="noopener" data-id="${g.id}">
        ${sticker(g)}
        ${subBadge(g)}
        <div class="shot"><img src="${g.image}" alt="${g.name}" onerror="this.style.opacity=.2"></div>
        <div class="cbody">
          <div class="cname">${g.name}</div>
          <div class="cdesc">${g.desc}</div>
          <span class="cplay">\u25b6 JOUER</span>
        </div>
      </a>`;
  } else {
    return `
      <div class="card disabled" data-id="${g.id}" onclick="alert('Il te faut un abonnement ${reqLabel} ou superieur pour jouer a ce jeu !')">
        ${sticker(g)}
        ${subBadge(g)}
        <div class="shot"><img src="${g.image}" alt="${g.name}" onerror="this.style.opacity=.2"></div>
        <div class="cbody">
          <div class="cname">${g.name}</div>
          <div class="cdesc">${g.desc}</div>
          <span class="cplay">\u25b6 JOUER</span>
        </div>
      </div>`;
  }
}

// Bloc "jeu a la une" (rempli dans .hero)
function heroMarkup(g) {
  const accessible = canAccessGame(g);
  const SUB_LABELS = { free: "GRATUIT", basic: "BASIC", plus: "BUBBLE+", x: "BUBBLE X", max: "BUBBLE MAX", admin: "ADMIN" };
  const req = g.requiredSubscription || 'basic';
  const reqLabel = SUB_LABELS[req] || req;
  
  if (accessible) {
    return `
    <div class="hero-in">
      <span class="hero-kick">\u2605 JEU A LA UNE</span>
      <div class="hero-title">${g.name}</div>
      <div class="hero-desc">${g.desc}</div>
      <a class="btn" href="${g.url}" target="_blank" rel="noopener">\u25b6 JOUER MAINTENANT</a>
    </div>
    <div class="hero-img"><img src="${g.image}" alt="${g.name}" onerror="this.style.opacity=.2"></div>`;
  } else {
    return `
    <div class="hero-in">
      <span class="hero-kick">\u2605 JEU A LA UNE</span>
      <div class="hero-title">${g.name} <span class="hero-sub-badge" style="background:var(--pink);color:#fff;font-size:.7rem;padding:2px 6px;border-radius:4px;border:1px solid var(--ink);">\u274c ${reqLabel}</span></div>
      <div class="hero-desc">${g.desc}</div>
      <a class="btn" href="#" onclick="alert('Il te faut un abonnement ${reqLabel} ou superieur pour jouer a ce jeu !');return false;" style="pointer-events:auto;">\u25b6 JOUER MAINTENANT</a>
    </div>
    <div class="hero-img" style="opacity:.5;"><img src="${g.image}" alt="${g.name}" onerror="this.style.opacity=.2" style="filter:grayscale(80%) brightness(1.2);"></div>`;
  }
}

// Menu mobile + annee du footer
function initChrome() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('menuClose');
  if (toggle && menu) {
    const shut = () => menu.classList.remove('open');
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    if (close) close.addEventListener('click', shut);
    window.addEventListener('resize', () => { if (window.innerWidth > 640) shut(); });
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
