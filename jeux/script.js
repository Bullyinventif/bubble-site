// ============================================
// IMPORTS FIREBASE (doivent etre en haut)
// ============================================

// ============================================
// ATTEND QUE LE DOM SOIT PRET
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // BULLES CYBER
  const bubbleBg = document.getElementById('bubbleBg');
  for (let i = 0; i < 20; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 15 + Math.random() * 80;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 8 + Math.random() * 12;
    const colors = ['#00FFFF', '#FF00FF', '#00FF88', '#FFFF00', '#FF44AA'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15), ${color}30, transparent);
      border: 1px solid ${color}60;
      box-shadow: 0 0 ${size/2}px ${color}40;
      filter: blur(0.5px);
    `;
    if (bubbleBg) bubbleBg.appendChild(bubble);
  }

  // ============================================
  // PARTICULES
  const particlesContainer = document.getElementById('particles');
  const particleColors = ['#00FFFF', '#FF00FF', '#00FF88', '#FFFF00'];
  document.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.background = color;
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      particle.style.boxShadow = `0 0 8px ${color}`;
      if (particlesContainer) particlesContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  });

  // ============================================
  // MENU MOBILE
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (menuToggle) menuToggle.style.transform = 'scale(1.15) rotate(20deg)';
  }
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuToggle) menuToggle.style.transform = '';
  }
  if (menuToggle) menuToggle.addEventListener('click', () => mobileMenu && mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  window.addEventListener('resize', () => { if (window.innerWidth > 540) closeMenu(); });

  // ============================================
  // ANNEE DYNAMIQUE
  const yearSpan = document.querySelector('footer span:last-child');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ============================================
  // FIREBASE
  const BUBBLE_SITE = "https://bullyinventif.github.io/bubble-site/";
  const SUB_ORDER = { free: 0, basic: 1, plus: 2, x: 3, max: 4, admin: 5 };
  const SUB_LABELS = { free: "GRATUIT", basic: "BASIC", plus: "BUBBLE+", x: "BUBBLE X", max: "BUBBLE MAX", admin: "ADMIN" };
  
  // Abonnement de l'utilisateur actuel (accessible globalement)
  var USER_SUBSCRIPTION = 'basic';

  const app = initializeApp({
    apiKey: "AIzaSyAbtOtU3EZd3yccR8gPCef_wME-5qoNk3Y",
    authDomain: "bubble-game-fa894.firebaseapp.com",
    projectId: "bubble-game-fa894",
    storageBucket: "bubble-game-fa894.firebasestorage.app",
    messagingSenderId: "60256418096",
    appId: "1:60256418096:web:dbdc555819793d8c20f0f5"
  });
  const auth = getAuth(app);
  const db = getFirestore(app);

  onAuthStateChanged(auth, async user => {
    if (!user) {
      document.body.style.visibility = 'visible';
      return;
    }
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      const d = snap.exists() ? snap.data() : {};
      USER_SUBSCRIPTION = d.subscription || 'basic';
      
      // Si le document n'existe pas ou n'a pas de subscription, on le cree avec les champs complets
      if (!snap.exists || !d.subscription) {
        await setDoc(doc(db, 'users', user.uid), {
          pseudo: user.displayName || user.email.split('@')[0],
          subscription: 'basic',
          avatarId: 'bully_1',
          xp: 0,
          activeEffect: null,
          gachaCollection: [],
          gachaHistory: [],
          gachaEffects: [],
          framesUnlocked: [],
          iconsUnlocked: [],
          gamesPlayed: [],
          scansRead: [],
          missions: {},
          lastLogin: null,
          loginDays: 0
        }, { merge: true });
      }
      
      document.body.style.visibility = 'visible';
      window.location.href = "./index.html";
    } catch (e) {
      document.body.style.visibility = 'visible';
    }
  });
});
