/* ═══════════════════════════════════════════
   App.js — Portfolio Window Manager
   ═══════════════════════════════════════════ */
(function(){
'use strict';

const PROJECTS = [
  { id:'adversarial-sae', title:'Adversarial SAE Research', sub:'Lead Author, 2026', cat:'Research', year:'2026', type:'Research Paper', tech:'Python, PyTorch, Transformers', github:'https://github.com/Solus-QE/GaslightingAI',
    desc:'Lead-authored research paper on adversarial reasoning using sparse autoencoder (SAE) architectures. Explores how SAEs detect and interpret adversarial behaviors in LLMs.',
    detail:'Builds on mechanistic interpretability techniques using JumpReLU SAE training to extract interpretable features from model activations.' },
  { id:'latent-space', title:'Latent Space Reasoning', sub:'Co-Author, NEMI Workshop', cat:'Research', year:'2026', type:'Research Paper', tech:'Python, PyTorch, NumPy', github:'https://github.com/Solus-QE/eval',
    desc:'Co-authored paper at NEMI National Workshop exploring latent space reasoning in neural networks and abstract concept representation.',
    detail:'Examines the geometric structure of latent spaces and how they encode reasoning capabilities.' },
  { id:'eval-cards', title:'EvalEval — Eval Cards', sub:'EvalEval Coalition', cat:'Open Source', year:'2026', type:'Open Source', tech:'JavaScript, React, Python', github:'https://github.com/Solus-QE/eval',
    desc:'Frontend interface for standardized evaluation cards for machine learning models at the EvalEval Coalition.',
    detail:'Contributing to frontend development and underlying ML research for upcoming technical publications.' },
  { id:'codey', title:'Codey', sub:'AI Agent, 2026', cat:'AI/ML', year:'2026', type:'AI Agent', tech:'Python, LLM APIs', github:'https://github.com/Solus-QE/codey',
    desc:'AI-powered coding agent leveraging large language models for intelligent code generation and development assistance.',
    detail:'Built with a focus on autonomous operation, incorporating advanced prompt engineering and agent orchestration.' },
  { id:'aerodynamics', title:'Aerodynamics Graphics', sub:'C Programming, 2026', cat:'Engineering', year:'2026', type:'Simulation', tech:'C, OpenGL', github:'https://github.com/Solus-QE/aerodynamics_graphics',
    desc:'Low-level aerodynamics simulation and graphics visualization engine written in C.',
    detail:'Combines computational physics with real-time rendering without high-level frameworks.' },
  { id:'aperture', title:'Aperture', sub:'GDScript Game, 2025', cat:'Game Dev', year:'2025', type:'Game', tech:'GDScript, Godot Engine', github:'https://github.com/Solus-QE/Aperture',
    desc:'Game developed using Godot Engine showcasing interactive mechanics and creative visual storytelling.',
    detail:'Built from scratch demonstrating game architecture, physics, and interaction design.' },
  { id:'crypto-fraud', title:'CryptoFraudDetector', sub:'ML Security, 2025', cat:'AI/ML', year:'2025', type:'ML Pipeline', tech:'Python, scikit-learn, Pandas', github:'https://github.com/Solus-QE/CryptoFraudDetector',
    desc:'ML system for detecting fraudulent cryptocurrency transactions using pattern recognition and anomaly detection.',
    detail:'Implements supervised classification and unsupervised anomaly detection for robust fraud detection.' },
  { id:'gaslighting-ai', title:'GaslightingAI', sub:'Adversarial Research, 2025', cat:'Research', year:'2025', type:'Research', tech:'Python, Jupyter, PyTorch', github:'https://github.com/Solus-QE/GaslightingAI',
    desc:'Research exploring adversarial manipulation of AI systems through carefully crafted inputs.',
    detail:'Examines robustness of language models against subtle deception and manipulation techniques.' }
];

const SECTIONS = ['about','projects','experience','contact'];
const SECTION_LABELS = { about:'About', projects:'Projects', experience:'Experience', contact:'Contacts' };
const WIN_IDS = { about:'winAbout', projects:'winProjects', experience:'winExperience', contact:'winContact' };

let activeSection = 'about';
let sectionHistory = ['about'];
let zBase = 20;
let menuOpen = false;

const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function init() {
  buildSpiral();
  buildSidebar();
  buildProjectRows();
  buildMenuCards();
  buildSkillsGrid();
  bindNav();
  bindMenu();
  bindClicks();
  drawHalftone('htCanvas1', 0);
  drawHalftone('htCanvas2', 1);
  hidePreloader();
}

// ── Preloader ──
function hidePreloader() {
  setTimeout(() => {
    const p = $('#preloader');
    if (p) { p.classList.add('hidden'); setTimeout(() => p.remove(), 900); }
  }, 1200);
}

// ── Spiral dots ──
function buildSpiral() {
  const el = $('#spiral');
  if (!el) return;
  const n = Math.ceil(window.innerHeight / 26);
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'spiral-dot';
    el.appendChild(d);
  }
}

// ── Sidebar thumbnails ──
function buildSidebar() {
  const el = $('#sidebar');
  if (!el) return;
  const colors = { about:'#8a8580', projects:'#8a8580', experience:'#c97860', contact:'#8a8580' };

  SECTIONS.forEach((sec, i) => {
    const card = document.createElement('div');
    card.className = 'sidebar-card' + (sec === activeSection ? ' active' : '');
    card.dataset.nav = sec;
    card.innerHTML = `
      <div class="sidebar-card-img"><canvas data-sidebar-canvas="${sec}"></canvas></div>
      <div class="sidebar-card-label">${SECTION_LABELS[sec]}</div>
    `;
    card.addEventListener('click', () => goTo(sec));
    el.appendChild(card);

    if (i < SECTIONS.length - 1) {
      const sep = document.createElement('div');
      sep.className = 'sidebar-sep';
      sep.innerHTML = '<div class="sidebar-sep-line"><span></span><span></span><span></span></div>';
      el.appendChild(sep);
    }
  });

  // Draw mini-thumbnails
  requestAnimationFrame(() => {
    SECTIONS.forEach(sec => {
      const c = document.querySelector(`[data-sidebar-canvas="${sec}"]`);
      if (c) drawMiniThumb(c, sec);
    });
  });
}

function drawMiniThumb(canvas, section) {
  const w = 88, h = 117;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const bg = { about:'#8a8580', projects:'#8a8580', experience:'#c97860', contact:'#8a8580' };
  ctx.fillStyle = bg[section] || '#8a8580';
  ctx.fillRect(0, 0, w, h);

  // Mini content lines
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let y = 8; y < h - 15; y += 7) {
    const lw = 20 + Math.random() * 40;
    ctx.fillRect(6, y, lw, 3);
  }

  if (section === 'experience') {
    // Copper blocks
    ctx.fillStyle = 'rgba(168,78,48,0.3)';
    for (let y = 5; y < h-10; y += 8) {
      for (let x = 5; x < w-5; x += 12) {
        if (Math.random() > 0.3) ctx.fillRect(x, y, 10, 5);
      }
    }
  }
}

// ── Build project rows ──
function buildProjectRows() {
  const aboutList = $('#aboutList');
  const featuredList = $('#featuredList');
  const fullList = $('#projectsFull');

  PROJECTS.forEach((p, i) => {
    const row = makeProjectRow(p, i);
    
    if (aboutList && i < 6) {
      const r2 = makeProjectRow(p, i);
      r2.classList.add('anim-fade-up');
      aboutList.appendChild(r2);
    }
    if (featuredList && i < 5) {
      const r3 = makeProjectRow(p, i);
      r3.querySelector('.proj-num').style.color = 'var(--accent-copper)';
      featuredList.appendChild(r3);
    }
    if (fullList) {
      row.classList.add('anim-fade-up');
      fullList.appendChild(row);
    }
  });
}

function makeProjectRow(p, i) {
  const div = document.createElement('div');
  div.className = 'proj-row';
  div.dataset.projIdx = i;
  div.innerHTML = `
    <div class="proj-num">${i + 1}</div>
    <div class="proj-info">
      <div class="proj-name">${p.title}</div>
      <div class="proj-sub">${p.sub}</div>
    </div>
    <span class="proj-tag">${p.cat}</span>
  `;
  return div;
}

// ── Build menu cards ──
function buildMenuCards() {
  const grid = $('#menuGrid');
  if (!grid) return;
  SECTIONS.forEach((sec, i) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.dataset.nav = sec;
    card.innerHTML = `
      <div class="menu-card-head">
        <span class="menu-card-num">${i + 1}</span>
        <span class="menu-card-label">${SECTION_LABELS[sec]}</span>
      </div>
      <div class="menu-card-preview"><canvas data-menu-canvas="${sec}"></canvas></div>
    `;
    card.addEventListener('click', () => { closeMenu(); goTo(sec); });
    grid.appendChild(card);
  });

  // Draw menu previews
  requestAnimationFrame(() => {
    SECTIONS.forEach(sec => {
      const c = document.querySelector(`[data-menu-canvas="${sec}"]`);
      if (c) drawMenuPreview(c, sec);
    });
  });
}

function drawMenuPreview(canvas, section) {
  const w = 240, h = 320;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const bg = { about:'#8a8580', projects:'#8a8580', experience:'#c97860', contact:'#d8d4cc' };
  ctx.fillStyle = bg[section] || '#8a8580';
  ctx.fillRect(0, 0, w, h);

  // Titlebar
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(0, 0, w, 16);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.arc(8, 8, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(18, 8, 3, 0, Math.PI*2); ctx.fill();

  // Content lines
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 24; y < h - 20; y += 10) {
    ctx.fillRect(12, y, 30 + Math.random() * (w - 60), 4);
  }

  if (section === 'about') {
    // Split layout
    ctx.fillStyle = 'rgba(200,196,188,0.4)';
    ctx.fillRect(w * 0.55, 16, w * 0.45, h * 0.5);
    // Halftone area
    ctx.fillStyle = 'rgba(100,100,100,0.2)';
    ctx.fillRect(w * 0.55, h * 0.2, w * 0.4, h * 0.3);
    // Copper quote card
    ctx.fillStyle = 'rgba(198,93,58,0.5)';
    ctx.fillRect(0, h * 0.65, w * 0.5, h * 0.35);
  }

  if (section === 'experience') {
    // Copper blocks grid
    ctx.fillStyle = 'rgba(168,78,48,0.35)';
    for (let y = 20; y < h-10; y += 12) {
      for (let x = 8; x < w-8; x += 18) {
        if (Math.random() > 0.25) ctx.fillRect(x, y, 14, 7);
      }
    }
  }

  if (section === 'contact') {
    // Halftone dots
    ctx.fillStyle = 'rgba(80,80,80,0.3)';
    for (let y = h*0.3; y < h*0.75; y += 6) {
      for (let x = w*0.2; x < w*0.8; x += 6) {
        const d = Math.sqrt((x-w/2)**2 + (y-h/2)**2);
        const r = Math.max(0, 2.5 - d*0.015);
        if (r > 0.5) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill(); }
      }
    }
    // Big name
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(12, h-40, w-24, 8);
    ctx.fillRect(40, h-28, w-80, 6);
  }
}

// ── Skills grid ──
function buildSkillsGrid() {
  const grid = $('#skillsGrid');
  if (!grid) return;
  const skills = ['Python & ML', 'Systems Programming', 'Web Development', 'Game Development', 'Research & Writing', 'Aviation'];
  skills.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'author-card';
    card.innerHTML = `<canvas data-skill="${i}"></canvas>`;
    grid.appendChild(card);
  });
  requestAnimationFrame(() => {
    grid.querySelectorAll('canvas').forEach((c, i) => drawSkillCard(c, i, skills[i]));
  });
}

function drawSkillCard(canvas, idx, label) {
  const w = 200, h = 267;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const colors = ['#cd6633','#8a8580','#2d3436','#6c5ce7','#00b894','#0984e3'];
  ctx.fillStyle = colors[idx % colors.length];
  ctx.fillRect(0, 0, w, h);

  // Abstract pattern
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 12; i++) {
    const x = (Math.sin(idx * 3 + i * 2.1) * 0.5 + 0.5) * w;
    const y = (Math.cos(idx * 5 + i * 1.7) * 0.5 + 0.5) * h;
    const r = 15 + Math.sin(i) * 10;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.fillText(label, 12, h - 16);
}

// ── Navigation ──
function bindNav() {
  $$('[data-nav]').forEach(el => {
    if (!el.classList.contains('menu-card')) {
      el.addEventListener('click', () => goTo(el.dataset.nav));
    }
  });
  const logo = $('#navLogo');
  if (logo) logo.addEventListener('click', () => goTo('about'));
}

function goTo(section) {
  if (section === activeSection) return;

  const allWins = SECTIONS.map(s => document.getElementById(WIN_IDS[s]));
  const targetIdx = SECTIONS.indexOf(section);

  // Set all windows to proper stacking state
  SECTIONS.forEach((s, i) => {
    const win = document.getElementById(WIN_IDS[s]);
    if (!win) return;

    if (s === section) {
      zBase += 1;
      win.style.zIndex = zBase;
      win.dataset.state = 'active';
    } else {
      // Calculate how far behind
      const diff = targetIdx - i;
      if (sectionHistory.includes(s)) {
        if (diff === 1 || diff === -1) win.dataset.state = 'behind-1';
        else if (Math.abs(diff) === 2) win.dataset.state = 'behind-2';
        else win.dataset.state = 'behind-3';
      } else {
        win.dataset.state = 'hidden';
      }
    }
  });

  if (!sectionHistory.includes(section)) sectionHistory.push(section);
  activeSection = section;

  // Update nav
  $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.nav === section));
  $$('.sidebar-card').forEach(c => c.classList.toggle('active', c.dataset.nav === section));

  // Init canvases for contact
  if (section === 'contact') {
    setTimeout(() => drawHalftone('htCanvas2', 1), 300);
  }
}

// ── Menu ──
function bindMenu() {
  $('#menuBtn')?.addEventListener('click', openMenu);
  $('#menuClose')?.addEventListener('click', closeMenu);
}

function openMenu() {
  menuOpen = true;
  $('#menu')?.classList.add('open');
}

function closeMenu() {
  menuOpen = false;
  $('#menu')?.classList.remove('open');
}

// ── Project clicks ──
function bindClicks() {
  document.addEventListener('click', e => {
    const row = e.target.closest('.proj-row[data-proj-idx]');
    if (row) {
      const idx = parseInt(row.dataset.projIdx);
      if (!isNaN(idx) && PROJECTS[idx]) openDetail(PROJECTS[idx], idx);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (menuOpen) { closeMenu(); return; }
      const det = document.querySelector('.win[data-win^="detail"][data-state="active"]');
      if (det) { det.dataset.state = 'hidden'; setTimeout(() => det.remove(), 700); }
    }
  });
}

function openDetail(proj, idx) {
  // Remove existing detail
  $$('.win[data-win^="detail"]').forEach(w => { w.dataset.state = 'hidden'; setTimeout(() => w.remove(), 700); });

  const win = document.createElement('section');
  win.className = 'win';
  win.dataset.win = 'detail-' + idx;
  win.dataset.state = 'hidden';
  zBase += 1;
  win.style.zIndex = zBase;

  win.innerHTML = `
    <div class="win-bar">
      <div class="win-bar-dots"><div class="win-bar-dot"></div><div class="win-bar-dot"></div></div>
      <span class="win-bar-title">Project</span>
      <div class="win-bar-close" data-close-detail>
        <span>Close</span> <span style="font-size:1.1em;line-height:1">&times;</span>
      </div>
    </div>
    <div class="win-body" style="position:relative">
      <div class="detail-head">
        <h2 class="detail-title">${proj.title}</h2>
        <span class="detail-tag">${proj.cat}</span>
      </div>
      <div class="detail-img"><canvas id="detailC${idx}" width="800" height="450"></canvas></div>
      <div class="detail-subtitle">(${proj.year})</div>
      <div class="detail-quote">${proj.desc.split('.')[0]}.</div>
      <div class="detail-body">
        <p>${proj.desc}</p>
        <p>${proj.detail}</p>
      </div>
      <div class="detail-meta">
        <div class="detail-meta-item"><span class="detail-meta-label">Category</span><span class="detail-meta-val">${proj.cat}</span></div>
        <div class="detail-meta-item"><span class="detail-meta-label">Year</span><span class="detail-meta-val">${proj.year}</span></div>
        <div class="detail-meta-item"><span class="detail-meta-label">Type</span><span class="detail-meta-val">${proj.type}</span></div>
      </div>
      <div class="detail-body">
        <div><span class="detail-meta-label" style="display:block;margin-bottom:6px">Tech Stack</span><span style="font-size:var(--fs-sm);color:var(--text-dark)">${proj.tech}</span></div>
        <a href="${proj.github}" target="_blank" class="gh-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          View on GitHub
        </a>
      </div>
    </div>
  `;

  $('#stage').appendChild(win);
  requestAnimationFrame(() => requestAnimationFrame(() => { win.dataset.state = 'active'; }));

  win.querySelector('[data-close-detail]').addEventListener('click', () => {
    win.dataset.state = 'hidden';
    setTimeout(() => win.remove(), 700);
  });

  setTimeout(() => drawProjectArt('detailC' + idx, idx), 150);
}

// ── Halftone canvas ──
function drawHalftone(id, seed) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width || 500;
  canvas.height = rect.height || 375;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  ctx.fillStyle = '#b5b0a8';
  ctx.fillRect(0, 0, w, h);

  const sp = 6, cx = w * 0.5, cy = h * 0.38;

  for (let y = 0; y < h; y += sp) {
    for (let x = 0; x < w; x += sp) {
      const hx = (x - cx) / (w * 0.22), hy = (y - cy * 1.1) / (h * 0.32);
      const inHead = hx*hx + hy*hy < 1;
      const sy = (y - h*0.68) / (h*0.18), sx = (x - cx) / (w*0.4);
      const inBody = y > h*0.55 && sx*sx + sy*sy < 1;
      let intensity = 0;
      if (inHead) {
        intensity = 0.35 + 0.45 * (1 - (hx*hx+hy*hy));
        intensity += Math.sin(x*0.08+seed*40)*Math.cos(y*0.08)*0.12;
      } else if (inBody) {
        intensity = 0.2 + 0.25 * (1 - Math.abs(sx));
      }
      if (intensity > 0.06) {
        const r = 2.5 * Math.min(intensity, 1);
        ctx.fillStyle = `rgba(40,40,40,${Math.min(intensity+0.15,0.85)})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      }
    }
  }

  ctx.strokeStyle = 'rgba(170,165,158,0.2)';
  ctx.lineWidth = 0.5;
  for (let y = 0; y < h; y += 2) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
}

// ── Project generative art ──
function drawProjectArt(id, idx) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const palettes = [
    ['#c65d3a','#d4826a','#a84e30','#1a1a1a','#d8d4cc'],
    ['#2d3436','#636e72','#b2bec3','#c65d3a','#dfe6e9'],
    ['#00b894','#00cec9','#0984e3','#1a1a1a','#dfe6e9'],
    ['#6c5ce7','#a29bfe','#fd79a8','#1a1a1a','#f5f5f5'],
    ['#e17055','#fdcb6e','#00b894','#2d3436','#dfe6e9'],
    ['#e84393','#fd79a8','#6c5ce7','#1a1a1a','#f5f5f5'],
    ['#fdcb6e','#e17055','#d63031','#2d3436','#f5f5f5'],
    ['#c65d3a','#2d3436','#636e72','#d4826a','#dfe6e9']
  ];
  const pal = palettes[idx % palettes.length];
  ctx.fillStyle = pal[4]; ctx.fillRect(0, 0, w, h);

  const seed = idx * 137, cols = 10, rows = 6;
  const cw = w/cols, ch = h/rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c*cw, y = r*ch;
      const pr = Math.sin(seed + c*7 + r*13)*0.5+0.5;
      if (pr > 0.35) {
        ctx.fillStyle = pal[Math.floor(pr*4)%4];
        ctx.globalAlpha = 0.12 + pr*0.45;
        if (pr > 0.72) { ctx.beginPath(); ctx.arc(x+cw/2, y+ch/2, Math.min(cw,ch)/2.8, 0, Math.PI*2); ctx.fill(); }
        else { ctx.fillRect(x+3, y+3, (cw-6)*pr+cw*0.25, ch-6); }
      }
    }
  }

  ctx.globalAlpha = 1;
  ctx.fillStyle = pal[3]; ctx.font = 'bold 22px Inter,sans-serif';
  ctx.fillText(PROJECTS[idx]?.title || '', 24, h-32);

  ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth = 0.5;
  for (let x = 0; x < w; x += cw) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y = 0; y < h; y += ch) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
}

// ── Resize ──
window.addEventListener('resize', () => {
  const sp = $('#spiral');
  if (sp) { sp.innerHTML = ''; buildSpiral(); }
});

// ── Start ──
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
