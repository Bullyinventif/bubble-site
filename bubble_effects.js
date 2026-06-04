/* ══════════════════════════════════════
   bubble_effects.js — Effets d'avatar Bubble Inc.
   Inclure sur chaque page du site
══════════════════════════════════════ */

const BUBBLE_EFFECTS = {
  bubbles: {
    label:"✦ Bulles", color:"#5bc8ff",
    init(canvas, ctx, w, h){
      const particles = [];
      for(let i=0;i<20;i++) particles.push(newBubble(w,h));
      return particles;
    },
    tick(particles, ctx, w, h, dt){
      ctx.clearRect(0,0,w,h);
      particles.forEach((p,i)=>{
        p.y -= p.speed;
        p.x += Math.sin(p.phase + dt*0.001)*0.5;
        p.phase += 0.02;
        if(p.y < -p.r*2) Object.assign(p, newBubble(w,h,true));
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.strokeStyle = `rgba(91,200,255,${p.alpha*1.3})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x-p.r*.3,p.y-p.r*.3,p.r*.2,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha*.7})`;
        ctx.fill();
        ctx.shadowColor='rgba(91,200,255,.6)';
        ctx.shadowBlur=4;
      });
    }
  },
  snow: {
    label:"❄️ Neige", color:"#aaeeff",
    init(canvas,ctx,w,h){ const p=[]; for(let i=0;i<22;i++) p.push(newSnow(w,h)); return p; },
    tick(particles,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y += p.speed;
        p.x += Math.sin(p.phase)*0.4;
        p.phase += 0.03;
        p.rot += 0.02;
        if(p.y > h+8) Object.assign(p,newSnow(w,h,true));
        drawSnowflake(ctx,p.x,p.y,p.r,p.rot,p.alpha*1.2);
      });
    }
  },
  fire: {
    label:"🔥 Flammes", color:"#ff6622",
    init(canvas,ctx,w,h){ const p=[]; for(let i=0;i<24;i++) p.push(newEmber(w,h)); return p; },
    tick(particles,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y -= p.speed;
        p.x += (Math.random()-.5)*.8;
        p.life -= .015;
        if(p.life<=0) Object.assign(p,newEmber(w,h,true));
        const a = p.life*p.alpha;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
        ctx.fillStyle = p.life>.5?`rgba(255,${Math.floor(p.life*180)},0,${a*1.2})`:`rgba(255,80,0,${a*1.2})`;
        ctx.fill();
        ctx.shadowColor='rgba(255,100,0,.7)';
        ctx.shadowBlur=6;
      });
    }
  },
  lightning: {
    label:"⚡ Éclairs", color:"#ffe844",
    init(canvas,ctx,w,h){ return {timer:0,bolts:[]}; },
    tick(state,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      state.timer += dt;
      if(state.timer > 400+Math.random()*500){
        state.timer=0;
        state.bolts.push({x:Math.random()*w,life:1});
      }
      state.bolts = state.bolts.filter(b=>b.life>0);
      state.bolts.forEach(b=>{
        b.life -= .06;
        ctx.save();
        ctx.strokeStyle=`rgba(255,240,80,${b.life*1.2})`;
        ctx.lineWidth=2.2;
        ctx.shadowColor='#ffe844';
        ctx.shadowBlur=12;
        ctx.beginPath();
        let y=0; ctx.moveTo(b.x,y);
        while(y<h){ y+=8; ctx.lineTo(b.x+(Math.random()-.5)*10,y); }
        ctx.stroke();
        ctx.restore();
      });
    }
  },
  sparkles: {
    label:"✨ Étincelles", color:"#ffe066",
    init(canvas,ctx,w,h){ const p=[]; for(let i=0;i<20;i++) p.push(newSparkle(w,h)); return p; },
    tick(particles,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.life-=.018; p.y-=.4; p.x+=Math.sin(p.phase)*.3; p.phase+=.05;
        if(p.life<=0) Object.assign(p,newSparkle(w,h,true));
        drawStar(ctx,p.x,p.y,p.r,p.life*p.alpha*1.3,p.color);
      });
    }
  },
  aura: {
    label:"🌀 Aura Violette", color:"#cc44ff",
    init(canvas,ctx,w,h){ return {t:0}; },
    tick(state,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      state.t+=dt*.001;
      const cx=w/2,cy=h/2;
      for(let i=0;i<3;i++){
        const r=Math.min(w,h)/2*(0.85+i*.12)+Math.sin(state.t*1.5+i)*4;
        const a=0.24-i*.05;
        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle=`rgba(180,60,255,${a})`;
        ctx.lineWidth=3.5-i;
        ctx.shadowColor='rgba(180,60,255,.5)';
        ctx.shadowBlur=8;
        ctx.stroke();
      }
      for(let i=0;i<8;i++){
        const angle=state.t+i*(Math.PI/4);
        const r=Math.min(w,h)/2*.78;
        const x=cx+Math.cos(angle)*r, y=cy+Math.sin(angle)*r;
        ctx.beginPath();
        ctx.arc(x,y,3.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(220,100,255,0.8)`;
        ctx.fill();
      }
    }
  },
  aurora: {
    label:"🌈 Aurore", color:"#00ffcc",
    init(canvas,ctx,w,h){ return {t:0}; },
    tick(state,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      state.t+=dt*.0005;
      const cx=w/2,cy=h/2;
      const colors=["#00ffcc","#44aaff","#cc44ff","#ff44aa","#ffcc00"];
      colors.forEach((col,i)=>{
        const angle=state.t*(.8+i*.1)+i*(Math.PI*2/colors.length);
        const r=Math.min(w,h)/2*(.7+i*.06);
        const sx=cx+Math.cos(angle)*r*.3, sy=cy+Math.sin(angle)*r*.3;
        const grd=ctx.createRadialGradient(sx,sy,0,cx,cy,r);
        grd.addColorStop(0,col+"66");
        grd.addColorStop(1,"transparent");
        ctx.beginPath();
        ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.fillStyle=grd;
        ctx.fill();
      });
    }
  },
  portal: {
    label:"🌀 Portail Cosmique", color:"#FFD700",
    init(canvas,ctx,w,h){ return {t:0,stars:[...Array(24)].map(()=>({
      angle:Math.random()*Math.PI*2,
      r:Math.random()*.4+.5,
      speed:.4+Math.random()*.5,
      size:1.5+Math.random()*2.5,
      alpha:.6+Math.random()*.4
    }))}; },
    tick(state,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      state.t+=dt*.001;
      const cx=w/2,cy=h/2,maxR=Math.min(w,h)/2;
      /* Anneau doré rotatif */
      for(let i=0;i<3;i++){
        ctx.beginPath();
        ctx.arc(cx,cy,maxR*(.82+i*.06),state.t*(1+i*.3),state.t*(1+i*.3)+Math.PI*1.5);
        ctx.strokeStyle=`rgba(255,${180+i*25},0,${.7-i*.1})`;
        ctx.lineWidth=2.5;
        ctx.shadowColor='rgba(255,200,0,.8)';
        ctx.shadowBlur=10;
        ctx.stroke();
      }
      /* Étoiles orbitales */
      state.stars.forEach(s=>{
        s.angle+=s.speed*dt*.001;
        const r=maxR*s.r;
        const x=cx+Math.cos(s.angle)*r, y=cy+Math.sin(s.angle)*r;
        ctx.beginPath();
        ctx.arc(x,y,s.size,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,220,80,${s.alpha*1.1})`;
        ctx.fill();
        ctx.shadowColor='rgba(255,220,80,.8)';
        ctx.shadowBlur=6;
      });
    }
  },
  leaves: {
    label:"🍃 Feuilles", color:"#44cc66",
    init(canvas,ctx,w,h){ const p=[]; for(let i=0;i<16;i++) p.push(newLeaf(w,h)); return p; },
    tick(particles,ctx,w,h,dt){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y+=p.vy; p.x+=p.vx; p.rot+=p.rotSpeed;
        if(p.y>h+10||p.x<-10||p.x>w+10) Object.assign(p,newLeaf(w,h,true));
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0,0,p.r*.7,p.r,0,0,Math.PI*2);
        ctx.fillStyle=`rgba(60,${180+Math.random()*40},80,${p.alpha*1.2})`;
        ctx.shadowColor='rgba(68,204,102,.5)';
        ctx.shadowBlur=4;
        ctx.fill();
        ctx.restore();
      });
    }
  },
};

/* ── Helpers particules ── */
function newBubble(w,h,fromBottom){
  return {x:Math.random()*w,y:fromBottom?h+10:Math.random()*h,r:3+Math.random()*5,speed:.4+Math.random()*.5,alpha:.3+Math.random()*.4,phase:Math.random()*Math.PI*2};
}
function newSnow(w,h,fromTop){
  return {x:Math.random()*w,y:fromTop?-10:Math.random()*h,r:2+Math.random()*3,speed:.3+Math.random()*.4,alpha:.4+Math.random()*.4,phase:Math.random()*Math.PI*2,rot:Math.random()*Math.PI};
}
function newEmber(w,h,fromBottom){
  return {x:w/2+(Math.random()-.5)*w*.6,y:fromBottom?h:Math.random()*h,r:2+Math.random()*3,speed:.6+Math.random()*1,life:.4+Math.random()*.6,alpha:.6+Math.random()*.4};
}
function newSparkle(w,h,random){
  const colors=["#ffe066","#fff4aa","#ffcc00","#ffffff"];
  return {x:Math.random()*w,y:random?Math.random()*h:Math.random()*h,r:2+Math.random()*3,life:.3+Math.random()*.7,alpha:.5+Math.random()*.5,phase:Math.random()*Math.PI*2,color:colors[Math.floor(Math.random()*colors.length)]};
}
function newLeaf(w,h,random){
  return {x:Math.random()*w,y:random?-10:Math.random()*h,vx:(Math.random()-.5)*.8,vy:.3+Math.random()*.5,r:4+Math.random()*5,rot:Math.random()*Math.PI*2,rotSpeed:(Math.random()-.5)*.05,alpha:.4+Math.random()*.4};
}
function drawSnowflake(ctx,x,y,r,rot,alpha){
  ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
  ctx.strokeStyle=`rgba(180,240,255,${alpha})`; ctx.lineWidth=1;
  for(let i=0;i<6;i++){
    ctx.save(); ctx.rotate(i*Math.PI/3);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,r);
    ctx.stroke(); ctx.restore();
  }
  ctx.restore();
}
function drawStar(ctx,x,y,r,alpha,color){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle=color+Math.floor(alpha*255).toString(16).padStart(2,'0');
  ctx.beginPath();
  for(let i=0;i<5;i++){
    const a=i*Math.PI*2/5-Math.PI/2;
    const ai=a+Math.PI/5;
    i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    ctx.lineTo(Math.cos(ai)*r*.4,Math.sin(ai)*r*.4);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

/* ══ MOTEUR PRINCIPAL ══
   Attache un canvas animé autour de chaque .profile-bubble trouvé dans le DOM
*/
const _effectInstances = new Map();

function applyAvatarEffect(effectType){
  /* Nettoie les anciens canvas */
  document.querySelectorAll('.bubble-effect-canvas').forEach(el=>el.remove());
  _effectInstances.clear();

  if(!effectType || effectType === 'none') return;

  const eff = BUBBLE_EFFECTS[effectType];
  if(!eff) return;

  document.querySelectorAll('.profile-bubble').forEach(bubble=>{
    const rect = bubble.getBoundingClientRect();
    const size = Math.max(bubble.offsetWidth, bubble.offsetHeight);
    const pad  = 48; /* Augmenté de 28 à 48 pour plus de visibilité */
    const w    = size + pad*2;
    const h    = size + pad*2;

    const canvas = document.createElement('canvas');
    canvas.className = 'bubble-effect-canvas';
    canvas.width  = w;
    canvas.height = h;
    canvas.style.cssText = `
      position:absolute;
      top:${-pad}px; left:${-pad}px;
      width:${w}px; height:${h}px;
      pointer-events:none;
      z-index:5;
      border-radius:50%;
      filter:drop-shadow(0 0 8px rgba(255,255,255,.3));
    `;
    /* Le parent doit être position:relative */
    bubble.style.position = 'relative';
    bubble.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const state = eff.init(canvas, ctx, w, h);
    _effectInstances.set(canvas, {eff, ctx, w, h, state});
  });

  /* Boucle d'animation continue et infinie */
  let last = 0;
  function loop(ts){
    const dt = ts - last; last = ts;
    _effectInstances.forEach(({eff,ctx,w,h,state})=>{
      eff.tick(state, ctx, w, h, dt);
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

window.applyAvatarEffect = applyAvatarEffect;
