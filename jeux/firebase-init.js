// ============================================================
// FIREBASE - config + controle d'acces mutualises
// Script classique (version "compat" de Firebase) : fonctionne
// en double-clic (file://) comme sur GitHub Pages.
// Charge AVANT ce fichier les scripts firebase-*-compat.js.
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAbtOtU3EZd3yccR8gPCef_wME-5qoNk3Y",
  authDomain: "bubble-game-fa894.firebaseapp.com",
  projectId: "bubble-game-fa894",
  storageBucket: "bubble-game-fa894.firebasestorage.app",
  messagingSenderId: "60256418096",
  appId: "1:60256418096:web:dbdc555819793d8c20f0f5"
};

// Les avatars vivent UNIQUEMENT sur le Bubble Site. On charge les images
// directement depuis la-bas plutôt que d'en garder une copie ici : dès
// que Bully ajoute une nouvelle icône sur bubble-site, elle apparaît sur
// Bubble Game sans rien uploader ici. (Les <img> cross-origin n'ont pas
// besoin de CORS, contrairement à fetch/XHR — ça marche sans réglage.)
const BUBBLE_SITE = "../";
function avatarUrl(avatarId) { return BUBBLE_SITE + (avatarId || 'bully_1') + '.png'; }

const SUB_ORDER = { free: 0, basic: 1, plus: 2, x: 3, max: 4, admin: 5 };
const SUB_LABELS = { free: "GRATUIT", basic: "BASIC", plus: "BUBBLE+", x: "BUBBLE X", max: "BUBBLE MAX", admin: "ADMIN" };

// Abonnement de l'utilisateur actuel (accessible globalement)
var USER_SUBSCRIPTION = 'basic';

// En local (double-clic depuis les fichiers = hostname '', ou localhost)
// on saute la connexion pour pouvoir prévisualiser sans se logguer.
// En prod (github.io) le contrôle d'accès s'applique normalement.
const IS_DEV = ['localhost', '127.0.0.1', ''].includes(location.hostname);

function reveal() { document.body.style.visibility = 'visible'; }

function redirect() {
  document.body.style.visibility = 'visible';
  window.location.href = "./login.html";
}

function fillProfile(pseudo, subscription, avatarId) {
  const nameEl = document.getElementById('navProfileName');
  const subEl = document.getElementById('navProfileSub');
  const avEl = document.getElementById('navAvatarBubble');
  if (nameEl) nameEl.textContent = pseudo;
  if (subEl) subEl.textContent = SUB_LABELS[subscription] || 'BASIC';
  if (avEl && avatarId) avEl.innerHTML = `<img src="${avatarUrl(avatarId)}" alt="avatar" onerror="this.style.display='none'">`;
}

// Protège la page + remplit le widget profil de la nav.
// À appeler une fois au chargement de chaque page protégée.
function requireAccess() {
  if (IS_DEV) {
    fillProfile('DEV', 'max', null);
    reveal();
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Filet de sécurité : si l'auth ne répond jamais, on affiche après 5s
  const fallback = setTimeout(reveal, 5000);

  auth.onAuthStateChanged(async user => {
    clearTimeout(fallback);
    if (!user) return redirect();
    try {
      const snap = await db.collection('users').doc(user.uid).get();
      const data = snap.exists ? snap.data() : {};
      const sub = data.subscription || 'basic';
      USER_SUBSCRIPTION = sub;
      
      // Si le document n'existe pas ou n'a pas de subscription, on le crée
      if (!snap.exists || !data.subscription) {
        await db.collection('users').doc(user.uid).set({
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
      
      fillProfile(
        user.displayName || user.email.split('@')[0],
        sub,
        data.avatarId || 'bully_1'
      );
      reveal();
    } catch (e) {
      redirect();
    }
  });
}
