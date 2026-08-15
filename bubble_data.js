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

/* ── Réglages communs ── */
window.SUB_ORDER  = { free:0, basic:0, plus:1, x:2, max:3 };
window.SUB_LABELS = { free:"GRATUIT", basic:"BASIC", plus:"BUBBLE+", x:"BUBBLE X", max:"BUBBLE MAX" };

/* Progression de lecture (stockée dans le navigateur) */
window.getProgress = function(){
  try { return JSON.parse(localStorage.getItem('bubble_progress') || '{}'); }
  catch(e){ return {}; }
};
window.setProgress = function(p){
  localStorage.setItem('bubble_progress', JSON.stringify(p));
};
