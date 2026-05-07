(function(){
'use strict';
const P=[
{t:'Adversarial SAE Research',s:'Lead Author, 2026',c:'Research',y:'2026',ty:'Paper',tc:'Python, PyTorch',gh:'https://github.com/Solus-QE/GaslightingAI',d:'Lead-authored research on adversarial reasoning using sparse autoencoder architectures.',d2:'Explores SAE-based detection of adversarial behaviors in LLMs.'},
{t:'Latent Space Reasoning',s:'Co-Author, NEMI',c:'Research',y:'2026',ty:'Paper',tc:'Python, PyTorch',gh:'https://github.com/Solus-QE/eval',d:'Co-authored paper exploring latent space reasoning in neural networks.',d2:'Examines geometric structure of latent spaces and reasoning capabilities.'},
{t:'EvalEval — Eval Cards',s:'EvalEval Coalition',c:'Open Source',y:'2026',ty:'OSS',tc:'JS, React, Python',gh:'https://github.com/Solus-QE/eval',d:'Frontend for standardized evaluation cards for ML models.',d2:'Contributing to frontend and ML research for technical publications.'},
{t:'Codey',s:'AI Agent, 2026',c:'AI/ML',y:'2026',ty:'Agent',tc:'Python, LLM APIs',gh:'https://github.com/Solus-QE/codey',d:'AI-powered coding agent for intelligent code generation.',d2:'Advanced prompt engineering and agent orchestration patterns.'},
{t:'Aerodynamics Graphics',s:'C Programming',c:'Engineering',y:'2026',ty:'Simulation',tc:'C, OpenGL',gh:'https://github.com/Solus-QE/aerodynamics_graphics',d:'Low-level aerodynamics simulation and visualization in C.',d2:'Computational physics with real-time rendering.'},
{t:'Aperture',s:'GDScript, 2025',c:'Game Dev',y:'2025',ty:'Game',tc:'GDScript, Godot',gh:'https://github.com/Solus-QE/Aperture',d:'Game built with Godot Engine showcasing interactive mechanics.',d2:'Game architecture, physics, and interaction design.'},
{t:'CryptoFraudDetector',s:'ML Security',c:'AI/ML',y:'2025',ty:'Pipeline',tc:'Python, sklearn',gh:'https://github.com/Solus-QE/CryptoFraudDetector',d:'ML system for detecting fraudulent crypto transactions.',d2:'Supervised classification and unsupervised anomaly detection.'},
{t:'GaslightingAI',s:'Adversarial, 2025',c:'Research',y:'2025',ty:'Research',tc:'Python, Jupyter',gh:'https://github.com/Solus-QE/GaslightingAI',d:'Research exploring adversarial manipulation of AI systems.',d2:'Examines robustness against subtle deception techniques.'}
];
const SECS=['about','projects','experience','contact'];
const LABELS={about:'About',projects:'Projects',experience:'Experience',contact:'Contacts'};
const WINS={about:'winAbout',projects:'winProjects',experience:'winExperience',contact:'winContact'};
let active='about',history=['about'],zB=24,menuOpen=false;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

function init(){
  initCursor();buildSpiral();buildSidebar();buildBookSpines();buildRows();buildMenu();buildSkills();
  bindNav();bindMenu();bindClicks();initReveal();initAudio();drawHT('htC1',0);drawHT('htC2',1);runPreloader();
}

// Audio
function initAudio(){
  const audio=$('#bgAudio');
  const btn=$('#soundToggle');
  if(!audio||!btn)return;
  audio.volume=0.3;
  let playing=false;

  function toggleSound(){
    if(playing){
      audio.pause();
      playing=false;
      btn.classList.remove('playing');
      btn.querySelector('.sound-on').style.display='none';
      btn.querySelector('.sound-off').style.display='block';
    }else{
      audio.play().then(()=>{
        playing=true;
        btn.classList.add('playing');
        btn.querySelector('.sound-on').style.display='block';
        btn.querySelector('.sound-off').style.display='none';
      }).catch(()=>{});
    }
  }

  btn.addEventListener('click',toggleSound);

  // Auto-start on first user interaction (browser policy requires gesture)
  function autoStart(){
    if(!playing){
      audio.play().then(()=>{
        playing=true;
        btn.classList.add('playing');
        btn.querySelector('.sound-on').style.display='block';
        btn.querySelector('.sound-off').style.display='none';
      }).catch(()=>{});
    }
    document.removeEventListener('click',autoStart);
    document.removeEventListener('keydown',autoStart);
  }
  document.addEventListener('click',autoStart,{once:false});
  document.addEventListener('keydown',autoStart,{once:false});
}

// Cursor
function initCursor(){
  const c=$('#cursor');if(!c)return;
  document.addEventListener('mousemove',e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'});
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('a,button,.nav-link,.nav-menu-btn,.proj-row,.sidebar-card,.menu-card,.nav-logo,.logo-br,.gh-btn,.win-bar-close,.book-spine'))c.classList.add('hover');
    else c.classList.remove('hover');
  });
}

// Preloader
function runPreloader(){
  const el=$('#preloaderPct'),pr=$('#preloader');
  let v=0;
  const iv=setInterval(()=>{
    v+=Math.random()*12+2;if(v>100)v=100;
    if(el)el.textContent=Math.floor(v)+'%';
    if(v>=100){clearInterval(iv);setTimeout(()=>{if(pr)pr.classList.add('done');setTimeout(()=>{if(pr)pr.remove()},1000)},400)}
  },80);
}

// Spiral
function buildSpiral(){const e=$('#spiral');if(!e)return;for(let i=0;i<Math.ceil(innerHeight/26);i++){const d=document.createElement('div');d.className='spiral-dot';e.appendChild(d)}}

// Sidebar
function buildSidebar(){
  const el=$('#sidebar');if(!el)return;
  const cols={about:'#8a8580',projects:'#8a8580',experience:'#c97860',contact:'#8a8580'};
  SECS.forEach((s,i)=>{
    const c=document.createElement('div');c.className='sidebar-card'+(s===active?' active':'');c.dataset.nav=s;
    c.innerHTML=`<div class="sidebar-card-img"><canvas data-sc="${s}"></canvas></div><div class="sidebar-card-label">${LABELS[s]}</div>`;
    c.addEventListener('click',()=>goTo(s));el.appendChild(c);
    if(i<SECS.length-1){const sp=document.createElement('div');sp.className='sidebar-sep';sp.innerHTML='<div class="sidebar-sep-line"><span></span><span></span><span></span></div>';el.appendChild(sp)}
  });
  requestAnimationFrame(()=>SECS.forEach(s=>{const c=document.querySelector(`[data-sc="${s}"]`);if(c)drawThumb(c,s)}));
}

function drawThumb(cv,sec){
  const w=88,h=117;cv.width=w;cv.height=h;const x=cv.getContext('2d');
  x.fillStyle=sec==='experience'?'#c97860':'#8a8580';x.fillRect(0,0,w,h);
  // Titlebar
  x.fillStyle='rgba(0,0,0,0.06)';x.fillRect(0,0,w,8);
  x.fillStyle='rgba(0,0,0,0.2)';x.beginPath();x.arc(5,4,2,0,Math.PI*2);x.fill();x.beginPath();x.arc(11,4,2,0,Math.PI*2);x.fill();
  // Content
  x.fillStyle='rgba(255,255,255,0.12)';
  for(let y=12;y<h-18;y+=6){x.fillRect(5,y,15+Math.random()*35,2.5)}
  if(sec==='about'){x.fillStyle='rgba(200,196,188,0.3)';x.fillRect(w*0.55,8,w*0.45,h*0.42);x.fillStyle='rgba(198,93,58,0.4)';x.fillRect(0,h*0.68,w*0.48,h*0.32)}
  if(sec==='experience'){x.fillStyle='rgba(168,78,48,0.25)';for(let y=10;y<h-8;y+=7)for(let xx=4;xx<w-4;xx+=10)if(Math.random()>0.3)x.fillRect(xx,y,8,4)}
  if(sec==='contact'){x.fillStyle='rgba(60,60,60,0.2)';for(let y=h*0.3;y<h*0.7;y+=5)for(let xx=w*0.2;xx<w*0.8;xx+=5){const r=Math.max(0,2-Math.sqrt((xx-w/2)**2+(y-h/2)**2)*0.02);if(r>0.3){x.beginPath();x.arc(xx,y,r,0,Math.PI*2);x.fill()}}}
}

// Book Spines
function buildBookSpines(){
  ['bookCovers','projBookCovers'].forEach(id=>{
    const el=$('#'+id);if(!el)return;
    const n=14+Math.floor(Math.random()*6);
    for(let i=0;i<n;i++){const s=document.createElement('div');s.className='book-spine';s.style.height=(65+Math.random()*30)+'%';el.appendChild(s)}
  });
}

// Project Rows
function buildRows(){
  const al=$('#aboutList'),fl=$('#featuredList'),full=$('#projectsFull');
  P.forEach((p,i)=>{
    if(al&&i<6)al.appendChild(mkRow(p,i));
    if(fl&&i<5){const r=mkRow(p,i);r.querySelector('.proj-num').style.color='var(--accent-copper)';fl.appendChild(r)}
    if(full)full.appendChild(mkRow(p,i));
  });
}
function mkRow(p,i){
  const d=document.createElement('div');d.className='proj-row reveal';d.dataset.pi=i;
  d.innerHTML=`<div class="proj-num">${i+1}</div><div class="proj-info"><div class="proj-name">${p.t}</div><div class="proj-sub">${p.s}</div></div><span class="proj-tag">${p.c}</span>`;
  return d;
}

// Menu
function buildMenu(){
  const g=$('#menuGrid');if(!g)return;
  SECS.forEach((s,i)=>{
    const c=document.createElement('div');c.className='menu-card';c.dataset.nav=s;
    c.innerHTML=`<div class="menu-card-head"><span class="menu-card-num">${i+1}</span><span class="menu-card-label">${LABELS[s]}</span></div><div class="menu-card-preview"><canvas data-mc="${s}"></canvas></div>`;
    c.addEventListener('click',()=>{closeMenu();goTo(s)});g.appendChild(c);
  });
  requestAnimationFrame(()=>SECS.forEach(s=>{const c=document.querySelector(`[data-mc="${s}"]`);if(c)drawMenuPrev(c,s)}));
}
function drawMenuPrev(cv,sec){
  const w=240,h=320;cv.width=w;cv.height=h;const x=cv.getContext('2d');
  x.fillStyle=sec==='experience'?'#c97860':sec==='contact'?'#d8d4cc':'#8a8580';x.fillRect(0,0,w,h);
  x.fillStyle='rgba(0,0,0,0.06)';x.fillRect(0,0,w,14);
  x.fillStyle='rgba(0,0,0,0.25)';x.beginPath();x.arc(8,7,3,0,Math.PI*2);x.fill();x.beginPath();x.arc(18,7,3,0,Math.PI*2);x.fill();
  x.fillStyle='rgba(0,0,0,0.08)';for(let y=22;y<h-16;y+=8)x.fillRect(10,y,25+Math.random()*(w-50),3);
  if(sec==='about'){x.fillStyle='rgba(200,196,188,0.35)';x.fillRect(w*0.55,14,w*0.45,h*0.45);x.fillStyle='rgba(100,100,100,0.15)';x.fillRect(w*0.58,h*0.18,w*0.38,h*0.25);x.fillStyle='rgba(198,93,58,0.45)';x.fillRect(0,h*0.66,w*0.48,h*0.34)}
  if(sec==='experience'){x.fillStyle='rgba(168,78,48,0.3)';for(let y=18;y<h-8;y+=10)for(let xx=6;xx<w-6;xx+=16)if(Math.random()>0.2)x.fillRect(xx,y,12,6)}
  if(sec==='contact'){x.fillStyle='rgba(60,60,60,0.25)';for(let y=h*0.25;y<h*0.7;y+=5)for(let xx=w*0.15;xx<w*0.85;xx+=5){const r=Math.max(0,2.5-Math.sqrt((xx-w/2)**2+(y-h*0.47)**2)*0.012);if(r>0.4){x.beginPath();x.arc(xx,y,r,0,Math.PI*2);x.fill()}}x.fillStyle='rgba(0,0,0,0.1)';x.fillRect(20,h-36,w-40,7);x.fillRect(45,h-25,w-90,5)}
}

// Skills
function buildSkills(){
  const g=$('#skillsGrid');if(!g)return;
  ['Python & ML','Systems Programming','Web Development','Game Development','Research & Writing','Aviation'].forEach((s,i)=>{
    const c=document.createElement('div');c.className='skill-card reveal';c.innerHTML=`<canvas data-sk="${i}"></canvas>`;g.appendChild(c);
  });
  requestAnimationFrame(()=>g.querySelectorAll('canvas').forEach((cv,i)=>{
    const w=200,h=267;cv.width=w;cv.height=h;const x=cv.getContext('2d');
    const cols=['#c65d3a','#8a8580','#2d3436','#6c5ce7','#00b894','#0984e3'];
    x.fillStyle=cols[i];x.fillRect(0,0,w,h);
    x.globalAlpha=0.15;x.fillStyle='#fff';
    for(let j=0;j<15;j++){x.beginPath();x.arc((Math.sin(i*3+j*2.1)*0.5+0.5)*w,(Math.cos(i*5+j*1.7)*0.5+0.5)*h,12+Math.sin(j)*8,0,Math.PI*2);x.fill()}
    x.globalAlpha=1;x.fillStyle='#fff';x.font='bold 13px Inter,sans-serif';
    x.fillText(['Python & ML','Systems Programming','Web Development','Game Development','Research & Writing','Aviation'][i],10,h-14);
  }));
}

// Nav
function bindNav(){
  $$('[data-nav]').forEach(el=>{if(!el.classList.contains('menu-card'))el.addEventListener('click',()=>goTo(el.dataset.nav))});
  $('#navLogo')?.addEventListener('click',()=>goTo('about'));
}

// Window navigation
function goTo(sec){
  if(sec===active)return;
  const ti=SECS.indexOf(sec);
  SECS.forEach((s,i)=>{
    const w=document.getElementById(WINS[s]);if(!w)return;
    if(s===sec){zB++;w.style.zIndex=zB;w.dataset.state='active'}
    else if(history.includes(s)){
      const d=Math.abs(ti-i);
      w.dataset.state=d===1?'behind-1':d===2?'behind-2':'behind-3';
    }else w.dataset.state='hidden';
  });
  if(!history.includes(sec))history.push(sec);
  active=sec;
  $$('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.nav===sec));
  $$('.sidebar-card').forEach(c=>c.classList.toggle('active',c.dataset.nav===sec));
  if(sec==='contact')setTimeout(()=>drawHT('htC2',1),300);
  // Re-trigger reveals in new window
  const body=document.getElementById(WINS[sec])?.querySelector('.win-body');
  if(body)body.querySelectorAll('.reveal').forEach(el=>{if(!el.classList.contains('visible'))scrollRevealCheck(el)});
}

// Menu
function bindMenu(){$('#menuBtn')?.addEventListener('click',()=>{menuOpen=true;$('#menu')?.classList.add('open')});$('#menuClose')?.addEventListener('click',closeMenu)}
function closeMenu(){menuOpen=false;$('#menu')?.classList.remove('open')}

// Clicks
function bindClicks(){
  document.addEventListener('click',e=>{
    const r=e.target.closest('.proj-row[data-pi]');
    if(r){const i=+r.dataset.pi;if(P[i])openDetail(P[i],i)}
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if(menuOpen){closeMenu();return}
    const d=document.querySelector('.win[data-win^="d-"][data-state="active"]');if(d){d.dataset.state='hidden';setTimeout(()=>d.remove(),700)}}
  });
}

function openDetail(p,i){
  $$('.win[data-win^="d-"]').forEach(w=>{w.dataset.state='hidden';setTimeout(()=>w.remove(),700)});
  const w=document.createElement('section');w.className='win';w.dataset.win='d-'+i;w.dataset.state='hidden';
  zB++;w.style.zIndex=zB;
  w.innerHTML=`<div class="win-bar"><div class="win-bar-dots"><div class="win-bar-dot"></div><div class="win-bar-dot"></div></div><span class="win-bar-title">Project</span><div class="win-bar-close" data-cd><span>Close</span> <span style="font-size:1.1em">&times;</span></div></div>
  <div class="win-body" style="position:relative"><div class="detail-head"><h2 class="detail-title">${p.t}</h2><span class="detail-tag">${p.c}</span></div>
  <div class="detail-img"><canvas id="dc${i}" width="800" height="450"></canvas></div>
  <div class="detail-subtitle">(${p.y})</div><div class="detail-quote">${p.d}</div>
  <div class="detail-body"><p>${p.d}</p><p>${p.d2}</p></div>
  <div class="detail-meta"><div class="detail-meta-item"><span class="detail-meta-label">Category</span><span class="detail-meta-val">${p.c}</span></div><div class="detail-meta-item"><span class="detail-meta-label">Year</span><span class="detail-meta-val">${p.y}</span></div><div class="detail-meta-item"><span class="detail-meta-label">Type</span><span class="detail-meta-val">${p.ty}</span></div></div>
  <div class="detail-body"><div><span class="detail-meta-label" style="display:block;margin-bottom:6px">Tech</span><span style="font-size:var(--fs-sm)">${p.tc}</span></div>
  <a href="${p.gh}" target="_blank" class="gh-btn"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>View on GitHub</a></div></div>`;
  $('#stage').appendChild(w);
  requestAnimationFrame(()=>requestAnimationFrame(()=>w.dataset.state='active'));
  w.querySelector('[data-cd]').addEventListener('click',()=>{w.dataset.state='hidden';setTimeout(()=>w.remove(),700)});
  setTimeout(()=>drawProjArt('dc'+i,i),150);
}

// Scroll Reveal
function initReveal(){
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:0.15});
  $$('.reveal').forEach(el=>obs.observe(el));
  // Also observe within scrollable win-bodies
  $$('.win-body').forEach(body=>{
    body.addEventListener('scroll',()=>{body.querySelectorAll('.reveal:not(.visible)').forEach(el=>scrollRevealCheck(el))},{passive:true});
  });
}
function scrollRevealCheck(el){
  const r=el.getBoundingClientRect();if(r.top<innerHeight*0.85&&r.bottom>0)el.classList.add('visible');
}

// Halftone
function drawHT(id,seed){
  const cv=document.getElementById(id);if(!cv)return;
  const ct=cv.parentElement,rc=ct.getBoundingClientRect();
  cv.width=rc.width||500;cv.height=rc.height||375;
  const x=cv.getContext('2d'),w=cv.width,h=cv.height;
  x.fillStyle='#b5b0a8';x.fillRect(0,0,w,h);
  const sp=6,cx=w*0.5,cy=h*0.38;
  for(let yy=0;yy<h;yy+=sp)for(let xx=0;xx<w;xx+=sp){
    const hx=(xx-cx)/(w*0.22),hy=(yy-cy*1.1)/(h*0.32),ih=hx*hx+hy*hy<1;
    const sy=(yy-h*0.68)/(h*0.18),sx=(xx-cx)/(w*0.4),ib=yy>h*0.55&&sx*sx+sy*sy<1;
    let v=0;
    if(ih){v=0.35+0.45*(1-(hx*hx+hy*hy));v+=Math.sin(xx*0.08+seed*40)*Math.cos(yy*0.08)*0.12}
    else if(ib)v=0.2+0.25*(1-Math.abs(sx));
    if(v>0.06){x.fillStyle=`rgba(40,40,40,${Math.min(v+0.15,0.85)})`;x.beginPath();x.arc(xx,yy,2.5*Math.min(v,1),0,Math.PI*2);x.fill()}
  }
  x.strokeStyle='rgba(170,165,158,0.18)';x.lineWidth=0.5;
  for(let y=0;y<h;y+=2){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}
}

// Generative art
function drawProjArt(id,idx){
  const cv=document.getElementById(id);if(!cv)return;
  const x=cv.getContext('2d'),w=cv.width,h=cv.height;
  const pals=[['#c65d3a','#d4826a','#a84e30','#1a1a1a','#d8d4cc'],['#2d3436','#636e72','#b2bec3','#c65d3a','#dfe6e9'],['#00b894','#00cec9','#0984e3','#1a1a1a','#dfe6e9'],['#6c5ce7','#a29bfe','#fd79a8','#1a1a1a','#f5f5f5'],['#e17055','#fdcb6e','#00b894','#2d3436','#dfe6e9'],['#e84393','#fd79a8','#6c5ce7','#1a1a1a','#f5f5f5'],['#fdcb6e','#e17055','#d63031','#2d3436','#f5f5f5'],['#c65d3a','#2d3436','#636e72','#d4826a','#dfe6e9']];
  const pl=pals[idx%pals.length];x.fillStyle=pl[4];x.fillRect(0,0,w,h);
  const sd=idx*137,co=10,ro=6,cw=w/co,ch=h/ro;
  for(let r=0;r<ro;r++)for(let c=0;c<co;c++){const px=c*cw,py=r*ch,pr=Math.sin(sd+c*7+r*13)*0.5+0.5;
    if(pr>0.35){x.fillStyle=pl[Math.floor(pr*4)%4];x.globalAlpha=0.12+pr*0.45;
    if(pr>0.72){x.beginPath();x.arc(px+cw/2,py+ch/2,Math.min(cw,ch)/2.8,0,Math.PI*2);x.fill()}
    else x.fillRect(px+3,py+3,(cw-6)*pr+cw*0.25,ch-6)}}
  x.globalAlpha=1;x.fillStyle=pl[3];x.font='bold 22px Inter,sans-serif';x.fillText(P[idx]?.t||'',24,h-32);
  x.strokeStyle='rgba(0,0,0,0.04)';x.lineWidth=0.5;
  for(let xx=0;xx<w;xx+=cw){x.beginPath();x.moveTo(xx,0);x.lineTo(xx,h);x.stroke()}
  for(let yy=0;yy<h;yy+=ch){x.beginPath();x.moveTo(0,yy);x.lineTo(w,yy);x.stroke()}
}

window.addEventListener('resize',()=>{const s=$('#spiral');if(s){s.innerHTML='';buildSpiral()}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
