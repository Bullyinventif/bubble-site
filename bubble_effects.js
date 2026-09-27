/* ══════════════════════════════════════════════════════════════════
   bubble_effects.js — Préférence clair / sombre de Bubble Site
   Les anciens thèmes de fond liés au profil ont été supprimés : le rendu du
   site reste cohérent quelle que soit la collection ou l'effet de l'utilisateur.
   ══════════════════════════════════════════════════════════════════ */

/* Identité visuelle partagée par toutes les pages. */
const BUBBLE_PAGE = (() => {
  const root = document.documentElement;
  const path = decodeURIComponent(window.location.pathname).toLowerCase();

  function fromPath(value){
    if (/bubble_site_abonnements\.html$/.test(value)) return 'subscriptions';
    if (/jeux\/jeux\.html$/.test(value)) return 'games';
    if (/bubble_site_scans\.html$/.test(value)) return 'scans';
    if (/bubble_site_gacha\.html$/.test(value)) return 'gacha';
    if (/bubble_site_vlog\.html$/.test(value)) return 'vlog';
    if (/(bubble_site_profil|login)\.html$/.test(value)) return 'profile';
    if (/(^|\/)index\.html$/.test(value) || value.endsWith('/')) return 'home';
    return null;
  }

  const palettes = {
    light:{
      home:['#F5FAFF','#E7F2FC','#F1F6FB'],
      subscriptions:['#FFF9E8','#FFE9A8','#F8E0A0'],
      games:['#F4F7FA','#E3EAF0','#EEF2F6'],
      scans:['#F1FFF3','#C9FBD5','#E5F9EA'],
      gacha:['#FBF3FF','#E5CCFA','#F3E9FC'],
      vlog:['#FAF1F9','#E8CCE5','#F4E5EF'],
      profile:['#FFF3E9','#E9C4A5','#F6DDC8']
    },
    dark:{
      home:['#101722','#172535','#111C29'],
      subscriptions:['#1C170B','#3A2A0C','#241D0E'],
      games:['#111821','#24303D','#171F29'],
      scans:['#0B1C11','#123B20','#102718'],
      gacha:['#1C1025','#38164A','#24142F'],
      vlog:['#21101F','#3E1937','#291526'],
      profile:['#24150F','#482718','#2D1A12']
    }
  };

  const current = fromPath(path) || 'home';
  root.dataset.page = current;
  return {
    current,
    fromPath,
    palette(page, mode){ return palettes[mode === 'dark' ? 'dark' : 'light'][page] || palettes.light.home; }
  };
})();

(function initColorMode(){
  const STORAGE_KEY = 'bubble-color-mode';
  const root = document.documentElement;
  const systemPrefersDark = () => window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  function storedMode(){
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  }

  function setMode(mode, persist = false){
    const next = mode === 'dark' ? 'dark' : 'light';
    root.dataset.colorMode = next;
    if (persist){
      try { localStorage.setItem(STORAGE_KEY, next); }
      catch (_) { /* navigation privée : le choix reste actif pour cette page */ }
    }
    const toggle = document.getElementById('themeToggle');
    if (toggle){
      const dark = next === 'dark';
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
      toggle.querySelector('span').textContent = dark ? '☀️' : '🌙';
    }
    document.dispatchEvent(new CustomEvent('bubblecolormodechange'));
  }

  function installToggle(){
    const nav = document.querySelector('body[data-v2] nav');
    if (!nav || document.getElementById('themeToggle')) return;
    const toggle = document.createElement('button');
    toggle.id = 'themeToggle';
    toggle.className = 'theme-toggle';
    toggle.type = 'button';
    toggle.innerHTML = '<span aria-hidden="true"></span>';
    toggle.addEventListener('click', () => {
      const next = root.dataset.colorMode === 'dark' ? 'light' : 'dark';
      const reducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!document.startViewTransition || reducedMotion){
        setMode(next, true);
        return;
      }

      root.classList.add('theme-transitioning');
      const transition = document.startViewTransition(() => setMode(next, true));
      transition.finished.finally(() => root.classList.remove('theme-transitioning'));
    });
    nav.appendChild(toggle);
    setMode(root.dataset.colorMode);
  }

  const initial = storedMode() || (systemPrefersDark() ? 'dark' : 'light');
  setMode(initial);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installToggle);
  else installToggle();

  window.setBubbleColorMode = (mode) => setMode(mode, true);
})();

/* Navigation synchronisée : le dégradé se transforme avant le chargement,
   puis révèle la destination sans masquer la barre de navigation. */
(function initPageNavigation(){
  const STORAGE_KEY = 'bubble-page-navigation';
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function makeOverlay(colors){
    const previous = document.getElementById('page-gradient-transition');
    if (previous) previous.remove();
    const overlay = document.createElement('div');
    overlay.id = 'page-gradient-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.setProperty('--transition-c1', colors[0]);
    overlay.style.setProperty('--transition-c2', colors[1]);
    overlay.style.setProperty('--transition-c3', colors[2]);
    document.body.appendChild(overlay);
    return overlay;
  }

  function saveTransition(state){
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { /* Certains aperçus file:// isolent le stockage par page. */ }
  }

  function takeTransition(){
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }

  function eligible(link, event){
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return null;
    if (link.target && link.target !== '_self' || link.hasAttribute('download')) return null;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return null;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return null;
    const page = BUBBLE_PAGE.fromPath(decodeURIComponent(destination.pathname).toLowerCase());
    return page ? { destination, page } : null;
  }

  function revealEntry(){
    const state = takeTransition();
    if (!state || state.to !== BUBBLE_PAGE.current || Date.now() - state.at > 5000 || reducedMotion) return;
    const mode = document.documentElement.dataset.colorMode;
    const overlay = makeOverlay(BUBBLE_PAGE.palette(BUBBLE_PAGE.current, mode));
    document.body.classList.add('page-is-entering');
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('is-revealing')));
    window.setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('page-is-entering');
    }, 720);
  }

  function start(){
    if (!document.body || document.body.dataset.v2 === undefined) return;
    revealEntry();
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const target = eligible(link, event);
      if (!target || reducedMotion) return;

      event.preventDefault();
      const mode = document.documentElement.dataset.colorMode;
      const from = BUBBLE_PAGE.palette(BUBBLE_PAGE.current, mode);
      const to = BUBBLE_PAGE.palette(target.page, mode);
      const overlay = makeOverlay(from);
      link.classList.add('is-gate-opening');
      document.body.classList.add('page-is-leaving');
      saveTransition({ from:BUBBLE_PAGE.current, to:target.page, at:Date.now() });

      void overlay.offsetWidth;
      overlay.style.setProperty('--transition-c1', to[0]);
      overlay.style.setProperty('--transition-c2', to[1]);
      overlay.style.setProperty('--transition-c3', to[2]);
      window.setTimeout(() => window.location.assign(target.destination.href), 640);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* Bulles de fond par défaut — ce décor ne dépend d'aucun thème de profil. */
(function initBackgroundBubbles(){
  function start(){
    if (!document.body || document.body.dataset.v2 === undefined ||
        document.getElementById('bubble-bg-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'bubble-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);

    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let bubbles = [];
    let animationId = null;

    function random(min, max){ return min + Math.random() * (max - min); }

    function makeBubble(anywhere = true){
      return {
        x:random(0, width),
        y:anywhere ? random(0, height) : height + random(10, 90),
        radius:random(9, 34),
        speed:random(.18, .55),
        drift:random(-.18, .18),
        phase:random(0, Math.PI * 2),
        alpha:random(.12, .28)
      };
    }

    function resize(){
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(16, Math.min(34, Math.round(width / 48)));
      bubbles = Array.from({ length:count }, () => makeBubble(true));
      draw();
    }

    function draw(){
      context.clearRect(0, 0, width, height);
      const dark = document.documentElement.dataset.colorMode === 'dark';
      const color = dark ? '125,211,252' : '43,183,242';

      bubbles.forEach((bubble) => {
        const gradient = context.createRadialGradient(
          bubble.x - bubble.radius * .32,
          bubble.y - bubble.radius * .32,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        );
        gradient.addColorStop(0, `rgba(255,255,255,${bubble.alpha * .95})`);
        gradient.addColorStop(.62, `rgba(${color},${bubble.alpha * .38})`);
        gradient.addColorStop(1, `rgba(${color},0)`);
        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
        context.strokeStyle = `rgba(${color},${bubble.alpha * .72})`;
        context.lineWidth = 1.2;
        context.stroke();
      });
    }

    function animate(){
      bubbles.forEach((bubble) => {
        bubble.y -= bubble.speed;
        bubble.phase += .012;
        bubble.x += bubble.drift + Math.sin(bubble.phase) * .12;
        if (bubble.y < -bubble.radius * 2) Object.assign(bubble, makeBubble(false));
        if (bubble.x < -bubble.radius) bubble.x = width + bubble.radius;
        if (bubble.x > width + bubble.radius) bubble.x = -bubble.radius;
      });
      draw();
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize, { passive:true });
    document.addEventListener('bubblecolormodechange', draw);
    document.addEventListener('visibilitychange', () => {
      if (reducedMotion) return;
      if (document.hidden && animationId){
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (!document.hidden && !animationId){
        animationId = requestAnimationFrame(animate);
      }
    });

    resize();
    if (!reducedMotion) animationId = requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
