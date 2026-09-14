const SUB_LEVELS = { basic: 0, plus: 1, x: 2, max: 3, admin: 4 };
const SUB_CONFIG = { basic: { icon: '🫧', name: 'BASIC' }, plus: { icon: '✨', name: 'PLUS' }, x: { icon: '💎', name: 'X' }, max: { icon: '👑', name: 'MAX' } };
function canAccessGame(game) { const userSub = window.__userSub || 'basic'; const requiredSub = game.requiredSubscription || 'basic'; return SUB_LEVELS[userSub] >= SUB_LEVELS[requiredSub]; }
function canAccessPage(page) { const userSub = window.__userSub || 'basic'; const req = { scans: 'max', gacha: 'basic', vlog: 'basic' }; return SUB_LEVELS[userSub] >= SUB_LEVELS[req[page] || 'basic']; }
function updateNav() { const user = window.__user; if (!user) return; const n = document.getElementById('navName'); const s = document.getElementById('navSub'); if (n) n.textContent = user.pseudo || user.email || 'Utilisateur'; if (s) s.textContent = user.sub.toUpperCase(); }
window.SUB_LEVELS = SUB_LEVELS; window.SUB_CONFIG = SUB_CONFIG; window.canAccessGame = canAccessGame; window.canAccessPage = canAccessPage; window.updateNav = updateNav;
if (typeof firebase !== 'undefined') {
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const db = firebase.firestore(); const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};
      window.__user = { uid: user.uid, email: user.email || '', pseudo: userData.pseudo || user.email || 'Utilisateur', sub: userData.sub || 'basic', xp: userData.xp || 0 };
      window.__userSub = window.__user.sub; updateNav();
    } else { window.__user = null; window.__userSub = 'basic'; }
  });
}