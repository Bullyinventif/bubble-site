// Configuration Firebase
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA...",
  authDomain: "bubble-site-fa894.firebaseapp.com",
  projectId: "bubble-site-fa894",
  storageBucket: "bubble-site-fa894.appspot.com",
  messagingSenderId: "60256418096",
  appId: "1:60256418096:web:dbdc555819793d8c20f0"
};
const BUBBLE_SITE = "https://bullyinventif.github.io/bubble-site";
const SUB_LEVELS = { basic: 0, plus: 1, x: 2, max: 3, admin: 4 };
const IS_DEV = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.firestore();
async function loginWithEmail(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.uid).set({
        email: user.email, pseudo: user.email.split('@')[0], sub: 'basic', xp: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(), loginDays: 1
      });
    } else {
      const userData = userDoc.data();
      const lastLogin = userData.lastLogin?.toDate();
      const today = new Date(); today.setHours(0, 0, 0, 0);
      let loginDays = userData.loginDays || 1;
      if (lastLogin) {
        const lastLoginDate = new Date(lastLogin); lastLoginDate.setHours(0, 0, 0, 0);
        if (lastLoginDate.getTime() < today.getTime() - 86400000) {
          if (lastLoginDate.getTime() < today.getTime()) loginDays = (userData.loginDays || 1) + 1;
        }
      }
      await db.collection('users').doc(user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(), loginDays: loginDays
      });
    }
    return user;
  } catch (e) { console.error('Erreur connexion:', e); throw e; }
}
async function signupWithEmail(email, password, pseudo) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await db.collection('users').doc(user.uid).set({
      email: user.email, pseudo: pseudo || user.email.split('@')[0], sub: 'basic', xp: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(), loginDays: 1
    });
    return user;
  } catch (e) { console.error('Erreur inscription:', e); throw e; }
}
async function logout() {
  try { await auth.signOut(); window.location.href = 'login.html'; } catch (e) { console.error('Erreur:', e); throw e; }
}
async function resetPassword(email) {
  try { await auth.sendPasswordResetEmail(email); return true; } catch (e) { console.error('Erreur:', e); throw e; }
}
function canAccessGame(game) {
  const userSub = window.__userSub || 'basic';
  const requiredSub = game.requiredSubscription || 'basic';
  return SUB_LEVELS[userSub] >= SUB_LEVELS[requiredSub];
}
function canAccessPage(page) {
  const userSub = window.__userSub || 'basic';
  const pageRequirements = { 'scans': 'max', 'scans.html': 'max', 'bubble_site_scans.html': 'max', 'reader': 'max', 'gacha': 'basic', 'vlog': 'basic' };
  const requiredSub = pageRequirements[page] || 'basic';
  return SUB_LEVELS[userSub] >= SUB_LEVELS[requiredSub];
}
function requireAccess(page) {
  const user = firebase.auth().currentUser;
  if (!user) { window.location.href = 'login.html'; return false; }
  db.collection('users').doc(user.uid).get().then(userDoc => {
    const userData = userDoc.exists ? userDoc.data() : {};
    window.__userSub = userData.sub || 'basic';
    window.__user = { uid: user.uid, email: user.email, pseudo: userData.pseudo || user.email.split('@')[0], sub: window.__userSub };
    if (!canAccessPage(page)) window.location.href = 'bubble_site_abonnements.html';
  }).catch(e => { console.error('Erreur:', e); window.location.href = 'login.html'; });
}
function requireGameAccess(game) {
  const user = firebase.auth().currentUser;
  if (!user) { window.location.href = 'login.html'; return false; }
  db.collection('users').doc(user.uid).get().then(userDoc => {
    const userData = userDoc.exists ? userDoc.data() : {};
    window.__userSub = userData.sub || 'basic';
    if (!canAccessGame(game)) window.location.href = 'bubble_site_abonnements.html';
  }).catch(e => { console.error('Erreur:', e); window.location.href = 'login.html'; });
}
function updateNav() {
  const user = window.__user; const navName = document.getElementById('navName'); const navSub = document.getElementById('navSub'); const navAvatar = document.getElementById('navAvatar');
  if (!navName || !navSub) return;
  if (user) { navName.textContent = user.pseudo || user.email || 'Utilisateur'; navSub.textContent = user.sub.toUpperCase(); if (navAvatar) fillAvatar('navAvatar', user.avatar); }
  else { navName.textContent = 'Invité'; navSub.textContent = 'BASIC'; if (navAvatar) navAvatar.innerHTML = '🫧'; }
}
function fillAvatar(elementId, avatarId) {
  const el = document.getElementById(elementId); if (!el) return;
  if (avatarId) el.innerHTML = '<img src="' + avatarId + '" alt="avatar" onerror="this.style.display='none';this.parentElement.innerHTML='🫧'">';
  else el.innerHTML = '🫧';
}
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    window.__user = { uid: user.uid, email: user.email || userData.email || '', pseudo: userData.pseudo || user.displayName || user.email || 'Utilisateur', avatar: userData.avatar || user.photoURL || null, sub: userData.sub || 'basic', xp: userData.xp || 0 };
    window.__userSub = window.__user.sub; updateNav();
  } else { window.__user = null; window.__userSub = 'basic'; }
});
window.FIREBASE_CONFIG = FIREBASE_CONFIG; window.BUBBLE_SITE = BUBBLE_SITE; window.SUB_LEVELS = SUB_LEVELS; window.IS_DEV = IS_DEV;