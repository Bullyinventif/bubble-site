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
   Les posts sont normalement écrits depuis le panneau admin
   (patesbolognaise.html) et stockés dans Firebase.
   La liste ci-dessous ne sert que de SECOURS : elle s'affiche
   uniquement si Firebase ne répond pas.
   Champs d'un post :
     id        identifiant unique
     title     titre
     date      "2026-08-15"
     desc      le texte principal (mise en forme Bubble : voir bbFormat)
     images    ["vlog/photo1.png", ...]  (la 1ʳᵉ sert de couverture)
     captions  ["légende 1", ...]        (dans le même ordre que images)
     layout    "grande" | "deux" | "galerie"
     tags      ["annonce", "fix"]  (identifiants de tags, voir window.VLOG_TAGS)
     accent    "#FF5FA2"   couleur du post
     pinned    true/false  épinglé en haut du vlog
     video     lien YouTube (optionnel)
     btnText / btnUrl   bouton personnalisé (optionnel)
     sub       qui peut le voir : "free" = tout le monde, même sans compte
     published true/false
══════════════════════════════════════ */
window.VLOG = [
  /* ← tes posts viennent ici */
];


/* ══════════════════════════════════════
   MISE EN FORME DES TEXTES DE VLOG  (« format Bubble »)
   Un mini-langage tout simple, sans HTML, donc sans risque.

     **gras**        __souligné__      *italique*      ~~barré~~
     # Grand titre   ## Titre          ### Petit titre
     - un point de liste
     [voir le tome 2](https://…)
     §c texte en rouge §r  (§r remet la couleur normale)
     ---             (une ligne de séparation)

   Les codes couleur sont dans window.BB_COLORS.
══════════════════════════════════════ */
window.BB_COLORS = [
  { code:'c', name:'Rouge',  hex:'#E23B3B' },
  { code:'o', name:'Orange', hex:'#F97316' },
  { code:'e', name:'Jaune',  hex:'#D89400' },
  { code:'a', name:'Vert',   hex:'#2FA648' },
  { code:'t', name:'Turquoise', hex:'#0FB5A0' },
  { code:'b', name:'Bleu',   hex:'#1690C6' },
  { code:'v', name:'Violet', hex:'#8236D6' },
  { code:'p', name:'Rose',   hex:'#DB3A7E' },
  { code:'g', name:'Gris',   hex:'#64809F' },
  { code:'n', name:'Noir',   hex:'#16283F' },
];
window.BB_COLOR_MAP = window.BB_COLORS.reduce((m,c) => (m[c.code] = c.hex, m), {});

window.bbEscape = t => String(t == null ? '' : t)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* Seuls ces liens sont acceptés (pas de javascript:…) */
function bbSafeUrl(u){
  const s = String(u || '').trim();
  if (/^(https?:\/\/|mailto:|#)/i.test(s)) return s;
  if (/^[\w\-./]+\.(html|png|jpe?g|gif|webp|pdf)(\?.*)?$/i.test(s)) return s;
  return '';
}

/* Les codes couleur d'UNE ligne. Toute couleur ouverte est refermée
   à la fin de la ligne : impossible de déteindre sur le reste du texte. */
function bbColors(line){
  let open = 0;
  let out = line.replace(/§([a-z])/g, (m, code) => {
    if (code === 'r'){ const close = '</span>'.repeat(open); open = 0; return close; }
    const hex = window.BB_COLOR_MAP[code];
    if (!hex) return '';
    open++;
    return `<span style="color:${hex}">`;
  });
  return out + '</span>'.repeat(open);
}

/* Gras / italique / souligné / barré / liens */
function bbInline(line){
  let t = bbColors(line);
  t = t.replace(/\[([^\]]{1,120})\]\(([^)\s]{1,300})\)/g, (m, txt, url) => {
    const u = bbSafeUrl(url);
    return u ? `<a href="${u}" target="_blank" rel="noopener">${txt}</a>` : txt;
  });
  t = t.replace(/\*\*([^*]{1,300})\*\*/g, '<b>$1</b>');
  t = t.replace(/__([^_]{1,300})__/g,     '<u>$1</u>');
  t = t.replace(/~~([^~]{1,300})~~/g,     '<s>$1</s>');
  t = t.replace(/(^|[^*])\*([^*\n]{1,300})\*/g, '$1<i>$2</i>');
  return t;
}

/* Le texte complet → du HTML sûr, à mettre dans un élément .bb */
window.bbFormat = function(txt){
  const lines = window.bbEscape(txt).split(/\r?\n/);
  const out = [];
  let list = null, para = [];

  const flushPara = () => { if (para.length){ out.push('<p>' + para.map(bbInline).join('<br>') + '</p>'); para = []; } };
  const flushList = () => { if (list){ out.push('<ul>' + list.map(l => '<li>' + bbInline(l) + '</li>').join('') + '</ul>'); list = null; } };

  for (const raw of lines){
    const line = raw.trimEnd();

    if (/^\s*-{3,}\s*$/.test(line)){ flushPara(); flushList(); out.push('<hr>'); continue; }

    const li = line.match(/^\s*[-•]\s+(.*)$/);
    if (li){ flushPara(); (list = list || []).push(li[1]); continue; }
    flushList();

    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h){ flushPara(); const n = h[1].length + 2; out.push(`<h${n}>${bbInline(h[2])}</h${n}>`); continue; }

    if (!line.trim()){ flushPara(); continue; }
    para.push(line);
  }
  flushPara(); flushList();
  return out.join('');
};

/* Version « texte nu », pour les aperçus courts (accueil, vignettes) */
window.bbPlain = function(txt, max){
  const t = String(txt || '')
    .replace(/§[a-z]/g, '')
    .replace(/[*_~#]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return max && t.length > max ? t.slice(0, max) + '…' : t;
};

/* ══════════════════════════════════════
   LES TAGS DU VLOG
   Ils se créent depuis le panneau admin et sont enregistrés dans Firebase.
   Cette liste sert de secours / de point de départ.
   Champs : id, name, emoji, color
══════════════════════════════════════ */
window.VLOG_TAGS = [
  { id:'annonce',  name:'Annonce',      emoji:'📢', color:'#2BB7F2' },
  { id:'maj',      name:'Mise à jour',  emoji:'🔄', color:'#46CE62' },
  { id:'fix',      name:'Fix Bug',      emoji:'🐛', color:'#E23B3B' },
  { id:'presenta', name:'Présentation', emoji:'🎤', color:'#A855F7' },
  { id:'coulisse', name:'Coulisses',    emoji:'🎬', color:'#FF5FA2' },
];
window.findTag = id => (window.VLOG_TAGS || []).find(t => t.id === id) || null;

/* Une pastille de tag prête à afficher */
window.tagChip = function(tag, small){
  if (!tag) return '';
  return `<span class="tag-chip${small ? ' sm' : ''}" style="--tg:${tag.color}">`
       + `${tag.emoji || ''} ${window.bbEscape(tag.name)}</span>`;
};

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

  /* 🫧 BASIC — 3 niveaux — thème : la bulle qui devient de la mousse */
  basic: [
    { id:'b1', name:'Petite bulle', level:1,
      width:3, ornaments:['bubble1'] },

    { id:'b2', name:'Bulles', level:2,
      width:5, grad:['#7FD8FF','#1690C6'], ornaments:['bubbleFew'] },

    { id:'b3', name:'Mousse', level:3,
      width:6.5, grad:['#8FDEFF','#1080B6'], glow:true,
      outer:{ shape:'circle', width:1.6, dashed:true, r:44, spin:true },
      ornaments:['bubbleCrown'] },
  ],

  /* ✦ BUBBLE+ — 20 niveaux — thème : or et royauté */
  plus: [
    { id:'p1', name:'Étincelle', level:1,
      color:'#F2B21A', width:3, ornaments:['sparkFew'] },

    { id:'p2', name:'Anneau doré', level:5,
      width:5.5, grad:['#FFE07A','#D89400'], ornaments:['sparkles'] },

    { id:'p3', name:'Laurier', level:10,
      width:5, grad:['#FFDF6E','#D08A00'], ornaments:['laurel','sparkFew'] },

    { id:'p4', name:'Couronne du roi', level:15,
      width:7, grad:['#FFE894','#C97F00'], glow:true,
      ornaments:['crownBig','laurel'] },

    { id:'p5', name:'Or massif', level:20,
      width:8.5, grad:['#FFEFAE','#B87400'], glow:true,
      outer:{ shape:'gear', width:3.4, r:48, spin:true, color:'#E8B22A' },
      ornaments:['crownRoyal','gems'] },
  ],

  /* 💎 BUBBLE X — 20 niveaux — thème : glace et cristal */
  x: [
    { id:'x1', name:'Givre', level:1,
      color:'#4FC3F7', width:3, ornaments:['frost'] },

    { id:'x2', name:'Éclats de glace', level:5,
      width:5.5, grad:['#A5E8FF','#0284C7'], ornaments:['shardsAll'] },

    { id:'x3', name:'Cristal', level:10,
      shape:'hex', width:6, grad:['#BDEEFF','#0B7FBF'], ornaments:['facets','frost'] },

    { id:'x4', name:'Prisme', level:15,
      shape:'hex', width:7, grad:['#D2F3FF','#0369A1'], glow:true,
      outer:{ shape:'hex', width:2, r:47, spin:true, color:'#7DD3FC' },
      ornaments:['facets','shardsAll'] },

    { id:'x5', name:'Cœur de glace', level:20,
      shape:'hex', width:9, grad:['#EAFAFF','#025E8C'], glow:true,
      ornaments:['icePeaks','facets'] },
  ],

  /* 🔮 BUBBLE MAX — 25 niveaux — thème : cosmos et orbites */
  max: [
    { id:'m1', name:'Orbe', level:1,
      color:'#A855F7', width:3, ornaments:['moon'] },

    { id:'m2', name:'Anneau planétaire', level:8,
      width:5.5, grad:['#D8B4FE','#7E22CE'], ornaments:['saturn'] },

    { id:'m3', name:'Constellation', level:16,
      width:5, grad:['#E9D5FF','#6D28D9'], ornaments:['constellation'] },

    { id:'m4', name:'Nébuleuse', level:22,
      width:7.5, grad:['#F0E1FF','#5B21B6'], glow:true, spin:true,
      outer:{ shape:'circle', width:1.4, dashed:true, r:49, spin:true, color:'#C084FC' },
      ornaments:['stardust','constellation'] },

    { id:'m5', name:'Big Bang', level:25,
      width:9, grad:['#FBEFFF','#4C1D95'], glow:true,
      outer:{ shape:'gear', width:3, r:50, spin:true, color:'#C084FC' },
      ornaments:['bigbang','stardust'] },
  ],
};

window.FRAMES.admin = [
  { id:'ad1', name:'Badge admin', level:1,
    width:8, grad:['#FFC2DE','#B02F6B'], glow:true,
    outer:{ shape:'gear', width:3.2, r:47, spin:true, color:'#FF7BB8' },
    ornaments:['gems','sparkFew'] },
];

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
/* free = visiteur sans compte. Un contenu en "free" est visible par TOUT LE MONDE. */
window.SUB_ORDER  = { free:0, basic:1, plus:2, x:3, max:4, admin:5 };
window.SUB_LABELS = { free:"GRATUIT", basic:"BASIC", plus:"BUBBLE+", x:"BUBBLE X", max:"BUBBLE MAX", admin:"ADMIN" };

/* Les abonnements que l'on peut acheter / afficher dans la liste.
   "admin" en est volontairement absent. */
window.PUBLIC_SUBS = ["basic","plus","x","max"];
window.isAdminSub  = s => s === 'admin';

/* Qui peut voir un post de vlog (le panneau admin propose cette liste) */
window.VLOG_SUBS = [
  { id:"free",  label:"🌍 Tout le monde (même sans compte)" },
  { id:"basic", label:"🫧 BASIC et plus" },
  { id:"plus",  label:"✦ BUBBLE+ et plus" },
  { id:"x",     label:"💎 BUBBLE X et plus" },
  { id:"max",   label:"🔮 BUBBLE MAX seulement" },
];

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
