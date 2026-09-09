// ============================================================
// 🎨 CLASSEMENT — rendu (style NÉO-BRUTALISME, assorti au reste du site)
// Fonctions pures : elles ne touchent ni à Firebase ni au DOM,
// elles retournent juste du HTML. Ça permet de les tester seules.
// Dépend de leaderboard-data.js (fmtScore, sortScores, rankBadge)
// chargé AVANT ce fichier.
// ============================================================

var LB_PODIUM = 3;   // nombre de joueurs montrés sur une carte
var LB_FULL   = 20;  // nombre de joueurs montrés dans le classement complet

function lbEsc(t) {
  return String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Une petite bulle d'avatar, avec repli sur 🫧 si l'image manque.
// L'image vient directement de bubble-site (voir avatarUrl(), défini
// dans firebase-init.js, chargé avant ce fichier) : pas de copie locale
// à maintenir quand Bully ajoute une nouvelle icône de profil.
function lbAvatar(avatarId) {
  var src = lbEsc(avatarUrl(avatarId));
  return '<span class="lb-av"><img src="' + src + '" alt="" ' +
    'onerror="this.parentElement.textContent=\'🫧\'"></span>';
}

// Une ligne du classement (podium ou liste complète)
function lbRow(cfg, row, i, currentUid) {
  var mine = currentUid && row.uid === currentUid;
  return '' +
    '<li class="lb-row r' + (i + 1) + (mine ? ' me' : '') + '">' +
      '<span class="lb-rank">' + rankBadge(i) + '</span>' +
      lbAvatar(row.avatarId) +
      '<span class="lb-who">' + lbEsc(row.pseudo || 'Joueur') + (mine ? ' <i>(toi)</i>' : '') + '</span>' +
      '<b class="lb-val">' + fmtScore(cfg, row.value) + '</b>' +
    '</li>';
}

// Ma place dans un classement déjà trié : { rank, total, value } ou null
function lbMyRank(sorted, currentUid) {
  if (!currentUid) return null;
  var i = sorted.findIndex(function (r) { return r.uid === currentUid; });
  if (i < 0) return null;
  return { rank: i + 1, total: sorted.length, value: sorted[i].value };
}

// La carte d'un jeu, dans la grille du classement
function lbCard(cfg, rows, currentUid) {
  var sorted = sortScores(cfg, rows);
  var top = sorted.slice(0, LB_PODIUM);
  var mine = lbMyRank(sorted, currentUid);

  var podium = top.length
    ? '<ol class="lb-podium">' + top.map(function (r, i) { return lbRow(cfg, r, i, currentUid); }).join('') + '</ol>'
    : '<div class="lb-empty">Aucun record pour l\'instant.<br><b>Sois le premier ! 🚀</b></div>';

  var foot;
  if (mine && mine.rank <= LB_PODIUM) {
    foot = '<div class="lb-me good">🎉 Tu es ' + mine.rank + (mine.rank === 1 ? 'er' : 'e') +
           ' — ' + fmtScore(cfg, mine.value) + '</div>';
  } else if (mine) {
    foot = '<div class="lb-me">Ton record : <b>' + fmtScore(cfg, mine.value) + '</b> · ' +
           mine.rank + 'e sur ' + mine.total + '</div>';
  } else {
    foot = '<div class="lb-me soft">Pas encore de record ici</div>';
  }

  return '' +
    '<div class="lb-card">' +
      '<div class="lb-top">' +
        '<div class="lb-shot"><img src="' + lbEsc(cfg.image) + '" alt="' + lbEsc(cfg.name) +
          '" onerror="this.style.opacity=.2"></div>' +
        '<div class="lb-title">' +
          '<div class="lb-name">' + lbEsc(cfg.name) + '</div>' +
          '<div class="lb-metric">' + lbEsc(cfg.label) +
            (sorted.length > LB_PODIUM ? ' · ' + sorted.length + ' joueurs' : '') + '</div>' +
        '</div>' +
      '</div>' +
      podium +
      foot +
      '<div class="lb-actions">' +
        '<button class="btn small lb-full-btn" data-game="' + lbEsc(cfg.scoreId) + '">CLASSEMENT →</button>' +
        (cfg.url ? '<a class="btn small lb-play" href="' + lbEsc(cfg.url) + '" target="_blank" rel="noopener">▶ JOUER</a>' : '') +
      '</div>' +
    '</div>';
}

// Toute la grille (une carte par jeu configuré)
function lbGrid(games, scoresByGame, currentUid) {
  if (!games.length) return '<div class="empty">Aucun jeu configuré pour le classement.</div>';
  return games.map(function (cfg) {
    var rows = scoresByGame[cfg.scoreId] || [];
    return lbCard(cfg, rows, currentUid);
  }).join('');
}

// Le contenu du classement complet (overlay), pour un seul jeu
function lbFullRanking(cfg, rows, currentUid) {
  var sorted = sortScores(cfg, rows).slice(0, LB_FULL);
  return sorted.length
    ? '<ol class="lb-podium big">' + sorted.map(function (r, i) { return lbRow(cfg, r, i, currentUid); }).join('') + '</ol>'
    : '<div class="lb-empty">Personne n\'a encore joué. À toi de jouer ! 🚀</div>';
}
