/* ══════════════════════════════════════════════════════════════════
   bubble_effects.js — Préférence clair / sombre de Bubble Site
   Les anciens thèmes de fond liés au profil ont été supprimés : le rendu du
   site reste cohérent quelle que soit la collection ou l'effet de l'utilisateur.
   ══════════════════════════════════════════════════════════════════ */

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
      setMode(root.dataset.colorMode === 'dark' ? 'light' : 'dark', true);
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
