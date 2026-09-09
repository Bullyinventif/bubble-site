/**
 * BUBBLE SITE - Gestion des transitions de pages et animations
 * Ce script gère les transitions fluides entre les pages et les animations dynamiques
 */

// ===================================================================
// CONFIGURATION DES COULEURS PAR PAGE
// ===================================================================

const PAGE_THEMES = {
  'accueil': {
    gradient: 'linear-gradient(135deg, #2BB7F2 0%, #A855F7 100%)',
    bgColor: '#EFF4FA',
    accentColor: '#2BB7F2',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#16283F'
  },
  'bubble_site_scans': {
    gradient: 'linear-gradient(135deg, #46CE62 0%, #2FA648 100%)',
    bgColor: '#E8F5E8',
    accentColor: '#46CE62',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#2FA648'
  },
  'jeux': {
    gradient: 'linear-gradient(135deg, #FFC93C 0%, #FF5C8A 50%, #5B8DEF 100%)',
    bgColor: '#F4EEE2',
    accentColor: '#FFC93C',
    navColor: '#fff',
    textColor: '#16130E'
  },
  'jeux/index': {
    gradient: 'linear-gradient(135deg, #FFC93C 0%, #FF5C8A 50%, #5B8DEF 100%)',
    bgColor: '#F4EEE2',
    accentColor: '#FFC93C',
    navColor: '#fff',
    textColor: '#16130E'
  },
  'jeux/jeux': {
    gradient: 'linear-gradient(135deg, #FFC93C 0%, #FF5C8A 50%, #5B8DEF 100%)',
    bgColor: '#F4EEE2',
    accentColor: '#FFC93C',
    navColor: '#fff',
    textColor: '#16130E'
  },
  'jeux/classement': {
    gradient: 'linear-gradient(135deg, #FFC93C 0%, #FF5C8A 50%, #5B8DEF 100%)',
    bgColor: '#F4EEE2',
    accentColor: '#FFC93C',
    navColor: '#fff',
    textColor: '#16130E'
  },
  'bubble_site_gacha': {
    gradient: 'linear-gradient(135deg, #A855F7 0%, #FF5FA2 100%)',
    bgColor: '#FDF2FF',
    accentColor: '#A855F7',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#8236D6'
  },
  'bubble_site_vlog': {
    gradient: 'linear-gradient(135deg, #FF5FA2 0%, #A855F7 100%)',
    bgColor: '#FFE8F5',
    accentColor: '#FF5FA2',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#DB3A7E'
  },
  'bubble_site_abonnements': {
    gradient: 'linear-gradient(135deg, #FFC53D 0%, #DFA111 100%)',
    bgColor: '#FFF9E8',
    accentColor: '#FFC53D',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#DFA111'
  },
  'bubble_site_profil': {
    gradient: 'linear-gradient(135deg, #2BB7F2 0%, #1690C6 100%)',
    bgColor: '#E0F4FF',
    accentColor: '#2BB7F2',
    navColor: 'rgba(255, 255, 255, 0.88)',
    textColor: '#1690C6'
  }
};

// ===================================================================
// GESTION DES TRANSITIONS DE PAGE
// ===================================================================

class PageTransitionManager {
  constructor() {
    this.currentPage = '';
    this.nextPage = '';
    this.isTransitioning = false;
    this.transitionOverlay = null;
    this.init();
  }

  init() {
    // Créer l'overlay de transition
    this.createOverlay();
    
    // Intercepter les clics sur les liens internes
    this.setupLinkInterception();
    
    // Appliquer le thème de la page actuelle
    this.applyCurrentPageTheme();
    
    // Ajouter les animations au chargement
    this.addLoadAnimations();
  }

  createOverlay() {
    this.transitionOverlay = document.createElement('div');
    this.transitionOverlay.id = 'page-transition-overlay';
    this.transitionOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #2BB7F2 0%, #A855F7 100%);
      z-index: 99999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(this.transitionOverlay);
  }

  setupLinkInterception() {
    // Gérer les clics sur les liens internes
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || link.target || link.href.includes('http') || link.href.includes('mailto:')) {
        return;
      }
      
      const href = link.getAttribute('href');
      if (href && href.startsWith('./') && !href.includes('#')) {
        e.preventDefault();
        this.startTransition(href);
      }
    });
    
    // Gérer la navigation via le menu mobile
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('./') && !href.includes('#')) {
          // Fermer le menu avant la transition
          const mobileMenu = document.getElementById('mobileMenu');
          const overlay = document.getElementById('menuOverlay');
          if (mobileMenu) mobileMenu.classList.remove('open');
          if (overlay) overlay.classList.remove('open');
          
          e.preventDefault();
          setTimeout(() => this.startTransition(href), 300);
        }
      });
    });
  }

  startTransition(href) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.nextPage = href;
    
    // Animation de sortie
    this.animateOut(() => {
      // Changer de page
      window.location.href = href;
    });
  }

  animateOut(callback) {
    // Appliquer l'animation de transition
    this.transitionOverlay.style.opacity = '1';
    
    // Animation de fondu
    gsap ? gsap.to(document.body, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.transitionOverlay.style.opacity = '0';
        this.isTransitioning = false;
        if (callback) callback();
      }
    }) : setTimeout(() => {
      this.transitionOverlay.style.opacity = '0';
      this.isTransitioning = false;
      if (callback) callback();
    }, 300);
  }

  applyCurrentPageTheme() {
    const path = window.location.pathname;
    const pageName = this.getPageNameFromPath(path);
    this.currentPage = pageName;
    
    const theme = PAGE_THEMES[pageName] || PAGE_THEMES['accueil'];
    
    // Appliquer le thème
    this.applyTheme(theme, pageName);
  }

  getPageNameFromPath(path) {
    // Extraire le nom de la page du chemin
    const parts = path.split('/').filter(p => p);
    const lastPart = parts[parts.length - 1];
    
    // Gérer les cas spéciaux
    if (lastPart === 'index.html' || lastPart === '') {
      return 'accueil';
    }
    
    if (lastPart === 'jeux.html' || lastPart === 'jeux') {
      return 'jeux';
    }
    
    // Vérifier si c'est dans le dossier jeux
    if (parts.length >= 2 && parts[parts.length - 2] === 'jeux') {
      const jeuPage = parts[parts.length - 1].replace('.html', '');
      return `jeux/${jeuPage}`;
    }
    
    return lastPart.replace('.html', '');
  }

  applyTheme(theme, pageName) {
    // Appliquer le fond
    if (document.body) {
      document.body.style.background = theme.bgColor;
      document.body.style.transition = 'background 0.8s ease';
    }
    
    // Appliquer le dégradé au body si c'est une page de jeu
    if (pageName.includes('jeux')) {
      document.body.style.background = theme.gradient;
      document.body.style.minHeight = '100vh';
    }
    
    // Appliquer les couleurs d'accentuation
    const root = document.documentElement;
    if (root) {
      root.style.setProperty('--accent', theme.accentColor);
      root.style.setProperty('--bg', theme.bgColor);
      
      // Ajuster la couleur du texte en fonction du thème
      if (pageName.includes('jeux')) {
        root.style.setProperty('--ink', theme.textColor);
        root.style.setProperty('--ink-soft', this.adjustOpacity(theme.textColor, 0.6));
      }
    }
    
    // Appliquer le thème à la navigation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.background = theme.navColor;
      nav.style.transition = 'background 0.8s ease';
    }
    
    // Ajouter une classe spécifique à la page
    document.body.classList.remove('page-accueil', 'page-scans', 'page-jeux', 'page-gacha', 'page-vlog');
    if (pageName.includes('scans')) {
      document.body.classList.add('page-scans');
    } else if (pageName.includes('jeux')) {
      document.body.classList.add('page-jeux');
    } else if (pageName.includes('gacha')) {
      document.body.classList.add('page-gacha');
    } else if (pageName.includes('vlog')) {
      document.body.classList.add('page-vlog');
    } else {
      document.body.classList.add('page-accueil');
    }
  }

  adjustOpacity(hex, opacity) {
    // Convertir hex en rgba avec opacité
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  addLoadAnimations() {
    // Ajouter des animations au chargement de la page
    const elements = document.querySelectorAll('.fade-up, .hero, .card, .nav-btn, .btn');
    
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.05}s`;
      el.classList.add('animate-fade-in-up');
    });
    
    // Animation spéciale pour le héros
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.animation = 'fadeInUp 0.8s ease-out';
    }
  }

  // Animation pour les boutons au survol
  setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn, .nav-btn');
    
    buttons.forEach(btn => {
      // Animation de transformation pour les boutons Game
      if (btn.classList.contains('game-btn') || btn.href?.includes('jeux')) {
        btn.addEventListener('mouseenter', () => {
          btn.style.animation = 'buttonTransform 0.5s ease-out';
        });
        
        btn.addEventListener('animationend', () => {
          btn.style.animation = '';
        });
      }
      
      // Effet de glow pour les boutons importants
      if (btn.classList.contains('btn-green') || btn.classList.contains('btn-blue')) {
        btn.addEventListener('mouseenter', () => {
          btn.style.setProperty('--btn-glow-color', this.getComputedColor(btn, 'background-color'));
          btn.classList.add('animate-button-glow');
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.classList.remove('animate-button-glow');
        });
      }
    });
  }

  getComputedColor(element, property) {
    const color = window.getComputedStyle(element).getPropertyValue(property);
    // Convertir rgb(r, g, b) en r,g,b
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      return `${match[0]},${match[1]},${match[2]}`;
    }
    return '43,183,242';
  }
}

// ===================================================================
// ANIMATIONS SUPPLÉMENTAIRES
// ===================================================================

// Animation de fond dynamique
function initBackgroundAnimations() {
  const body = document.body;
  const pageName = new PageTransitionManager().getPageNameFromPath(window.location.pathname);
  
  if (pageName.includes('jeux')) {
    // Animation de dégradé pour les pages jeux
    body.style.backgroundSize = '200% 200%';
    body.style.animation = 'gradientGame 12s ease-in-out infinite';
  } else if (pageName.includes('scans')) {
    body.style.backgroundSize = '200% 200%';
    body.style.animation = 'gradientScan 8s ease-in-out infinite';
  }
}

// Animation des cartes au scroll
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card, .resume-card, .coll-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    margin: '50px'
  });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Animation des statistiques
function initStatsAnimations() {
  const stats = document.querySelectorAll('.stat-num');
  
  stats.forEach(stat => {
    const finalValue = stat.textContent;
    if (finalValue && !isNaN(finalValue)) {
      stat.textContent = '0';
      stat.style.transition = 'all 1s ease-out';
      
      setTimeout(() => {
        stat.textContent = finalValue;
      }, 100);
    }
  });
}

// ===================================================================
// INITIALISATION
// ===================================================================

let pageTransitionManager;

document.addEventListener('DOMContentLoaded', () => {
  // Initialiser le gestionnaire de transitions
  pageTransitionManager = new PageTransitionManager();
  
  // Initialiser les animations
  initScrollAnimations();
  initStatsAnimations();
  
  // Appliquer les animations de fond
  setTimeout(initBackgroundAnimations, 500);
  
  // Animation spéciale pour le logo
  const logo = document.querySelector('.nav-logo, .hero-logo');
  if (logo) {
    logo.style.animation = 'scaleIn 0.6s ease-out';
  }
});

// Exporter pour usage dans d'autres scripts
window.PageTransitionManager = PageTransitionManager;
window.pageTransitionManager = pageTransitionManager;
