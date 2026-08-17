/* ══════════════════════════════════════════════════════════════════
   bubble_scores.js — LE TABLEAU DES RECORDS DES JEUX
   À mettre sur une page :

       <div id="scoreboard"></div>
       <script type="module" src="bubble_scores.js"></script>

   (à charger APRÈS bubble_data.js, qui contient window.GAMES)

   Le tableau se remplit tout seul et se met à jour EN DIRECT :
   dès qu'un joueur bat son record, la page bouge sans être rechargée.

   ── OÙ SONT RANGÉS LES RECORDS ──
   Collection Firestore « scores », un document par joueur ET par jeu :

       id du document : box_run__AbCd1234...   (idDuJeu + "__" + uid)
       { game, uid, pseudo, avatarId, sub, value, updated }

   On ne garde QUE le meilleur : si le nouveau score n'est pas meilleur
   que l'ancien, rien n'est écrit.

   ⚠️ Pense à ajouter les règles Firestore de la collection « scores »
      (voir REGLES_FIREBASE_scores.txt).

   ── L'API ──
     BubbleScores.ready                 → promesse, résolue au 1er chargement
     BubbleScores.save(gameId, valeur)  → enregistre un record (si meilleur)
     BubbleScores.top(gameId, n)        → les n meilleurs d'un jeu
     BubbleScores.myBest(gameId)        → { value, rank, total } ou null
     BubbleScores.mount(element)        → dessine le tableau dans un élément
     BubbleScores.openGame(gameId)      → ouvre le classement complet d'un jeu

   ⚠️ Ce fichier ne touche PAS aux missions ni à l'XP : le classement et
      les missions sont deux systèmes complètement séparés.
   ══════════════════════════════════════════════════════════════════ */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot }
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

/* Où sont les images d'avatar.
   Sur le site principal : rien à faire.
   Ailleurs (Bubble Game…) : mets avant ce script
       <script>window.BUBBLE_SITE_BASE='https://bullyinventif.github.io/bubble-site';</script> */
const BASE = String(window.BUBBLE_SITE_BASE || '').replace(/\/+$/, '');
const avatarSrc = id => (BASE ? BASE + '/' : '') + (id || 'bully_1') + '.png';

/* Nombre de joueurs montrés sur une carte (le classement complet en montre 20) */
const PODIUM = 3;
const FULL   = 20;

/* ── État ── */
const state = {
  rows: [],        /* tous les records de tout le monde */
  uid: null,
  me: { pseudo:'Moi', avatarId:'bully_1', sub:'basic' },
  loaded: false,
};

let resolveReady;
const ready = new Promise(r => { resolveReady = r; });
let mountEl = null;

/* ── Petits raccourcis vers bubble_data.js (avec secours si absent) ── */
const games      = () => (window.scoredGames ? window.scoredGames() : (window.GAMES || []).filter(g => g.score));
const gameOf     = id  => (window.findGame ? window.findGame(id) : (window.GAMES || []).find(g => g.id === id)) || null;
const fmt        = (g, v) => window.fmtScore ? window.fmtScore(g, v) : String(v);
const isBetter   = (g, a, b) => window.scoreIsBetter ? window.scoreIsBetter(g, a, b) : (b == null || a > b);
const sortRows   = (g, rows) => window.sortScores ? window.sortScores(g, rows)
                     : rows.slice().sort((a, b) => b.value - a.value);
const badge      = i => window.rankBadge ? window.rankBadge(i) : String(i + 1);
const esc        = t => window.bbEscape ? window.bbEscape(t) : String(t ?? '').replace(/[<>&"]/g, c =>
                     ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));

/* ══════════════════════════════════════
   LECTURE
══════════════════════════════════════ */

/* Les records d'un jeu, du meilleur au moins bon */
function top(gameId, n){
  const g = gameOf(gameId);
  const list = sortRows(g, state.rows.filter(r => r.game === gameId));
  return n ? list.slice(0, n) : list;
}

/* Mon record sur un jeu : la valeur, ma place, et combien de joueurs au total */
function myBest(gameId){
  if (!state.uid) return null;
  const list = top(gameId);
  const i = list.findIndex(r => r.uid === state.uid);
  if (i < 0) return null;
  return { value: list[i].value, rank: i + 1, total: list.length };
}

/* ══════════════════════════════════════
   ÉCRITURE — on ne garde que le meilleur
══════════════════════════════════════ */
async function save(gameId, value){
  await ready;
  if (!state.uid)  return { saved:false, why:'pas connecté' };
  if (!gameId)     return { saved:false, why:'jeu inconnu' };

  const v = Number(value);
  if (!isFinite(v)) return { saved:false, why:'score invalide' };

  const g   = gameOf(gameId);
  const ref = doc(db, 'scores', `${gameId}__${state.uid}`);

  try {
    const snap = await getDoc(ref);
    const old  = snap.exists() ? Number(snap.data().value) : null;
    if (!isBetter(g, v, old)) return { saved:false, why:'pas un record', best: old };

    await setDoc(ref, {
      game:     gameId,
      uid:      state.uid,
      pseudo:   state.me.pseudo,
      avatarId: state.me.avatarId,
      sub:      state.me.sub,
      value:    v,
      updated:  new Date().toISOString().slice(0, 10),
    }, { merge:true });

    return { saved:true, value:v, previous: old };
  } catch(e){
    console.warn('[Records] écriture impossible :', e.message);
    return { saved:false, why:e.message };
  }
}

/* ══════════════════════════════════════
   AFFICHAGE
══════════════════════════════════════ */

/* Une ligne du classement */
function lineHTML(g, row, i){
  const mine = row.uid === state.uid;
  return `
    <li class="sb-line${mine ? ' me' : ''}">
      <span class="sb-rank r${i + 1}">${badge(i)}</span>
      <span class="sb-av"><img src="${avatarSrc(row.avatarId)}" alt=""
            onerror="this.replaceWith(document.createTextNode('🫧'))"></span>
      <span class="sb-who">${esc(row.pseudo || 'Joueur')}${mine ? ' <i>(toi)</i>' : ''}</span>
      <b class="sb-val">${fmt(g, row.value)}</b>
    </li>`;
}

/* Une carte de jeu */
function cardHTML(g){
  const list  = top(g.id, PODIUM);
  const total = state.rows.filter(r => r.game === g.id).length;
  const mine  = myBest(g.id);

  const podium = list.length
    ? `<ol class="sb-podium">${list.map((r, i) => lineHTML(g, r, i)).join('')}</ol>`
    : `<div class="sb-empty">Aucun record pour l'instant.<br><b>Sois le premier ! 🚀</b></div>`;

  let footer;
  if (mine && mine.rank <= PODIUM)
    footer = `<div class="sb-mine good">🎉 Tu es ${mine.rank}${mine.rank === 1 ? 'ᵉʳ' : 'ᵉ'} — ${fmt(g, mine.value)}</div>`;
  else if (mine)
    footer = `<div class="sb-mine">Ton record : <b>${fmt(g, mine.value)}</b> · ${mine.rank}<sup>e</sup> sur ${mine.total}</div>`;
  else
    footer = `<div class="sb-mine soft">${state.uid ? "Tu n'as pas encore de record ici" : 'Connecte-toi pour entrer au classement'}</div>`;

  return `
    <article class="sb-card" style="--gc:${g.color || 'var(--blue)'}">
      <header class="sb-head">
        <span class="sb-emoji">${g.emoji || '🎮'}</span>
        <span class="sb-titles">
          <span class="sb-name">${esc(g.name)}</span>
          <span class="sb-metric">${esc((g.score && g.score.label) || 'Record')}</span>
        </span>
        ${total > PODIUM ? `<span class="sb-count">${total}</span>` : ''}
      </header>
      ${podium}
      ${footer}
      <div class="sb-actions">
        <button class="btn btn-ghost btn-sm" data-full="${g.id}">📊 Classement</button>
        ${g.url ? `<a class="btn btn-sm" style="background:var(--gc)" href="${g.url}" target="_blank" rel="noopener">▶ Jouer</a>` : ''}
      </div>
    </article>`;
}

function render(){
  if (!mountEl) return;
  const list = games();
  if (!list.length){
    mountEl.innerHTML = `<div class="sb-empty">Aucun jeu n'a encore de record configuré.</div>`;
    return;
  }
  mountEl.innerHTML = list.map(cardHTML).join('');
  mountEl.querySelectorAll('[data-full]').forEach(b =>
    b.addEventListener('click', () => openGame(b.dataset.full)));
}

/* Le classement complet d'un jeu, en modale */
function openGame(gameId){
  const g = gameOf(gameId);
  if (!g) return;
  const list = top(gameId, FULL);

  let ov = document.getElementById('sb-overlay');
  if (!ov){
    ov = document.createElement('div');
    ov.id = 'sb-overlay';
    ov.className = 'overlay';
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && ov.classList.contains('open')) ov.classList.remove('open');
    });
  }

  ov.innerHTML = `
    <div class="sheet sb-sheet" style="--gc:${g.color || 'var(--blue)'}">
      <div class="sb-sheet-head">
        <span class="sb-emoji big">${g.emoji || '🎮'}</span>
        <span class="sb-titles">
          <span class="sb-name">${esc(g.name)}</span>
          <span class="sb-metric">${esc((g.score && g.score.label) || 'Record')}
            ${g.score && g.score.order === 'asc' ? '· le plus petit gagne' : ''}</span>
        </span>
        <button class="sb-close" aria-label="Fermer">✕</button>
      </div>
      <div class="sb-sheet-body">
        ${list.length
          ? `<ol class="sb-podium big">${list.map((r, i) => lineHTML(g, r, i)).join('')}</ol>`
          : `<div class="sb-empty">Personne n'a encore joué. À toi de jouer ! 🚀</div>`}
      </div>
      ${g.url ? `<div class="sb-sheet-foot">
        <a class="btn btn-lg" style="background:var(--gc)" href="${g.url}" target="_blank" rel="noopener">▶ Jouer à ${esc(g.name)}</a>
      </div>` : ''}
    </div>`;
  ov.classList.add('open');
  ov.querySelector('.sb-close').addEventListener('click', () => ov.classList.remove('open'));
}

/* Dessiner le tableau dans un élément */
function mount(el){
  mountEl = (typeof el === 'string') ? document.querySelector(el) : el;
  if (mountEl) render();
}

/* ══════════════════════════════════════
   DÉMARRAGE
══════════════════════════════════════ */

/* On lit TOUTE la collection et on trie ici : pas d'index Firestore à créer.
   (Quelques dizaines de documents, c'est largement assez rapide.) */
onSnapshot(collection(db, 'scores'),
  snap => {
    state.rows = snap.docs.map(d => {
      const x = d.data();
      return { ...x, value: Number(x.value) || 0 };
    });
    if (!state.loaded){ state.loaded = true; resolveReady(state); }
    render();
  },
  e => {
    console.warn('[Records] lecture impossible :', e.message);
    if (!state.loaded){ state.loaded = true; resolveReady(state); }
    render();
  });

/* Qui est connecté ? (pour surligner sa ligne et signer ses records) */
onAuthStateChanged(auth, async user => {
  if (!user){ state.uid = null; render(); return; }
  state.uid = user.uid;
  state.me.pseudo = user.displayName || user.email.split('@')[0];
  try {
    const s = await getDoc(doc(db, 'users', user.uid));
    if (s.exists()){
      const d = s.data();
      state.me.pseudo   = d.pseudo || state.me.pseudo;
      state.me.avatarId = d.avatarId || 'bully_1';
      state.me.sub      = d.subscription || 'basic';
    }
  } catch(e){ console.warn('[Records] profil illisible :', e.message); }
  render();
});

/* ── Montage automatique sur #scoreboard s'il existe ── */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('scoreboard');
  if (el && !mountEl) mount(el);
});
if (document.readyState !== 'loading'){
  const el = document.getElementById('scoreboard');
  if (el) mount(el);
}

window.BubbleScores = { ready, state, save, top, myBest, mount, openGame, render };
