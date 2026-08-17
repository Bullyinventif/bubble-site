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
   ⭐ LA SEULE LIGNE À AJOUTER DANS TON CODE ⭐

   À la FIN d'une partie (game over, retour au menu, victoire…) :

       BubbleQuest.score(monScore);

   • le score part au classement affiché sur l'accueil du site
   • seul le MEILLEUR est gardé : rejouer moins bien n'efface rien
   • une bulle « 🏆 Nouveau record » s'affiche si c'en est un

   « monScore » = ce que compte ton jeu : des points, des poissons,
   des blocs posés… Peu importe, tant que c'est un nombre et que c'est
   toujours le même compteur.

   Le sens se règle dans bubble_data.js :
       score:{ order:'desc' }  → le plus GRAND gagne (défaut)
       score:{ order:'asc'  }  → le plus PETIT gagne (chrono…)

   Si tu n'appelles pas score(), le jeu marche quand même : il apparaît
   juste avec un classement vide.
   ══════════════════════════════════════════════════════════════════

   Rien ne se passe si le joueur n'est pas connecté ou si le site est
   hors ligne : ça ne peut pas casser ton jeu.
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
  /* ⭐ Fin de partie : envoie le score au classement */
  score(value){ queue.push({ type:'score', value: Number(value) }); flush(); },
  ready: false,
  best: null,      /* ton record actuel sur ce jeu (rempli au chargement) */
};

let engine = null;
function flush(){
  if (!engine) return;
  while (queue.length){
    const job = queue.shift();
    if (job.type === 'score') engine.score(job.value);
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

    /* 3. Le record du jeu, envoyé par BubbleQuest.score(...) */
    const scoreRef = doc(db, 'scores', `${GAME_ID}__${user.uid}`);
    const unit     = game?.score?.unit || '';
    const showVal  = v => unit === 'time'
      ? `${Math.floor(v/60)}:${String(Math.round(v)%60).padStart(2,'0')}`
      : `${v}${unit ? ' ' + unit : ''}`;

    /* On lit le record actuel une bonne fois pour toutes */
    let best = null;
    try {
      const s = await getDoc(scoreRef);
      if (s.exists()) best = Number(s.data().value);
    } catch(e){ /* pas grave */ }
    window.BubbleQuest.best = best;

    engine = {
      async score(value){
        const v = Number(value);
        if (!isFinite(v)) return console.warn('[Bubble] score invalide :', value);

        /* On n'écrit que si c'est vraiment mieux qu'avant */
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
    window.BubbleQuest.ready = true;
    flush();
  });
})();
