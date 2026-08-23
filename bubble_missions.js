/* ══════════════════════════════════════════════════════════════════
   bubble_missions.js — LE MOTEUR DES MISSIONS ET DE L'XP
   À mettre sur chaque page :  <script type="module" src="bubble_missions.js"></script>
   (à charger APRÈS bubble_data.js)

   Ce fichier se débrouille tout seul : il se connecte à Firebase,
   attend que l'utilisateur soit identifié, valide la connexion du jour,
   et expose une petite API pour le reste du site.

   ── L'API ──
     BubbleMissions.ready              → promesse résolue quand les données sont chargées
     BubbleMissions.state              → { xp, missions, scansRead, gamesPlayed, lastLogin }
     BubbleMissions.scanRead(scanId)   → à appeler quand un scan est ouvert
     BubbleMissions.gamePlayed(gameId) → à appeler quand un jeu est lancé
     BubbleMissions.complete(id, xp)   → valider une mission précise (missions de jeu)
     BubbleMissions.checkCollection(owned) → vérifie la collection complète
     BubbleMissions.onChange(fn)       → rappelé à chaque gain d'XP
   ══════════════════════════════════════════════════════════════════ */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, increment, arrayUnion }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const CONFIG = {
  apiKey:"AIzaSyAbtOtU3EZd3yccR8gPCef_wME-5qoNk3Y",
  authDomain:"bubble-game-fa894.firebaseapp.com",
  projectId:"bubble-game-fa894",
  storageBucket:"bubble-game-fa894.firebasestorage.app",
  messagingSenderId:"60256418096",
  appId:"1:60256418096:web:dbdc555819793d8c20f0f5"
};

/* On réutilise l'app Firebase de la page si elle existe déjà */
const app  = getApps().length ? getApp() : initializeApp(CONFIG);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ── État local ── */
const state = {
  uid: null, xp: 0, sub: 'basic',
  missions: {}, scansRead: [], gamesPlayed: [], lastLogin: null, loaded: false,
};

/* Combien rapporte une mission pour l'abonnement en cours
   (base ×1 en BASIC, ×2,5 en +, ×4 en X, ×6 en MAX) */
function gain(base){
  return window.xpFor ? window.xpFor(base, state.sub) : (base || 0);
}
const listeners = [];      /* changement d'état  */
const gainers   = [];      /* gain d'XP en direct */
let resolveReady;
const ready = new Promise(r => { resolveReady = r; });

/* Date du jour au format 2026-08-16 (heure locale) */
function today(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function notify(){ listeners.forEach(fn => { try { fn(state); } catch(e){ console.warn(e); } }); }
function emitGain(info){ gainers.forEach(fn => { try { fn(info); } catch(e){ console.warn(e); } }); }

/* Retrouve le libellé d'une mission à partir de son id */
function labelOf(id){
  const M = window.MISSIONS || {};
  const pools = [ ...(M.general || []), ...(M.scanMilestones || []), ...(M.gacha || []) ];
  const hit = pools.find(m => m.id === id);
  if (hit) return hit.label;
  if (id === 'first_game') return 'Jouer à un jeu';
  return 'Mission accomplie !';
}

/* ══ Petite notification "+30 XP" ══ */
function xpToast(xp, label){
  let box = document.getElementById('xp-toast-box');
  if (!box){
    box = document.createElement('div');
    box.id = 'xp-toast-box';
    box.style.cssText =
      'position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;flex-direction:column;gap:10px;align-items:flex-end;pointer-events:none;';
    document.body.appendChild(box);

    const st = document.createElement('style');
    st.textContent = `
      @keyframes xpIn{ 0%{opacity:0;transform:translateY(24px) scale(.85)}
                       60%{opacity:1;transform:translateY(-4px) scale(1.04)}
                       100%{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes xpOut{ to{opacity:0;transform:translateY(-14px)} }
      .xp-toast{
        display:flex;align-items:center;gap:10px;
        background:#16283F;color:#fff;padding:12px 18px;border-radius:16px;
        font-family:'Baloo 2',system-ui,sans-serif;font-weight:800;font-size:.95rem;
        box-shadow:0 12px 30px rgba(22,40,63,.35);
        animation:xpIn .45s cubic-bezier(.34,1.56,.64,1) both;
        max-width:min(320px,80vw);
      }
      .xp-toast .amount{
        background:#46CE62;color:#fff;padding:3px 10px;border-radius:999px;
        font-size:.85rem;white-space:nowrap;
      }`;
    document.head.appendChild(st);
  }

  const icon = window.currencyIcon ? window.currencyIcon(state.sub, 15) : '';
  const t = document.createElement('div');
  t.className = 'xp-toast';
  t.innerHTML = `<span class="amount">+${xp} ${icon}</span><span>${label}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.style.animation = 'xpOut .4s ease forwards'; }, 3200);
  setTimeout(() => t.remove(), 3700);
}

/* ══ Écriture Firestore ══ */
async function push(patch, xpGain, label){
  if (!state.uid) return false;
  try {
    const data = { ...patch };
    if (xpGain) data.xp = increment(xpGain);
    await setDoc(doc(db, 'users', state.uid), data, { merge:true });
    /* On n'annonce rien ici : onSnapshot voit le changement et prévient
       toutes les pages ouvertes, y compris celles des autres onglets. */
    return true;
  } catch(e){ console.error('Missions — écriture impossible :', e); return false; }
}

/* ══ Valider une mission (une seule fois par compte) ══ */
async function complete(id, xp, label){
  if (!state.uid || !id) return false;
  if (state.missions[id]) return false;          /* déjà faite */
  state.missions[id] = true;
  return push({ missions: { [id]: true } }, xp, label);
}

/* ══ Connexion du jour ══ */
async function dailyLogin(){
  const d = today();
  if (state.lastLogin === d) return false;
  state.lastLogin = d;
  const m = (window.MISSIONS?.general || []).find(x => x.id === 'daily_login');
  return push({ lastLogin: d }, gain(m?.xp ?? 20), 'Connexion du jour');
}

/* ══ Un scan a été ouvert ══ */
async function scanRead(scanId){
  await ready;
  if (!state.uid || !scanId) return;

  const first = !state.scansRead.includes(scanId);
  if (first){
    state.scansRead.push(scanId);
    await push({ scansRead: arrayUnion(scanId) }, gain(window.MISSIONS?.scanXP ?? 10), 'Nouveau scan lu');
  }

  /* Mission générale : lire son tout premier scan */
  const g = (window.MISSIONS?.general || []).find(x => x.id === 'first_scan');
  if (g) await complete(g.id, gain(g.xp), g.label);

  /* Paliers : 10, 20, 50 scans lus */
  for (const p of (window.MISSIONS?.scanMilestones || [])){
    if (state.scansRead.length >= p.count) await complete(p.id, gain(p.xp), p.label);
  }
}

/* ══ Un jeu a été lancé ══ */
async function gamePlayed(gameId){
  await ready;
  if (!state.uid || !gameId) return;

  if (!state.gamesPlayed.includes(gameId)){
    state.gamesPlayed.push(gameId);
    const game = (window.GAMES || []).find(g => g.id === gameId);
    await push({ gamesPlayed: arrayUnion(gameId) }, gain(window.MISSIONS?.gameFirstXP ?? 50),
               `Premier essai : ${game ? game.name : gameId}`);
  }

  /* Mission générale : jouer à un jeu pour la première fois */
  const g = (window.MISSIONS?.general || []).find(x => x.id === 'first_game');
  if (g) await complete(g.id, gain(g.xp), g.label);
}

/* ══ Collection complète ══ */
async function checkCollection(owned){
  await ready;
  if (!state.uid || !window.CARD_POOL) return;
  const total = window.CARD_POOL.length;
  if (!total || (owned || []).length < total) return;
  const m = (window.MISSIONS?.gacha || [])[0];
  if (m) await complete(m.id, gain(m.xp), m.label);
}

/* ══ Chargement au démarrage ══ */
let previous = null;   /* photo de l'état précédent, pour repérer les nouveautés */

function absorb(d){
  const before = previous;
  state.xp          = d.xp || 0;
  state.sub         = d.subscription || 'basic';
  state.missions    = d.missions    || {};
  state.scansRead   = d.scansRead   || [];
  state.gamesPlayed = d.gamesPlayed || [];
  state.lastLogin   = d.lastLogin   || null;

  if (before){
    const gained  = state.xp - before.xp;
    const newOnes = Object.keys(state.missions).filter(k => state.missions[k] && !before.missions[k]);
    const newScan = state.scansRead.filter(x => !before.scansRead.includes(x));
    const newGame = state.gamesPlayed.filter(x => !before.gamesPlayed.includes(x));

    if (gained > 0){
      let label;
      if (newOnes.length)      label = labelOf(newOnes[0]);
      else if (newScan.length) label = 'Nouveau scan lu 📜';
      else if (newGame.length) label = 'Première partie 🎮';
      else                     label = 'Connexion du jour 🫧';
      if (!window.BubbleMissions?.silent) xpToast(gained, label);
      emitGain({ xp: gained, missions: newOnes, label });
    }
  }

  previous = {
    xp: state.xp,
    missions: { ...state.missions },
    scansRead: [...state.scansRead],
    gamesPlayed: [...state.gamesPlayed],
  };
  notify();
}

onAuthStateChanged(auth, async user => {
  if (!user){ state.loaded = true; resolveReady(state); return; }
  state.uid = user.uid;
  const ref = doc(db, 'users', user.uid);

  /* Premier chargement */
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) absorb(snap.data());
  } catch(e){ console.error('Missions — chargement impossible :', e); }

  state.loaded = true;
  resolveReady(state);
  notify();

  /* ── SYNCHRO EN DIRECT ──
     Plus besoin de recharger la page : dès qu'une mission est validée
     (ici, dans un autre onglet, ou depuis un jeu), tout se met à jour. */
  onSnapshot(ref, snap => { if (snap.exists()) absorb(snap.data()); },
             e => console.warn('Missions — écoute interrompue :', e.message));

  await dailyLogin();
});

window.BubbleMissions = {
  ready, state, gain,
  complete, scanRead, gamePlayed, checkCollection, dailyLogin,
  onChange(fn){ listeners.push(fn); if (state.loaded) fn(state); },
  /* Prévenu à chaque gain d'XP : { xp, missions:[ids], label } */
  onGain(fn){ gainers.push(fn); },
  /* Mettre à true pour que la page gère elle-même l'annonce (page Profil) */
  silent: false,
};
