/**
 * BUBBLE SITE — Transitions de page fluides & micro-interactions
 * Aucune dépendance externe (pas de GSAP). Tout en CSS + JS natif.
 */

(function () {
  'use strict';

  /* ── Thèmes de couleur par page ── */
  const PAGE_THEMES = {
    'index':                        { bg: '#EFF4FA', accent: '#2BB7F2' },
    'accueil':                      { bg: '#EFF4FA', accent: '#2BB7F2' },
    'bubble_site_scans':            { bg: '#EFF4FA', accent: '#46CE62' },
    'bubble_site_gacha':            { bg: '#EFF4FA', accent: '#A855F7' },
    'bubble_site_vlog':             { bg: '#EFF4FA', accent: '#FF5FA2' },
    'bubble_site_abonnements':      { bg: '#EFF4FA', accent: '#FFC53D' },
    'bubble_site_profil':           { bg: '#EFF4FA', accent: '#2BB7F2' },
    'bubble_site_reader':           { bg: '#EFF4FA', accent: '#46CE62' },
    'login':                        { bg: '#EFF4FA', accent: '#2BB7F2' },
    'jeux/jeux':                    { bg: '#EFF4FA', accent: '#FFC53D' },
    'jeux/index':                   { bg: '#EFF4FA', accent: '#FFC53D' },
    'jeux/classement':              { bg: '#EFF4FA', accent: '#FFC53D' },
    'jeux/login':                   { bg: '#EFF4FA', accent: '#2BB7F2' },
  };

  function getPageName() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'index.html';
    if (last === 'index.html' || last === '') {
      return parts.length > 1 && parts[parts.length - 2] === 'jeux' ? 'jeux/index' : 'index';
    }
    return last.replace('.html', '');
  }

  /* ── Overlay de transition ── */
  let overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    document.body.appendChild(overlay);
  }

  function getPageAccent() {
    const name = getPageName();
    const theme = PAGE_THEMES[name] || PAGE_THEMES['index'];
    return theme.accent;
  }

  /* ── Transition de sortie avant navigation ── */
  function transitionTo(href) {
    if (!overlay) createOverlay();

    const accent = getPageAccent();
    overlay.style.background = `linear-gradient(135deg, ${accent} 0%, ${accent}88 100%)`;

    document.body.classList.add('page-leaving');
    overlay.classList.add('visible');

    setTimeout(() => {
      window.location.href = href;
    }, 280);
  }

  /* ── Intercepter les liens internes ── */
  function isInternalLink(href) {
    if (!href) return false;
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (href.startsWith('#') || href.startsWith('javascript:')) return false;
    return true;
  }

  function setupLinkInterception() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || link.target === '_blank') return;
      const href = link.getAttribute('href');
      if (!isInternalLink(href)) return;

      e.preventDefault();

      /* Fermer le menu mobile si ouvert */
      const mobileMenu = document.getElementById('mobileMenu');
      const menuOverlay = document.getElementById('menuOverlay');
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (menuOverlay) menuOverlay.classList.remove('open');

      transitionTo(href);
    });
  }

  /* ── Animation d'entrée de page ── */
  function pageEnterAnimation() {
    document.body.classList.add('page-entering');
    setTimeout(() => document.body.classList.remove('page-entering'), 500);
  }

  /* ── Scroll reveal avec IntersectionObserver ── */
  function setupScrollReveal() {
    const targets = document.querySelectorAll(
      '.card, .resume-card, .coll-card, .scan-card, .chest, .stat, ' +
      '.vlog-strip, .me-strip, .vedette, .block, .shelf, .sb-card, .char'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }

  /* ── Effet ripple sur les boutons ── */
  function setupRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn || btn.disabled || btn.classList.contains('is-locked')) return;

      const rect = btn.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      const size = Math.max(rect.width, rect.height);
      wave.style.width = wave.style.height = size + 'px';
      wave.style.left = (e.clientX - rect.left - size / 2) + 'px';
      wave.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.classList.add('btn-ripple');
      btn.appendChild(wave);

      setTimeout(() => wave.remove(), 600);
    });
  }

  /* ── Compteur animé pour les statistiques ── */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach((el) => {
      const final = el.textContent;
      if (!final || isNaN(parseInt(final, 10))) return;
      const target = parseInt(final, 10);
      if (target === 0) return;

      let current = 0;
      const steps = 24;
      const inc = target / steps;
      el.textContent = '0';

      const interval = setInterval(() => {
        current += inc;
        if (current >= target) {
          el.textContent = final;
          clearInterval(interval);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
    });
  }

  /* ── Initialisation ── */
  function init() {
    createOverlay();
    setupLinkInterception();
    pageEnterAnimation();

    /* Attendre que le DOM soit stable pour les animations */
    requestAnimationFrame(() => {
      setupScrollReveal();
      setupRipple();
      setTimeout(animateCounters, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
