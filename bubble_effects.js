/* ══════════════════════════════════════
   bubble_effects.js — Thèmes Bubble Inc.
   <script src="bubble_effects.js"></script> sur chaque page
   Appeler : window.applyTheme(effectType) après Firebase
══════════════════════════════════════ */

/* ── Couleurs de gradient de fond par thème ── */
const THEME_BG = {
  null:      ['#5bc8ff','#2e7dd4','#1a3a8c','#2d0a6e'],
  bubbles:   ['#5bc8ff','#2e7dd4','#1a3a8c','#2d0a6e'],
  lightning: ['#1a0a3a','#2a0a5a','#0a0a2a','#1a0050'],
  snow:      ['#0a1a3a','#0a2050','#081830','#050e20'],
  fire:      ['#2a0a00','#4a1000','#1a0500','#0a0200'],
  sparkles:  ['#0a0a2a','#1a1040','#0e0830','#050318'],
  aura:      ['#1a0030','#2a0050','#150025','#0a0018'],
  aurora:    ['#000a1a','#001020','#000818','#000510'],
  portal:    ['#000000','#0a0010','#050008','#020005'],
  leaves:    ['#0a1a08','#0e2a0a','#061408','#030a04'],
};

/* ── Glow avatar par thème ── */
const THEME_GLOW = {
  null:      {color:'rgba(91,200,255,.8)',  shadow:'rgba(46,125,212,.6)',  border:'rgba(91,200,255,1)'},
  bubbles:   {color:'rgba(91,200,255,.8)',  shadow:'rgba(46,125,212,.6)',  border:'rgba(91,200,255,1)'},
  lightning: {color:'rgba(180,100,255,.9)', shadow:'rgba(255,240,80,.8)',  border:'rgba(255,240,80,1)'},
  snow:      {color:'rgba(150,220,255,.9)', shadow:'rgba(100,200,255,.7)', border:'rgba(180,240,255,1)'},
  fire:      {color:'rgba(255,120,0,.9)',   shadow:'rgba(255,60,0,.8)',    border:'rgba(255,180,0,1)'},
  sparkles:  {color:'rgba(255,220,80,.9)',  shadow:'rgba(255,200,0,.7)',   border:'rgba(255,240,100,1)'},
  aura:      {color:'rgba(180,60,255,.9)',  shadow:'rgba(140,0,255,.8)',   border:'rgba(220,100,255,1)'},
  aurora:    {color:'rgba(0,255,180,.9)',   shadow:'rgba(0,200,255,.7)',   border:'rgba(100,255,220,1)'},
  portal:    {color:'rgba(255,180,0,.9)',   shadow:'rgba(255,140,0,.8)',   border:'rgba(255,220,80,1)'},
  leaves:    {color:'rgba(80,200,80,.9)',   shadow:'rgba(40,160,40,.7)',   border:'rgba(120,220,80,1)'},
};

/* ════════════════════════════════
   PARTICULES DE FOND
════════════════════════════════ */

function createBgCanvas(){
  const existing = document.getElementById('bubble-theme-canvas');
  if(existing) existing.remove();
  const canvas = document.createElement('canvas');
  canvas.id = 'bubble-theme-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.insertBefore(canvas, document.body.firstChild);
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; });
  return canvas;
}

/* Helpers */
function rnd(min,max){return min+Math.random()*(max-min);}

/* ── BULLES (défaut) ── */
function initBubbles(w,h){
  return [...Array(28)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), r:rnd(6,28), speed:rnd(.3,.9),
    alpha:rnd(.06,.18), hue:rnd(190,260), ph:rnd(0,Math.PI*2)
  }));
}
function tickBubbles(p,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  p.forEach(b=>{
    b.y-=b.speed; b.x+=Math.sin(b.ph+dt*.0005)*.8; b.ph+=.015;
    if(b.y<-b.r*2){b.y=h+b.r;b.x=rnd(0,w);}
    const g=ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.3,0,b.x,b.y,b.r);
    g.addColorStop(0,`rgba(255,255,255,${b.alpha*.6})`);
    g.addColorStop(.5,`hsla(${b.hue},80%,70%,${b.alpha})`);
    g.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.strokeStyle=`hsla(${b.hue},70%,80%,${b.alpha*.8})`; ctx.lineWidth=.8; ctx.stroke();
  });
}

/* ── ÉCLAIRS ── */
function initLightning(w,h){
  return {bolts:[], timer:0, sparks:[...Array(40)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), vx:rnd(-1,1), vy:rnd(-1,1),
    alpha:rnd(.1,.4), r:rnd(1,3), life:rnd(.3,1), maxLife:rnd(.3,1)
  }))};
}
function tickLightning(s,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  s.timer+=dt;
  /* Éclairs principaux */
  if(s.timer>rnd(800,2000)){
    s.timer=0;
    const nb=Math.floor(rnd(1,3));
    for(let i=0;i<nb;i++){
      const bolt={x:rnd(0,w),segs:[],life:1,alpha:rnd(.5,.9)};
      let y=0;
      while(y<h){bolt.segs.push({x:bolt.x+(rnd(-1,1)*20),y});y+=rnd(12,24);}
      s.bolts.push(bolt);
    }
  }
  s.bolts=s.bolts.filter(b=>b.life>0);
  s.bolts.forEach(b=>{
    b.life-=.04;
    ctx.save();
    ctx.shadowColor='rgba(200,150,255,.9)'; ctx.shadowBlur=18;
    ctx.strokeStyle=`rgba(220,180,255,${b.life*b.alpha})`;
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(b.segs[0].x,0);
    b.segs.forEach(s2=>ctx.lineTo(s2.x,s2.y));
    ctx.stroke();
    /* Branche secondaire */
    if(b.segs.length>3){
      const si=Math.floor(b.segs.length/2);
      ctx.strokeStyle=`rgba(200,150,255,${b.life*b.alpha*.5})`;
      ctx.lineWidth=.8;
      ctx.beginPath(); ctx.moveTo(b.segs[si].x,b.segs[si].y);
      for(let j=si;j<b.segs.length;j++) ctx.lineTo(b.segs[j].x+(rnd(-1,1)*15),b.segs[j].y);
      ctx.stroke();
    }
    ctx.restore();
  });
  /* Particules flottantes */
  s.sparks.forEach(p=>{
    p.x+=p.vx*.3; p.y+=p.vy*.3; p.life-=dt*.0003;
    if(p.life<=0){p.x=rnd(0,w);p.y=rnd(0,h);p.life=p.maxLife;}
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(200,160,255,${p.life*p.alpha})`; ctx.fill();
  });
}

/* ── NEIGE ── */
function initSnow(w,h){
  return [...Array(60)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), r:rnd(1.5,5), speed:rnd(.2,.7),
    alpha:rnd(.2,.6), ph:rnd(0,Math.PI*2), rot:rnd(0,Math.PI)
  }));
}
function tickSnow(p,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  p.forEach(b=>{
    b.y+=b.speed; b.x+=Math.sin(b.ph)*.4; b.ph+=.02; b.rot+=.01;
    if(b.y>h+8){b.y=-8;b.x=rnd(0,w);}
    ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.rot);
    ctx.strokeStyle=`rgba(200,235,255,${b.alpha})`; ctx.lineWidth=.8;
    for(let i=0;i<6;i++){
      ctx.save(); ctx.rotate(i*Math.PI/3);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,b.r*2); ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  });
}

/* ── FEU ── */
function initFire(w,h){
  return [...Array(50)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), r:rnd(2,6), speed:rnd(.4,1.2),
    life:rnd(.1,1), alpha:rnd(.3,.7)
  }));
}
function tickFire(p,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  p.forEach(b=>{
    b.y-=b.speed; b.x+=(Math.random()-.5)*.8; b.life-=.008;
    if(b.life<=0||b.y<0){b.y=h+b.r;b.x=rnd(0,w);b.life=rnd(.4,1);}
    const a=b.life*b.alpha;
    const col=b.life>.6?`rgba(255,${Math.floor(b.life*160+40)},0,${a})`
             :b.life>.3?`rgba(255,80,0,${a})`:`rgba(180,20,0,${a*.5})`;
    ctx.beginPath(); ctx.arc(b.x,b.y,b.r*b.life,0,Math.PI*2);
    ctx.fillStyle=col; ctx.fill();
  });
}

/* ── ÉTINCELLES ── */
function initSparkles(w,h){
  return [...Array(55)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), r:rnd(1,4),
    vx:rnd(-.3,.3), vy:rnd(-.5,-.1),
    alpha:rnd(.1,.5), life:rnd(.3,1), maxLife:rnd(.4,1),
    color:['#ffe066','#fff4aa','#ffcc00','#ffffff','#ffdd88'][Math.floor(rnd(0,5))]
  }));
}
function tickSparkles(p,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  p.forEach(b=>{
    b.x+=b.vx; b.y+=b.vy; b.life-=.005;
    if(b.life<=0){b.x=rnd(0,w);b.y=rnd(h*.5,h);b.life=b.maxLife;}
    ctx.save(); ctx.translate(b.x,b.y);
    const a=b.life*b.alpha;
    ctx.fillStyle=b.color+Math.floor(a*255).toString(16).padStart(2,'0');
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const ang=i*Math.PI*2/5-Math.PI/2,ai=ang+Math.PI/5;
      i===0?ctx.moveTo(Math.cos(ang)*b.r,Math.sin(ang)*b.r):ctx.lineTo(Math.cos(ang)*b.r,Math.sin(ang)*b.r);
      ctx.lineTo(Math.cos(ai)*b.r*.4,Math.sin(ai)*b.r*.4);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  });
}

/* ── AURA ── */
function initAura(w,h){ return {t:0,orbs:[...Array(12)].map(()=>({angle:rnd(0,Math.PI*2),r:rnd(.2,.45),speed:rnd(.2,.5),size:rnd(3,8),alpha:rnd(.15,.35)}))}; }
function tickAura(s,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  s.t+=dt*.0004;
  const cx=w/2,cy=h/2,maxR=Math.min(w,h)*.45;
  /* Anneaux pulsants */
  for(let i=0;i<4;i++){
    const r=maxR*(.4+i*.18)+Math.sin(s.t*1.2+i)*20;
    const g=ctx.createRadialGradient(cx,cy,r*.6,cx,cy,r);
    g.addColorStop(0,'transparent');
    g.addColorStop(.7,`rgba(150,40,255,${.04-i*.005})`);
    g.addColorStop(1,`rgba(180,60,255,${.08-i*.01})`);
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
  }
  /* Orbes orbitaux */
  s.orbs.forEach(o=>{
    o.angle+=o.speed*dt*.0005;
    const x=cx+Math.cos(o.angle)*maxR*o.r, y=cy+Math.sin(o.angle)*maxR*o.r;
    const g=ctx.createRadialGradient(x,y,0,x,y,o.size*2);
    g.addColorStop(0,`rgba(200,100,255,${o.alpha*1.5})`);
    g.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(x,y,o.size*2,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
  });
}

/* ── AURORE ── */
function initAurora(w,h){ return {t:0}; }
function tickAurora(s,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  s.t+=dt*.0003;
  const colors=['#00ffcc','#00aaff','#4400ff','#00ffaa','#0066ff'];
  colors.forEach((col,i)=>{
    const wave=Math.sin(s.t+i*.8)*h*.12;
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'transparent');
    g.addColorStop(.2+i*.06,col+(Math.floor(rnd(8,22)).toString(16).padStart(2,'0')));
    g.addColorStop(.5,'transparent');
    ctx.beginPath();
    ctx.moveTo(0,0);
    for(let x=0;x<=w;x+=8){
      const y=h*.25+Math.sin(x*.005+s.t+i)*h*.1+wave+i*30;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.lineTo(w,0); ctx.closePath();
    ctx.fillStyle=g; ctx.fill();
  });
}

/* ── PORTAIL ── */
function initPortal(w,h){ return {t:0,stars:[...Array(80)].map(()=>({x:rnd(0,w),y:rnd(0,h),r:rnd(.5,2.5),alpha:rnd(.1,.6),twinkle:rnd(0,Math.PI*2)}))}; }
function tickPortal(s,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  s.t+=dt*.0005;
  const cx=w/2,cy=h/2;
  /* Étoiles */
  s.stars.forEach(st=>{
    st.twinkle+=dt*.001;
    const a=st.alpha*(0.5+Math.sin(st.twinkle)*.5);
    ctx.beginPath(); ctx.arc(st.x,st.y,st.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,220,180,${a})`; ctx.fill();
  });
  /* Anneaux cosmiques */
  for(let i=0;i<5;i++){
    const r=80+i*60+Math.sin(s.t+i)*15;
    ctx.beginPath();
    ctx.arc(cx,cy,r,s.t*(1+i*.2),s.t*(1+i*.2)+Math.PI*(1.2+i*.1));
    ctx.strokeStyle=`rgba(255,${160+i*18},0,${.06-i*.008})`;
    ctx.lineWidth=1.5; ctx.stroke();
  }
  /* Nébuleuse centrale */
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,200);
  g.addColorStop(0,`rgba(100,0,200,${.04+Math.sin(s.t)*.02})`);
  g.addColorStop(.5,`rgba(50,0,100,${.03})`);
  g.addColorStop(1,'transparent');
  ctx.beginPath(); ctx.arc(cx,cy,200,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
}

/* ── FEUILLES ── */
function initLeaves(w,h){
  return [...Array(35)].map(()=>({
    x:rnd(0,w), y:rnd(0,h), vx:rnd(-.4,.4), vy:rnd(.2,.6),
    r:rnd(4,10), rot:rnd(0,Math.PI*2), rs:rnd(-.03,.03),
    alpha:rnd(.15,.45), g:Math.floor(rnd(140,210))
  }));
}
function tickLeaves(p,ctx,w,h,dt){
  ctx.clearRect(0,0,w,h);
  p.forEach(b=>{
    b.y+=b.vy; b.x+=b.vx+Math.sin(b.rot)*.3; b.rot+=b.rs;
    if(b.y>h+12){b.y=-12;b.x=rnd(0,w);}
    if(b.x<-12)b.x=w+12; if(b.x>w+12)b.x=-12;
    ctx.save(); ctx.translate(b.x,b.y); ctx.rotate(b.rot);
    ctx.beginPath(); ctx.ellipse(0,0,b.r*.6,b.r,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(40,${b.g},40,${b.alpha})`; ctx.fill();
    ctx.restore();
  });
}

/* ══ MAP thème → init/tick ══ */
const THEMES = {
  bubbles:   {init:initBubbles,   tick:tickBubbles},
  lightning: {init:initLightning, tick:tickLightning},
  snow:      {init:initSnow,      tick:tickSnow},
  fire:      {init:initFire,      tick:tickFire},
  sparkles:  {init:initSparkles,  tick:tickSparkles},
  aura:      {init:initAura,      tick:tickAura},
  aurora:    {init:initAurora,    tick:tickAurora},
  portal:    {init:initPortal,    tick:tickPortal},
  leaves:    {init:initLeaves,    tick:tickLeaves},
};

/* ══ GLOW AVATAR ══ */
function applyAvatarGlow(effectType){
  const g = THEME_GLOW[effectType] || THEME_GLOW['bubbles'];
  const styleId = 'bubble-glow-css';
  let s = document.getElementById(styleId);
  if(!s){ s=document.createElement('style'); s.id=styleId; document.head.appendChild(s); }
  s.textContent = `
    .profile-bubble, .big-avatar {
      border: 2.5px solid ${g.border} !important;
      box-shadow: 0 0 12px ${g.color}, 0 0 28px ${g.shadow}, inset 0 0 8px rgba(255,255,255,.15) !important;
      animation: glowPulse-${effectType||'base'} 2.5s ease-in-out infinite !important;
    }
    @keyframes glowPulse-${effectType||'base'} {
      0%,100% { box-shadow: 0 0 10px ${g.color}, 0 0 22px ${g.shadow}; }
      50%      { box-shadow: 0 0 22px ${g.color}, 0 0 45px ${g.shadow}, 0 0 70px ${g.shadow.replace(/[\d.]+\)$/,'0.3)')}; }
    }
  `;
}

/* ══ FOND DÉGRADÉ ══ */
function applyBgGradient(effectType){
  const cols = THEME_BG[effectType] || THEME_BG['bubbles'];
  document.body.style.background = `linear-gradient(160deg,${cols[0]} 0%,${cols[1]} 35%,${cols[2]} 65%,${cols[3]} 100%)`;
  document.body.style.minHeight = '100vh';
}

/* ══ MOTEUR PRINCIPAL ══ */
let _rafId = null;

function applyTheme(effectType){
  /* Stop animation précédente */
  if(_rafId){ cancelAnimationFrame(_rafId); _rafId=null; }

  /* Fond dégradé */
  applyBgGradient(effectType);

  /* Glow avatar */
  applyAvatarGlow(effectType);

  /* Canvas de fond (remplace .bubble-bg) */
  const bubbleBg = document.getElementById('bubbleBg');
  if(bubbleBg) bubbleBg.style.display = 'none';

  if(!effectType || effectType==='none' || !THEMES[effectType]){
    /* Thème par défaut : réaffiche les bulles HTML */
    if(bubbleBg) bubbleBg.style.display = '';
    return;
  }

  const canvas = createBgCanvas();
  const ctx = canvas.getContext('2d');
  const w = ()=>canvas.width, h = ()=>canvas.height;
  const theme = THEMES[effectType];
  let state = theme.init(w(), h());

  window.addEventListener('resize', ()=>{ state = theme.init(w(), h()); });

  let last = 0;
  function loop(ts){
    const dt = Math.min(ts-last, 50); last = ts;
    theme.tick(state, ctx, w(), h(), dt);
    _rafId = requestAnimationFrame(loop);
  }
  _rafId = requestAnimationFrame(loop);
}

/* Compatibilité ancien nom */
window.applyAvatarEffect = applyTheme;
window.applyTheme = applyTheme;
