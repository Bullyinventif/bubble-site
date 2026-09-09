// ============================================================
// 🏆 CLASSEMENT — données
// Relie chaque jeu de games-data.js (par son id numérique) à :
//   • scoreId  l'id utilisé dans Firestore (collection "scores"),
//              écrit par BubbleQuest.score() dans chaque jeu.
//              ⚠️ Doit être identique à l'id du jeu dans
//              bubble_data.js du Bubble Site (window.GAMES).
//   • label    ce qu'on compte, affiché sous le nom du jeu
//   • unit     le mot après le chiffre ("pts", "poissons"…)
//              Cas spécial : unit:'time' → affiché en 1:23
//   • order    'desc' = le plus GRAND gagne · 'asc' = le plus PETIT gagne
//
// Un jeu de games-data.js qui n'a pas d'entrée ici n'apparaît
// simplement pas dans le classement (ex : un jeu tout neuf sans
// score configuré côté site).
// ============================================================
const SCORE_GAMES = [
  { gameId: 1, scoreId: 'bubblecraft',        label: 'Blocs posés',       unit: 'blocs',     order: 'desc' },
  { gameId: 2, scoreId: 'fishing_time',       label: 'Poissons attrapés', unit: 'poissons',  order: 'desc' },
  { gameId: 3, scoreId: 'box_run',            label: 'Meilleur score',    unit: 'pts',       order: 'desc' },
  { gameId: 4, scoreId: 'spacecraft_burster', label: 'Vaisseaux détruits',unit: 'vaisseaux', order: 'desc' },
  { gameId: 5, scoreId: 'block_craft',        label: 'Blocs posés',       unit: 'blocs',     order: 'desc' },
];

// Fusionne avec GAMES (games-data.js) pour récupérer nom/image/url
function scoreGamesResolved() {
  return SCORE_GAMES.map(function (sg) {
    var g = GAMES.find(function (x) { return x.id === sg.gameId; });
    if (!g) return null;
    return {
      scoreId: sg.scoreId, label: sg.label, unit: sg.unit, order: sg.order,
      name: g.name, image: g.image, url: g.url,
    };
  }).filter(Boolean);
}

// Écrire joliment un score : 1 240 pts · 12 poissons · 1:23
function fmtScore(cfg, v) {
  var n = Number(v) || 0;
  if (cfg.unit === 'time') {
    var t = Math.max(0, Math.round(n));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }
  var nb = n.toLocaleString('fr-FR');
  return cfg.unit ? nb + ' ' + cfg.unit : nb;
}

// Trier une liste de records du meilleur au moins bon
function sortScores(cfg, rows) {
  var asc = cfg.order === 'asc';
  return rows.slice().sort(function (a, b) { return asc ? a.value - b.value : b.value - a.value; });
}

// 🥇🥈🥉 puis 4, 5, 6…
function rankBadge(i) {
  return ['🥇', '🥈', '🥉'][i] || String(i + 1);
}
