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

   ══════════════════════════════════════════════════════════════════
   ⭐ LES DEUX LIGNES À CONNAÎTRE ⭐
   (deux systèmes séparés, tu peux n'en utiliser qu'un)

   🎯 1. LES MISSIONS — compter une action précise
   ─────────────────────────────────────────────
   Au moment EXACT où l'action arrive dans ton jeu :

       BubbleQuest.count('terre');        // +1 bloc de terre
       BubbleQuest.count('poisson', 3);   // +3 d'un coup

   Le mot ('terre') doit être le même que le champ "track" de la
   mission, dans bubble_data.js. Le compteur s'additionne de partie
   en partie et reste enregistré. Dès qu'il atteint le "need",
   la mission se valide toute seule : XP + bulle.

   Tu peux appeler count() des centaines de fois par seconde sans
   ralentir ton jeu : les écritures sont regroupées automatiquement.

   🏆 2. LE CLASSEMENT — le record affiché sur l'accueil
   ─────────────────────────────────────────────
   À la FIN d'une partie (game over, retour menu) :

       BubbleQuest.score(monScore);

   Seul le MEILLEUR est gardé. Ça n'a AUCUN lien avec les missions.

   ══════════════════════════════════════════════════════════════════

   ── FACULTATIF : valider une mission à la main ──
   Pour une mission sans compteur, donne son id :

       BubbleQuest.done('bc_terre_1');

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
  /* 🎯 Une action vient d'arriver dans le jeu */
  count(what, n){ queue.push({ type:'count', what:String(what||''), n: Number(n) || 1 }); flush(); },
  /* 🏆 Fin de partie : le record pour le classement */
  score(value){ queue.push({ type:'score', value: Number(value) }); flush(); },
  /* Facultatif : valider une mission à la main (donne son id) */
  done(id){ queue.push({ type:'mission', id }); flush(); },
  ready: false,
  best: null,      /* ton record actuel sur ce jeu */
  totals: {},      /* tes compteurs actuels : { terre:12, pierre:3 } */
};

let engine = null;
function flush(){
  if (!engine) return;
  while (queue.length){
    const job = queue.shift();
    if (job.type === 'count')   engine.count(job.what, job.n);
    if (job.type === 'mission') engine.mission(job.id);
    if (job.type === 'score')   engine.score(job.value);
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
function xpToast(xp, label, ico, color){
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
    `<span style="background:${color || '#46CE62'};padding:2px 9px;border-radius:99px;font-size:13px">${xp} ${ico || ''}</span>` +
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
  const baseFirst = cfg.gameFirstXP ?? FALLBACK.gameFirstXP;
  const baseGen   = (cfg.general || []).find(m => m.id === 'first_game')?.xp ?? FALLBACK.firstGameXP;

  /* Les missions de ce jeu (nouveau format missions:[…], ancien mission:{…}) */
  const misList = window.gameMissions ? window.gameMissions(game)
                : (game?.missions || (game?.mission ? [game.mission] : []));

  /* Les gains dépendent de l'abonnement du joueur */
  const forSub = (base, sub) => window.xpFor ? window.xpFor(base, sub) : base;
  const iconOf = sub => (window.currencyIcon ? window.currencyIcon(sub, 14) : '');

  onAuthStateChanged(auth, async user => {
    if (!user) return;                         /* pas connecté : on ne fait rien */
    const ref = doc(db, 'users', user.uid);

    let data = {};
    try { const s = await getDoc(ref); data = s.exists() ? s.data() : {}; }
    catch(e){ return console.warn('[Bubble] Firestore injoignable :', e.message); }

    const done   = data.missions    || {};
    const played = data.gamesPlayed || [];
    const sub    = data.subscription || 'basic';
    const firstXP = forSub(baseFirst, sub);
    const genXP   = forSub(baseGen,   sub);
    const ico     = iconOf(sub);

    /* 1. Première partie sur ce jeu */
    if (GAME_ID && !played.includes(GAME_ID)){
      try {
        await setDoc(ref, { gamesPlayed: arrayUnion(GAME_ID), xp: increment(firstXP) }, { merge:true });
        xpToast('+' + firstXP, `Première partie : ${game ? game.name : GAME_ID}`, ico);
        played.push(GAME_ID);
      } catch(e){ console.warn('[Bubble]', e.message); }
    }

    /* 2. Mission générale "jouer à un jeu" */
    if (!done.first_game){
      try {
        await setDoc(ref, { missions:{ first_game:true }, xp: increment(genXP) }, { merge:true });
        xpToast('+' + genXP, 'Mission : jouer à un jeu', ico);
        done.first_game = true;
      } catch(e){ console.warn('[Bubble]', e.message); }
    }

    /* 3. La mission spéciale, déclenchée par BubbleQuest.done() */
    /* ══ 4. LES MISSIONS — les compteurs d'actions ══ */

    /* Les compteurs déjà enregistrés pour ce jeu : { terre:12, pierre:3 } */
    const totals = { ...((data.counters || {})[GAME_ID] || {}) };
    window.BubbleQuest.totals = totals;

    /* Ce qui n'est pas encore écrit en base (on regroupe les écritures) */
    let attente = {};
    let minuteur = null;

    /* Valider une mission : XP + bulle, une seule fois par compte */
    async function grant(m){
      if (!m || !m.id || done[m.id]) return false;
      done[m.id] = true;                       /* tout de suite, pour ne pas doubler */
      const xp = forSub(m.xp ?? FALLBACK.missionXP, sub);
      try {
        await setDoc(ref, { missions:{ [m.id]:true }, xp: increment(xp) }, { merge:true });
      } catch(e){
        done[m.id] = false;
        console.warn('[Bubble] mission non enregistrée :', e.message);
        return false;
      }
      try { xpToast('+' + xp, m.label || 'Mission accomplie !', ico); } catch(e){}
      return true;
    }

    /* Écrire les compteurs en attente. On n'écrit pas à chaque bloc posé :
       ça ferait des centaines d'écritures. On regroupe toutes les 2 secondes. */
    async function ecrire(){
      minuteur = null;
      const paquet = attente; attente = {};
      const keys = Object.keys(paquet);
      if (!keys.length) return;
      const patch = {};
      keys.forEach(k => { patch[k] = increment(paquet[k]); });
      try {
        await setDoc(ref, { counters: { [GAME_ID]: patch } }, { merge:true });
      } catch(e){
        /* raté : on remet dans la file pour réessayer plus tard */
        keys.forEach(k => { attente[k] = (attente[k] || 0) + paquet[k]; });
        console.warn('[Bubble] compteurs non enregistrés :', e.message);
      }
    }
    function planifier(){
      if (minuteur) return;
      minuteur = setTimeout(ecrire, 2000);
    }
    /* Si le joueur ferme l'onglet, on écrit ce qui reste tout de suite */
    const vider = () => { if (minuteur){ clearTimeout(minuteur); minuteur = null; } ecrire(); };
    window.addEventListener('pagehide', vider);
    document.addEventListener('visibilitychange', () => { if (document.hidden) vider(); });

    /* ══ 5. LE CLASSEMENT — le record (aucun lien avec les missions) ══ */
    const scoreRef = doc(db, 'scores', `${GAME_ID}__${user.uid}`);
    const unit     = game?.score?.unit || '';
    const showVal  = v => unit === 'time'
      ? `${Math.floor(v/60)}:${String(Math.round(v)%60).padStart(2,'0')}`
      : `${v}${unit ? ' ' + unit : ''}`;

    let best = null;
    try {
      const s = await getDoc(scoreRef);
      if (s.exists()) best = Number(s.data().value);
    } catch(e){ /* pas grave */ }
    window.BubbleQuest.best = best;

    engine = {
      /* 🎯 Une action vient d'arriver */
      count(what, n){
        if (!what) return;
        const nb = Number(n) || 1;
        totals[what]  = (totals[what]  || 0) + nb;
        attente[what] = (attente[what] || 0) + nb;
        planifier();

        /* Toutes les missions qui surveillent ce compteur */
        for (const m of misList){
          if (m.track === what && m.need != null && totals[what] >= m.need && !done[m.id]){
            grant(m);                     /* pas d'await : le jeu ne doit pas ralentir */
          }
        }
      },

      /* Validation manuelle : BubbleQuest.done('un_id') */
      async mission(id){
        const m = id ? misList.find(x => x.id === id) : misList[0];
        if (!m) return console.warn('[Bubble] mission inconnue :', id);
        await grant(m);
      },

      /* 🏆 Fin de partie : uniquement le classement */
      async score(value){
        const v = Number(value);
        if (!isFinite(v)) return console.warn('[Bubble] score invalide :', value);

        const better = (best === null) ? true
                     : (game?.score?.order === 'asc' ? v < best : v > best);
        if (!better) return;
        const prev = best;
        best = v;
        window.BubbleQuest.best = v;

        try {
          await setDoc(scoreRef, {
            game: GAME_ID,
            uid: user.uid,
            pseudo: data.pseudo || user.displayName || user.email.split('@')[0],
            avatarId: data.avatarId || 'bully_1',
            sub,
            value: v,
            updated: new Date().toISOString().slice(0,10),
          }, { merge:true });
        } catch(e){
          best = prev;                        /* échec : on remet l'ancien */
          window.BubbleQuest.best = prev;
          return console.warn('[Bubble] record non enregistré :', e.message);
        }

        /* La bulle est en dehors du try : si l'affichage rate,
           le record reste enregistré quand même. */
        try {
          xpToast('🏆', prev === null
            ? `Premier record : ${showVal(v)}`
            : `Nouveau record : ${showVal(v)} !`, '', '#FFC53D');
        } catch(e){}
      }
    };

    /* Rattrapage : si un compteur dépasse déjà un palier sans que la
       mission ait été validée (mission ajoutée après coup), on valide. */
    for (const m of misList){
      if (m.track && m.need != null && (totals[m.track] || 0) >= m.need && !done[m.id]){
        await grant(m);
      }
    }

    window.BubbleQuest.ready = true;
    flush();
  });
})();
