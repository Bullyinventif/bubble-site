function initApp() { console.log('Bubble Site initialisé'); }
function launchGame(gameId) { window.location.href = 'jeux/bubble_game_protection.html?game=' + gameId; }
function goTo(page) { window.location.href = page; }
function goHome() { window.location.href = 'accueil'; }
window.initApp = initApp; window.launchGame = launchGame; window.goTo = goTo; window.goHome = goHome;