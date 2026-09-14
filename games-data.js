const GAMES = [
  { id: 'bubble_game', name: 'Bubble Game', emoji: '🎮', description: 'Jeu classique de bulles', requiredSubscription: 'basic', path: 'jeux/bubble_game_protection.html', type: 'score' }
];
window.GAMES = GAMES;
function getGameById(id) { return GAMES.find(g => g.id === id); }
window.getGameById = getGameById;