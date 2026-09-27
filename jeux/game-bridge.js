/* Transition visuelle entre Bubble Site et Bubble Games. */
(function gameBridge(){
  const KEY = 'bubble-game-mode-transition';
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function state(value){
    try {
      if (value) sessionStorage.setItem(KEY, JSON.stringify(value));
      else {
        const raw = sessionStorage.getItem(KEY);
        sessionStorage.removeItem(KEY);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (_) { return null; }
  }

  function pixelCurtain(mode){
    document.getElementById('game-pixel-curtain')?.remove();
    const curtain = document.createElement('div');
    curtain.id = 'game-pixel-curtain';
    curtain.className = mode;
    curtain.setAttribute('aria-hidden','true');
    const colors = ['#12131D','#1C2440','#293A62','#FF5C8A','#5B8DEF','#FFC93C'];
    for (let i = 0; i < 96; i++){
      const pixel = document.createElement('span');
      const row = Math.floor(i / 12), col = i % 12;
      pixel.style.setProperty('--delay', `${(row * 24 + Math.abs(5.5 - col) * 9)}ms`);
      pixel.style.setProperty('--pixel', colors[(i + row * 2) % colors.length]);
      curtain.appendChild(pixel);
    }
    document.body.appendChild(curtain);
    return curtain;
  }

  function isSiteDestination(url){
    const path = decodeURIComponent(url.pathname).toLowerCase();
    return !path.includes('/jeux/') && /\.html$|\/$/.test(path);
  }

  function enterGameMode(){
    const incoming = state();
    const current = new URL(location.href);
    const marked = current.searchParams.get('bubble-transition') === 'game';
    if (((!incoming || incoming.direction !== 'to-game' || Date.now() - incoming.at > 5000) && !marked) || reducedMotion) return;
    if (marked){
      current.searchParams.delete('bubble-transition');
      history.replaceState(null,'',current.href);
    }
    document.body.classList.add('game-mode-entering');
    const curtain = pixelCurtain('revealing');
    window.setTimeout(() => {
      curtain.remove();
      document.body.classList.remove('game-mode-entering');
    }, 900);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || reducedMotion || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self' || link.hasAttribute('download')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !isSiteDestination(destination)) return;
    event.preventDefault();
    document.body.classList.add('game-mode-leaving');
    pixelCurtain('covering');
    state({ direction:'to-site', at:Date.now() });
    destination.searchParams.set('bubble-transition','site');
    window.setTimeout(() => location.assign(destination.href), 760);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enterGameMode);
  else enterGameMode();
})();
