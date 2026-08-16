/* ══════════════════════════════════════════════════════════════════
   bubble_game_hook.js — LE CROCHET À COLLER DANS CHAQUE JEU
   (fichier à mettre à la racine du site principal, pas dans le jeu)

   ── LA LIGNE À COLLER dans chaque page de jeu, avant </body> ──

   <script type="module" src="https://bullyinventif.github.io/bubble-site/bubble_game_hook.js" data-game="bubblecraft"></script>

   Remplace juste bubblecraft par l'id du jeu : bubblecraft, fishing_time,
   box_run, cygor_attack… (les ids sont dans window.GAMES de bubble_data.js).

   Ce que fait cette ligne, toute seule :
     • repère le joueur connecté (même compte que le site)
     • valide "Jouer à un jeu" (+100 XP, une fois)
     • valide "Première partie sur ce jeu" (+50 XP, une fois par jeu)
     • affiche une petite bulle "+50 XP" en bas à droite

   ── POUR LA MISSION SPÉCIALE DU JEU ──
   Quand le joueur réussit l'objectif (100 de score, 10 blocs posés…),
   appelle simplement, n'importe où dans ton code de jeu :

       BubbleQuest.done();

   Rien ne se passe si le joueur n'est pas connecté, si la mission est
   déjà validée, ou si le site est hors ligne : ça ne peut pas casser ton jeu.
   ══════════════════════════════════════════════════════════════════ */

const SITE = 'https://bullyinventif.github.io/bubble-site';

const CONFIG = {
  apiKey:"AIzaSyAbtOtU3EZd3yccR8gPCef_wME-5qoNk3Y",
  authDomain:"bubble-game-fa894.firebaseapp.com",
  projectId:"bubble-game-fa894",
  storageBucket:"bubble-game-fa894.firebasestorage.app",
  messagingSenderId:"60256418096",
  appId:"1:60256418096:web:dbdc555819793d8c20f0f5"
};

/* Valeurs de secours si le catalogue du site n'est pas joignable */
const FALLBACK = { gameFirstXP:50, firstGameXP:100, missionXP:80 };

/* ── Quel jeu ? ── */
const tag    = document.querySelector('script[data-game]');
const GAME_ID = (tag && tag.dataset.game) || '';
if (!GAME_ID) console.warn('[Bubble] Ajoute data-game="..." sur la balise script.');

/* ── API disponible tout de suite, même avant le chargement ── */
const queue = [];
window.BubbleQuest = {
  done(){ queue.push('mission'); flush(); },
  ready: false,
};

let engine = null;
function flush(){
  if (!engine) return;
  while (queue.length){
    const job = queue.shift();
    if (job === 'mission') engine.mission();
  }
}

/* ── Charge le catalogue du site (facultatif) ── */
function loadCatalogue(){
  return new Promise(resolve => {
    if (window.GAMES) return resolve();
    const s = document.createElement('script');
    s.src = SITE + '/bubble_data.js';
    s.onload = () => resolve();
    s.onerror = () => resolve();          /* pas grave : on prendra les valeurs de secours */
    document.head.appendChild(s);
  });
}

/* ── Petite bulle "+XP" ── */
function xpToast(xp, label){
  let box = document.getElementById('bq-toast');
  if (!box){
    box = document.createElement('div');
    box.id = 'bq-toast';
    box.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;' +
      'flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.style.cssText =
    'display:flex;align-items:center;gap:9px;background:#16283F;color:#fff;' +
    'padding:11px 16px;border-radius:15px;font-family:system-ui,sans-serif;' +
    'font-weight:700;font-size:14px;box-shadow:0 10px 26px rgba(0,0,0,.35);' +
    'opacity:0;transform:translateY(18px);transition:all .35s cubic-bezier(.34,1.56,.64,1)';
  t.innerHTML =
    `<span style="background:#46CE62;padding:2px 9px;border-radius:99px;font-size:13px">+${xp} XP</span>` +
    `<span>${label}</span>`;
  box.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(-10px)'; }, 3200);
  setTimeout(() => t.remove(), 3700);
}

/* ── Démarrage ── */
(async () => {
  await loadCatalogue();

  const [{ initializeApp, getApps, getApp }, { getAuth, onAuthStateChanged },
         { getFirestore, doc, getDoc, setDoc, increment, arrayUnion }] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"),
  ]);

  const app  = getApps().length ? getApp() : initializeApp(CONFIG);
  const auth = getAuth(app);
  const db   = getFirestore(app);

  const game    = (window.GAMES || []).find(g => g.id === GAME_ID);
  const cfg     = window.MISSIONS || {};
  const firstXP = cfg.gameFirstXP ?? FALLBACK.gameFirstXP;
  const genXP   = (cfg.general || []).find(m => m.id === 'first_game')?.xp ?? FALLBACK.firstGameXP;
  const misId   = game?.mission?.id  || (GAME_ID + '_mission');
  const misXP   = game?.mission?.xp  ?? FALLBACK.missionXP;
  const misTxt  = game?.mission?.label || 'Mission accomplie !';

  onAuthStateChanged(auth, async user => {
    if (!user) return;                         /* pas connecté : on ne fait rien */
    const ref = doc(db, 'users', user.uid);

    let data = {};
    try { const s = await getDoc(ref); data = s.exists() ? s.data() : {}; }
    catch(e){ return console.warn('[Bubble] Firestore injoignable :', e.message); }

    const done   = data.missions    || {};
    const played = data.gamesPlayed || [];

    /* 1. Première partie sur ce jeu */
    if (GAME_ID && !played.includes(GAME_ID)){
      try {
        await setDoc(ref, { gamesPlayed: arrayUnion(GAME_ID), xp: increment(firstXP) }, { merge:true });
        xpToast(firstXP, `Première partie : ${game ? game.name : GAME_ID}`);
        played.push(GAME_ID);
      } catch(e){ console.warn('[Bubble]', e.message); }
    }

    /* 2. Mission générale "jouer à un jeu" */
    if (!done.first_game){
      try {
        await setDoc(ref, { missions:{ first_game:true }, xp: increment(genXP) }, { merge:true });
        xpToast(genXP, 'Mission : jouer à un jeu');
        done.first_game = true;
      } catch(e){ console.warn('[Bubble]', e.message); }
    }

    /* 3. La mission spéciale, déclenchée par BubbleQuest.done() */
    engine = {
      async mission(){
        if (done[misId]) return;
        done[misId] = true;
        try {
          await setDoc(ref, { missions:{ [misId]:true }, xp: increment(misXP) }, { merge:true });
          xpToast(misXP, misTxt);
        } catch(e){ console.warn('[Bubble]', e.message); }
      }
    };
    window.BubbleQuest.ready = true;
    flush();
  });
})();
