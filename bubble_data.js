/* ══════════════════════════════════════════════════════════════════
   bubble_data.js — LE catalogue du site (un seul endroit à modifier)
   Utilisé par : index.html, bubble_site_scans.html, bubble_site_gacha.html
   ⚠️ Avant, ces listes étaient copiées dans chaque page. Maintenant
   tu ne modifies QUE ce fichier et tout le site se met à jour.
   ══════════════════════════════════════════════════════════════════ */

/* ── Les personnages affichés sur l'accueil ──
   desc : laisse vide "" si tu veux juste le nom sous la bulle. */
window.CHARACTERS = [
  { id:'bully',   file:'bully_1.png',   name:'Bully',   desc:'' },
  { id:'anthony', file:'anthony_1.png', name:'Anthony', desc:'' },
  { id:'luna',    file:'luna_1.png',    name:'Luna',    desc:'' },
  { id:'frosty',  file:'frosty_1.png',  name:'Frosty',  desc:'' },
  { id:'zippy',   file:'zippy_1.png',   name:'Zippy',   desc:'' },
  { id:'rocky',   file:'rocky_1.png',   name:'Rocky',   desc:'' },
];

/* ── Catalogue des scans ──
   sub : "free" | "basic" | "plus" | "x" | "max" */
window.SCANS = {
  magazines: [
    {
      id:"mag1", title:"Bubble inc. — N°1",
      cover:"", logo:"",
      desc:"Le magazine quotidien de Bubble inc.",
      year:"2025", type:"Magazine", sub:"plus", emoji:"📰"
    },
  ],
  aventures: [
    {
      id:"gi2", title:"Bubble inc. Game IT Pt.2 !", pdf:"scans/game_it_pt_2.pdf",
      cover:"game_it_cover_2.png", logo:"game_it_logo_2.png",
      desc:"Découvrez tous les personnages de Bubble Inc. dans cette incroyable et déjantée aventure ! Bully et ses amis partent à la conquête du monde numérique.",
      year:"2025", type:"Aventure, Fantastique", sub:"x", emoji:"🎮"
    },
    {
      id:"gi1", title:"Bubble inc. Game IT !", pdf:"scans/game_it_pt_1.pdf",
      cover:"game_it_cover_1.png", logo:"game_it_logo_1.png",
      desc:"Découvrez tous les personnages de Bubble Inc. dans cette incroyable et déjantée aventure ! Bully et ses amis partent à la conquête du monde numérique.",
      year:"2025", type:"Aventure, Fantastique", sub:"x", emoji:"🎮"
    },
    {
      id:"eff1", title:"Enquête à la Fête Foraine", pdf:"scans/game_it_pt_2.pdf",
      cover:"enquete_ff_cover_1.png", logo:"",
      desc:"Bully et ses amis doivent savoir qui a volé le trophée dans le parc d'attractions !",
      year:"2025", type:"Aventure, Mystère", sub:"plus", emoji:"🎡"
    },
  ],
  direct: [
    {
      id:"bd1", title:"Bubble News #1",
      cover:"", logo:"",
      desc:"Le premier Bubble DIRECT !",
      year:"2026", type:"News, Direct", sub:"basic", emoji:"📡"
    },
  ]
};

/* Le scan mis en avant sur la page Scans */
window.VEDETTE_ID = "gi1";

/* Tous les scans à plat (pratique pour chercher par id) */
window.ALL_SCANS = [...window.SCANS.magazines, ...window.SCANS.aventures, ...window.SCANS.direct];

/* ── Les cartes du gacha ── */
window.CARD_POOL = [
  { id:1,  rarity:"Commun",     color:"#8A8A80", img:"cartes/apple_1.png",       name:"Pomme Rouge",         desc:"Ce rouge si... appétissant...",              effect:null },
  { id:2,  rarity:"Commun",     color:"#8A8A80", img:"cartes/apple_2.png",       name:"Pomme Verte",         desc:"Cette couleur est si apaisante.",            effect:null },
  { id:3,  rarity:"Peu commun", color:"#2FA648", img:"cartes/bomb.png",          name:"Une Bombe",           desc:"Une bombe littéralement !",                  effect:{ type:"bubbles",   label:"✦ Bulles",            color:"#2BB7F2" } },
  { id:4,  rarity:"Rare",       color:"#2B8FE0", img:"cartes/bacon.png",         name:"Plat de Bacon",       desc:"Mmmmm du bacon.",                            effect:{ type:"snow",      label:"❄️ Neige",             color:"#4BA8E8" } },
  { id:5,  rarity:"Rare",       color:"#2B8FE0", img:"cartes/apple_pie.png",     name:"Tarte à la Pomme",    desc:"Ça fait beaucoup de pommes !",               effect:{ type:"sparkles",  label:"✨ Étincelles",        color:"#E8A700" } },
  { id:6,  rarity:"Rare",       color:"#2B8FE0", img:"cartes/burger.png",        name:"Burger",              desc:"Le roi du fast-food !",                      effect:{ type:"fire",      label:"🔥 Flammes",           color:"#F97316" } },
  { id:7,  rarity:"Rare",       color:"#2B8FE0", img:"cartes/cookie.png",        name:"Cookies",             desc:"Le meilleur goûter pour tous !",             effect:{ type:"leaves",    label:"🍃 Feuilles",          color:"#3EAE55" } },
  { id:8,  rarity:"Épique",     color:"#8B5CF6", img:"cartes/sword.png",         name:"Une Épée",            desc:"Idéal pour trancher des légumes...",         effect:{ type:"lightning", label:"⚡ Éclairs",           color:"#8B5CF6" } },
  { id:9,  rarity:"Épique",     color:"#8B5CF6", img:"cartes/dragon_sword.png",  name:"L'Épée Dragon",       desc:"Elle renferme le pouvoir draconique...",     effect:{ type:"aura",      label:"🌀 Aura Violette",     color:"#A855F7" } },
  { id:10, rarity:"Super rare", color:"#EF5A3C", img:"cartes/emerald.png",       name:"Émeraude",            desc:"Très recherchée par les villageois...",      effect:{ type:"aurora",    label:"🌈 Aurore",            color:"#0FB5A0" } },
  { id:11, rarity:"Légendaire", color:"#E0A011", img:"cartes/star_collier.png",  name:"Collier des étoiles", desc:"Ce collier est accompagné d'une forme à 5 pointes...", effect:{ type:"portal", label:"🌀 Portail Cosmique", color:"#E09B00" } },
];

/* ══════════════════════════════════════
   LE VLOG
   Ajoute un post en haut de la liste : le premier de la liste est
   automatiquement celui mis en avant sur l'accueil et sur la page Vlog.
   Champs :
     id      identifiant unique (sert aux liens)
     title   titre du post
     date    "2026-08-15"  (format année-mois-jour, pour le tri et l'affichage)
     cover   image de couverture (optionnel)
     desc    petit texte de présentation
     video   lien YouTube (optionnel) — bouton "Regarder"
     sub     "basic" | "plus" | "x" | "max"  (qui peut le voir)
   Exemple :
     { id:"v1", title:"Bubble Direct #1", date:"2026-08-15", cover:"",
       desc:"Le premier vlog de Bubble inc. !", video:"", sub:"basic" },
══════════════════════════════════════ */
window.VLOG = [
  /* ← tes posts viennent ici */
];

/* ── Catalogue des icônes de profil ──
   sub = abonnement minimum pour débloquer l'icône.
   Utilisé par la page Profil (le sélecteur) ET la page Abonnements. */
window.CATALOGUE = {
  "Classique": [
    { id:"bully_1",           file:"bully_1.png",           name:"Bully",           sub:"basic" },
    { id:"anthony_1",         file:"anthony_1.png",         name:"Anthony",         sub:"basic" },
    { id:"luna_1",            file:"luna_1.png",            name:"Luna",            sub:"basic" },
    { id:"frosty_1",          file:"frosty_1.png",          name:"Frosty",          sub:"basic" },
    { id:"zippy_1",           file:"zippy_1.png",           name:"Zippy",           sub:"basic" },
    { id:"rocky_1",           file:"rocky_1.png",           name:"Rocky",           sub:"basic" },
  ],
  "Pixel": [
    { id:"bully_pixel_1",     file:"bully_pixel_1.png",     name:"Bully Pixel",     sub:"plus" },
    { id:"plant_pixel_1",     file:"plant_pixel_1.png",     name:"Plante",          sub:"plus" },
    { id:"rock_pixel_1",      file:"rock_pixel_1.png",      name:"Roche",           sub:"plus" },
    { id:"star_pixel_1",      file:"star_pixel_1.png",      name:"Étoile",          sub:"plus" },
    { id:"snowflake_pixel_1", file:"snowflake_pixel_1.png", name:"Flocon",          sub:"plus" },
    { id:"sun_pixel_1",       file:"sun_pixel_1.png",       name:"Soleil",          sub:"plus" },
  ],
  "Rigolo": [
    { id:"bully_funny_1",     file:"bully_funny_1.png",     name:"Bully Rigolo",    sub:"plus" },
    { id:"anthony_funny_1",   file:"anthony_funny_1.png",   name:"Anthony Rigolo",  sub:"plus" },
    { id:"luna_funny_1",      file:"luna_funny_1.png",      name:"Luna Rigolo",     sub:"plus" },
    { id:"frosty_funny_1",    file:"frosty_funny_1.png",    name:"Frosty Rigolo",   sub:"plus" },
    { id:"zippy_funny_1",     file:"zippy_funny_1.png",     name:"Zippy Rigolo",    sub:"plus" },
    { id:"rocky_funny_1",     file:"rocky_funny_1.png",     name:"Rocky Rigolo",    sub:"plus" },
  ],
  "Enquête à la fête foraine": [
    { id:"bully_ff_1",        file:"bully_ff_1.png",        name:"Bully Enquêteur",  sub:"plus" },
    { id:"bulle_ff_1",        file:"bulle_ff_1.png",        name:"Bulle Enquêteuse", sub:"plus" },
    { id:"loop_ff_1",         file:"loop_ff_1.png",         name:"Une loupe",        sub:"plus" },
  ],
  "Bubble inc. Game IT!": [
    { id:"bully_game_it_1",   file:"bully_game_it_1.png",   name:"Bully Game IT",   sub:"x" },
    { id:"anthony_game_it_1", file:"anthony_game_it_1.png", name:"Anthony Game IT", sub:"x" },
    { id:"luna_game_it_1",    file:"luna_game_it_1.png",    name:"Luna Game IT",    sub:"x" },
    { id:"frosty_game_it_1",  file:"frosty_game_it_1.png",  name:"Frosty Game IT",  sub:"x" },
    { id:"zippy_game_it_1",   file:"zippy_game_it_1.png",   name:"Zippy Game IT",   sub:"x" },
    { id:"rocky_game_it_1",   file:"rocky_game_it_1.png",   name:"Rocky Game IT",   sub:"x" },
  ],
};

/* Toutes les icônes à plat + recherche par id */
window.ALL_ICONS = Object.values(window.CATALOGUE).flat();
window.findIcon  = id => window.ALL_ICONS.find(i => i.id === id) || null;

/* ── Les effets de fond (doivent correspondre aux types de bubble_effects.js) ──
   cardId = la carte gacha qui débloque l'effet. */
window.ALL_EFFECTS = [
  { type:"bubbles",   label:"Bulles",           emoji:"🫧",  color:"#2BB7F2", cardId:3  },
  { type:"snow",      label:"Neige",            emoji:"❄️",  color:"#4BA8E8", cardId:4  },
  { type:"sparkles",  label:"Étincelles",       emoji:"✨",  color:"#E8A700", cardId:5  },
  { type:"fire",      label:"Flammes",          emoji:"🔥",  color:"#F97316", cardId:6  },
  { type:"leaves",    label:"Feuilles",         emoji:"🍃",  color:"#3EAE55", cardId:7  },
  { type:"lightning", label:"Éclairs",          emoji:"⚡",  color:"#8B5CF6", cardId:8  },
  { type:"aura",      label:"Aura violette",    emoji:"🌀",  color:"#A855F7", cardId:9  },
  { type:"aurora",    label:"Aurore",           emoji:"🌈",  color:"#0FB5A0", cardId:10 },
  { type:"portal",    label:"Portail cosmique", emoji:"🪐",  color:"#E09B00", cardId:11 },
];

/* ══════════════════════════════════════
   LES JEUX
   Les jeux sont sur l'autre site (bubble_game). Ici on décrit juste
   ce qu'il faut pour afficher les missions sur la page Profil.
     id      identifiant utilisé dans le code du jeu (voir bubble_game_hook.js)
     mission la mission spéciale du jeu — change le texte et l'XP comme tu veux
══════════════════════════════════════ */
window.GAMES = [
  { id:'bubblecraft', name:'Bubblecraft', emoji:'⛏️',
    url:'https://bullyinventif.github.io/bubblecraft/',
    mission:{ id:'bubblecraft_terre', label:'Poser 10 blocs de terre', xp:80 } },

  { id:'fishing_time', name:'Fishing Time', emoji:'🎣',
    url:'https://bullyinventif.github.io/fishing_time/',
    mission:{ id:'fishing_10', label:'Attraper 10 poissons', xp:80 } },

  { id:'box_run', name:'Box Run', emoji:'📦',
    url:'https://bullyinventif.github.io/box_run/',
    mission:{ id:'boxrun_100', label:'Atteindre 100 de score', xp:80 } },

  { id:'spacecraft_burster', name:'Spacecraft Burster', emoji:'🚀',
    url:'https://bullyinventif.github.io/spacecraft-burster/',
    mission:{ id:'spacecraft_20', label:'Détruire 20 vaisseaux', xp:80 } },   /* ← change le texte */

  { id:'block_craft', name:'Block Craft', emoji:'🧱',
    url:'https://bullyinventif.github.io/block-craft/',
    mission:{ id:'blockcraft_build', label:'Construire une maison', xp:80 } },  /* ← change le texte */
];


/* ══════════════════════════════════════
   LES CADRES DE PROFIL
   Une série par abonnement, débloquée par niveau, choisie par le joueur.
   Chaque cadre = un anneau + des ornements dessinés autour de l'avatar.

     level     niveau qui débloque le cadre
     shape     'circle' (défaut) | 'star' | 'square'
     width     épaisseur de l'anneau
     dashed    true = anneau en pointillés
     spin      true = les ornements tournent lentement
     glow      true = halo lumineux
     ornaments dots · sparkles · crosses · spirals · rays · crown ·
               king · shards · flowers · burst
     color     par défaut la couleur de l'abonnement
══════════════════════════════════════ */
window.FRAMES = {

  /* 🫧 BASIC — 3 niveaux */
  basic: [
    { id:'b1', name:'Bulle',            level:1, ornaments:['dots'] },
    { id:'b2', name:'Bulle pétillante', level:2, ornaments:['sparkles'] },
    { id:'b3', name:'Bulle spirale',    level:3, ornaments:['spirals','dots'], spin:true },
  ],

  /* ✦ BUBBLE+ — 20 niveaux */
  plus: [
    { id:'p1', name:'Étincelle',            level:1,  ornaments:['sparkles'] },
    { id:'p2', name:'Rayons',               level:5,  ornaments:['rays'] },
    { id:'p3', name:"Couronne d'étoiles",   level:10, ornaments:['crown','sparkles'] },
    { id:'p4', name:'Royale',               level:15, ornaments:['king','sparkles'], glow:true },
    { id:'p5', name:'Étoile filante',       level:20, shape:'star', width:3.4,
               ornaments:['sparkles'], glow:true, spin:true },
  ],

  /* 💎 BUBBLE X — 20 niveaux */
  x: [
    { id:'x1', name:'Givre',            level:1,  ornaments:['crosses'] },
    { id:'x2', name:'Éclats',           level:5,  ornaments:['shards'] },
    { id:'x3', name:'Cristal',          level:10, ornaments:['shards','crosses'], glow:true },
    { id:'x4', name:'Éclat stellaire',  level:15, ornaments:['rays','crosses'], glow:true },
    { id:'x5', name:'Étoile de glace',  level:20, shape:'star', width:4,
               ornaments:['crosses'], glow:true, spin:true },
  ],

  /* 🔮 BUBBLE MAX — 25 niveaux */
  max: [
    { id:'m1', name:'Orbe',            level:1,  ornaments:['flowers'] },
    { id:'m2', name:'Orbe rayonnant',  level:8,  ornaments:['rays','flowers'], width:5 },
    { id:'m3', name:'Orbe couronné',   level:16, ornaments:['crown','flowers'], glow:true },
    { id:'m4', name:'Orbe fantôme',    level:22, dashed:true, ornaments:['flowers'], spin:true, glow:true },
    { id:'m5', name:'Big Bang',        level:25, ornaments:['burst','flowers'], glow:true, spin:true },
  ],
};
/* Un compte ADMIN a exactement les mêmes cadres qu'un compte MAX. */
window.FRAMES.admin = window.FRAMES.max;

/* ══════════════════════════════════════
   LES 4 MONNAIES
   C'est le même compteur d'XP pour tout le monde, mais il change de nom,
   de symbole et de couleur selon l'abonnement — et surtout, les missions
   rapportent plus quand tu montes en abonnement (multiplicateur).

   Exemple, la connexion du jour (base 20) :
     BASIC  ×1    →  +20 bulles
     BUBBLE+ ×2,5 →  +50 étoiles
     BUBBLE X ×4  →  +80 cristaux
     BUBBLE MAX ×6→ +120 orbes
══════════════════════════════════════ */
/* img : laisse vide pour utiliser l'emoji. Dès que tu mets un nom de
   fichier (ex: 'xp_bulle.png'), c'est ton image qui s'affiche partout,
   sans rien changer d'autre. */
window.CURRENCY = {
  basic: { name:'bulles',   one:'bulle',   symbol:'🫧', img:'', mult:1,   grad:['#5BC8FF','#2BB7F2'] },
  plus:  { name:'étoiles',  one:'étoile',  symbol:'✦',  img:'', mult:2.5, grad:['#FFD84D','#E0A011'] },
  x:     { name:'cristaux', one:'cristal', symbol:'💎', img:'', mult:4,   grad:['#7DD3FC','#0284C7'] },
  max:   { name:'orbes',    one:'orbe',    symbol:'🔮', img:'', mult:6,   grad:['#C084FC','#7E22CE'] },
  /* Abonnement caché : réservé aux comptes admin (jamais affiché dans la liste
     des abonnements, se met uniquement à la main dans Firestore). */
  admin: { name:'orbes',    one:'orbe',    symbol:'🛠️', img:'', mult:6,   grad:['#FF7BB8','#B02F6B'] },
};

/* Le symbole prêt à afficher : ton image si elle existe, sinon l'emoji */
window.currencyIcon = function(sub, size){
  const c = window.currencyOf(sub);
  const px = size || 16;
  return c.img
    ? `<img src="${c.img}" alt="${c.name}" style="width:${px}px;height:${px}px;object-fit:contain;vertical-align:-2px">`
    : c.symbol;
};

/* Combien rapporte une mission pour un abonnement donné */
window.xpFor = function(base, sub){
  const c = window.CURRENCY[sub] || window.CURRENCY.basic;
  return Math.round((base || 0) * c.mult);
};

/* Le nom de la monnaie, prêt à afficher */
window.currencyOf = sub => window.CURRENCY[sub] || window.CURRENCY.basic;

/* "2450 💎 cristaux" (ou avec ton image quand tu l'auras faite) */
window.amountLabel = function(n, sub, size){
  const c = window.currencyOf(sub);
  return `${n} ${window.currencyIcon(sub, size)} ${Math.abs(n) === 1 ? c.one : c.name}`;
};
/* "+80 💎" pour les pastilles de mission */
window.gainLabel = function(n, sub, size){
  return `+${n} ${window.currencyIcon(sub, size)}`;
};

/* ══════════════════════════════════════
   LES MISSIONS
   Change les textes et les XP ici, la page Profil suit automatiquement.
══════════════════════════════════════ */
window.MISSIONS = {
  /* ⚠️ Toutes les valeurs ci-dessous sont les valeurs BASIC (la base).
     Les autres abonnements sont calculés automatiquement :
     Bubble+ ×2,5 · Bubble X ×4 · Bubble MAX ×6 */

  /* Gagné pour chaque nouveau scan lu */
  scanXP: 10,
  /* Gagné la première fois qu'on lance un jeu */
  gameFirstXP: 50,

  general: [
    { id:'daily_login', label:'Se connecter',  desc:'Reviens sur le site chaque jour',        xp:20,  daily:true },
    { id:'first_game',  label:'Jouer à un jeu', desc:"Lance n'importe quel Bubble Game",      xp:100 },
    { id:'first_scan',  label:'Lire un scan',   desc:'Ouvre ton premier scan',                xp:100 },
  ],

  /* Paliers sur le nombre total de scans lus */
  scanMilestones: [
    { id:'scans_10', count:10, label:'Lire 10 scans', xp:100 },
    { id:'scans_20', count:20, label:'Lire 20 scans', xp:100 },
    { id:'scans_50', count:50, label:'Lire 50 scans', xp:100 },
  ],

  gacha: [
    { id:'collection_t1', label:'Compléter la collection — Tome 1',
      desc:'Obtenir les 11 cartes du premier tome', xp:100 },
  ],
};

/* ── Réglages communs ── */
window.SUB_ORDER  = { free:0, basic:0, plus:1, x:2, max:3, admin:4 };
window.SUB_LABELS = { free:"GRATUIT", basic:"BASIC", plus:"BUBBLE+", x:"BUBBLE X", max:"BUBBLE MAX", admin:"ADMIN" };

/* Les abonnements que l'on peut acheter / afficher dans la liste.
   "admin" en est volontairement absent. */
window.PUBLIC_SUBS = ["basic","plus","x","max"];
window.isAdminSub  = s => s === 'admin';

/* ── Progression de lecture (stockée dans le navigateur) ──
   Format : { "gi1": { page: 7, total: 24 }, ... }
   L'ancien format (un simple numéro de page) est encore lu sans casser. */
window.getProgress = function(){
  try { return JSON.parse(localStorage.getItem('bubble_progress') || '{}'); }
  catch(e){ return {}; }
};
window.setProgress = function(p){
  try { localStorage.setItem('bubble_progress', JSON.stringify(p)); } catch(e){}
};

/* Lit la progression d'un scan, quel que soit le format enregistré */
window.progressOf = function(id){
  const raw = window.getProgress()[id];
  if (raw == null) return null;
  if (typeof raw === 'number') return { page: raw, total: 0, pct: Math.min(raw * 5, 100) };
  const page  = raw.page  || 1;
  const total = raw.total || 0;
  return { page, total, pct: total ? Math.round(page / total * 100) : Math.min(page * 5, 100) };
};

/* Enregistre la page courante d'un scan */
window.saveProgress = function(id, page, total){
  if (!id) return;
  const p = window.getProgress();
  p[id] = { page: Math.max(1, page|0), total: total|0 };
  window.setProgress(p);
};
