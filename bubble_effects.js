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
