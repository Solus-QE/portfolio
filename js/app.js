/* ═══════════════════════════════════════════
   App.js — Main Application Logic
   Portfolio Window Manager & Interactions
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Project Data ──
  const PROJECTS = [
    {
      id: 'adversarial-sae',
      title: 'Adversarial SAE Research',
      subtitle: 'Adversarial reasoning using sparse autoencoder architectures',
      category: 'Research',
      year: '2026',
      meta: 'Lead Author, 2026',
      description: 'Lead-authored research paper on adversarial reasoning using sparse autoencoder (SAE) architectures. This work explores how SAEs can be leveraged to detect and interpret adversarial behaviors in large language models, providing mechanistic insights into model vulnerabilities.',
      details: 'The research builds on mechanistic interpretability techniques, using JumpReLU SAE training to extract interpretable features from model activations. The pipeline includes dataset construction, activation extraction, feature engineering, detector training, and intervention demonstrations.',
      tech: 'Python, PyTorch, Transformers',
      type: 'Research Paper',
      github: 'https://github.com/Solus-QE/GaslightingAI'
    },
    {
      id: 'latent-space',
      title: 'Latent Space Reasoning',
      subtitle: 'Co-authored paper on latent space reasoning at NEMI Workshop',
      category: 'Research',
      year: '2026',
      meta: 'Co-Author, NEMI Workshop',
      description: 'Co-authored a research paper presented at the NEMI National Workshop exploring latent space reasoning in neural networks. The work investigates how models represent and manipulate abstract concepts within their internal representations.',
      details: 'This research contributes to the broader field of mechanistic interpretability by examining the geometric structure of latent spaces and how they encode reasoning capabilities.',
      tech: 'Python, PyTorch, NumPy',
      type: 'Research Paper',
      github: 'https://github.com/Solus-QE/eval'
    },
    {
      id: 'eval-cards',
      title: 'EvalEval — Eval Cards',
      subtitle: 'Open-source frontend for the EvalEval Coalition evaluation framework',
      category: 'Open Source',
      year: '2026',
      meta: 'EvalEval Coalition',
      description: 'Developing the frontend interface for the Eval Cards project at the EvalEval Coalition. This open-source tool provides standardized evaluation cards for machine learning models, making it easier to assess and compare model capabilities.',
      details: 'Contributing to both the frontend development and underlying ML research for upcoming technical publications through the coalition.',
      tech: 'JavaScript, React, Python',
      type: 'Open Source',
      github: 'https://github.com/Solus-QE/eval'
    },
    {
      id: 'codey',
      title: 'Codey',
      subtitle: 'AI-powered coding agent and development assistant',
      category: 'AI/ML',
      year: '2026',
      meta: 'AI Agent, 2026',
      description: 'An AI-powered coding agent designed to assist with software development tasks. Codey leverages large language models to understand code context, generate solutions, and automate repetitive programming tasks.',
      details: 'Built with a focus on autonomous operation and intelligent tool use, incorporating advanced prompt engineering and agent orchestration patterns.',
      tech: 'Python, LLM APIs',
      type: 'AI Agent',
      github: 'https://github.com/Solus-QE/codey'
    },
    {
      id: 'aerodynamics',
      title: 'Aerodynamics Graphics',
      subtitle: 'Aerodynamic simulation and visualization engine in C',
      category: 'Engineering',
      year: '2026',
      meta: 'C Programming, 2026',
      description: 'A low-level aerodynamics simulation and graphics visualization engine written in C. This project combines computational physics with real-time rendering to visualize aerodynamic phenomena.',
      details: 'Demonstrates proficiency in systems programming, computational physics, and graphics programming without relying on high-level frameworks.',
      tech: 'C, OpenGL',
      type: 'Simulation',
      github: 'https://github.com/Solus-QE/aerodynamics_graphics'
    },
    {
      id: 'aperture',
      title: 'Aperture',
      subtitle: 'A game built with Godot Engine using GDScript',
      category: 'Game Dev',
      year: '2025',
      meta: 'GDScript Game, 2025',
      description: 'A game developed using the Godot Engine with GDScript. Aperture showcases game design principles, interactive mechanics, and creative visual storytelling through an interactive medium.',
      details: 'Built from scratch using the Godot game engine, demonstrating skills in game architecture, physics, and user interaction design.',
      tech: 'GDScript, Godot Engine',
      type: 'Game',
      github: 'https://github.com/Solus-QE/Aperture'
    },
    {
      id: 'crypto-fraud',
      title: 'CryptoFraudDetector',
      subtitle: 'Machine learning pipeline for detecting cryptocurrency fraud',
      category: 'AI/ML',
      year: '2025',
      meta: 'ML Security, 2025',
      description: 'A machine learning system designed to detect fraudulent activity in cryptocurrency transactions. Uses pattern recognition and anomaly detection to identify suspicious behaviors in blockchain data.',
      details: 'Implements multiple ML approaches including supervised classification and unsupervised anomaly detection to provide robust fraud detection capabilities.',
      tech: 'Python, scikit-learn, Pandas',
      type: 'ML Pipeline',
      github: 'https://github.com/Solus-QE/CryptoFraudDetector'
    },
    {
      id: 'gaslighting-ai',
      title: 'GaslightingAI',
      subtitle: 'Research into adversarial manipulation of AI systems',
      category: 'Research',
      year: '2025',
      meta: 'Adversarial Research, 2025',
      description: 'Research project exploring how AI systems can be adversarially manipulated through carefully crafted inputs. This work examines the robustness of language models against subtle forms of deception and manipulation.',
      details: 'Uses Jupyter Notebooks for experimental analysis and documentation, providing reproducible results and clear methodology for adversarial AI research.',
      tech: 'Python, Jupyter, PyTorch',
      type: 'Research',
      github: 'https://github.com/Solus-QE/GaslightingAI'
    }
  ];

  // ── State ──
  let activeWindow = 'about';
  let windowStack = ['about'];
  let zCounter = 20;
  let menuOpen = false;

  // ── DOM References ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── Initialize ──
  function init() {
    generateSpiralDots();
    generateSidebarThumbs();
    renderProjectsList();
    bindNavigation();
    bindMenuOverlay();
    bindProjectClicks();
    bindWindowClicks();
    initHalftone();
    hideLoadingScreen();
  }

  // ── Loading Screen ──
  function hideLoadingScreen() {
    setTimeout(() => {
      const ls = $('#loadingScreen');
      if (ls) {
        ls.classList.add('hidden');
        setTimeout(() => ls.remove(), 800);
      }
    }, 800);
  }

  // ── Spiral Dots (Right Sidebar) ──
  function generateSpiralDots() {
    const sidebar = $('#sidebarRight');
    if (!sidebar) return;
    const count = Math.ceil(window.innerHeight / 28);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.className = 'spiral-dot';
      sidebar.appendChild(dot);
    }
  }

  // ── Sidebar Thumbnails (Left Sidebar) ──
  function generateSidebarThumbs() {
    const sidebar = $('#sidebarLeft');
    if (!sidebar) return;

    const sections = [
      { id: 'about', label: 'About', color: '#d4d0cb' },
      { id: 'projects', label: 'Projects', color: '#d4d0cb' },
      { id: 'experience', label: 'Experience', color: '#e17e66' },
      { id: 'contact', label: 'Contact', color: '#d4d0cb' }
    ];

    sections.forEach((section, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `sidebar-thumb ${section.id === activeWindow ? 'active' : ''}`;
      thumb.dataset.section = section.id;
      thumb.style.background = section.color;

      thumb.innerHTML = `
        <div class="sidebar-thumb-content">
          <div class="sidebar-thumb-line"></div>
          <div class="sidebar-thumb-line short"></div>
          <div class="sidebar-thumb-line medium"></div>
          <div class="sidebar-thumb-line"></div>
          <div class="sidebar-thumb-line short"></div>
        </div>
        <div class="sidebar-thumb-label">${section.label}</div>
      `;

      thumb.addEventListener('click', () => openSection(section.id));
      sidebar.appendChild(thumb);

      if (idx < sections.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'sidebar-divider';
        sidebar.appendChild(divider);
      }
    });
  }

  // ── Render Projects List ──
  function renderProjectsList() {
    const list = $('#projectsList');
    if (!list) return;

    PROJECTS.forEach((project, idx) => {
      const item = document.createElement('div');
      item.className = 'project-item animate-in';
      item.dataset.project = String(idx);
      item.innerHTML = `
        <div class="project-number">${idx + 1}</div>
        <div class="project-info">
          <div class="project-title">${project.title}</div>
          <div class="project-meta">${project.meta}</div>
        </div>
        <span class="project-tag">${project.category}</span>
      `;
      list.appendChild(item);
    });
  }

  // ── Navigation ──
  function bindNavigation() {
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const section = link.dataset.section;
        if (section) openSection(section);
      });
    });

    const logo = $('#navLogo');
    if (logo) {
      logo.addEventListener('click', () => openSection('about'));
    }
  }

  // ── Menu Overlay ──
  function bindMenuOverlay() {
    const menuBtn = $('#navMenuBtn');
    const menuOverlay = $('#menuOverlay');
    const menuClose = $('#menuClose');

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        menuOpen = true;
        menuOverlay.classList.add('open');
      });
    }

    if (menuClose) {
      menuClose.addEventListener('click', () => {
        menuOpen = false;
        menuOverlay.classList.remove('open');
      });
    }

    $$('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        menuOpen = false;
        menuOverlay.classList.remove('open');
        if (section) openSection(section);
      });
    });
  }

  // ── Project Click Handlers ──
  function bindProjectClicks() {
    document.addEventListener('click', (e) => {
      const projectItem = e.target.closest('.project-item[data-project]');
      if (projectItem) {
        const idx = parseInt(projectItem.dataset.project);
        if (!isNaN(idx) && PROJECTS[idx]) {
          openProjectDetail(PROJECTS[idx], idx);
        }
      }

      const openSection2 = e.target.closest('[data-open]');
      if (openSection2) {
        const section = openSection2.dataset.open;
        if (section) openSection(section);
      }
    });
  }

  // ── Window Click (bring to front) ──
  function bindWindowClicks() {
    $$('.window').forEach(win => {
      win.addEventListener('mousedown', () => {
        bringToFront(win);
      });
    });
  }

  // ── Open a Section ──
  function openSection(sectionId) {
    const windowEl = $(`#window${capitalize(sectionId)}`);
    if (!windowEl) return;

    // Close existing project detail windows
    $$('.window[data-window^="project-detail"]').forEach(w => {
      w.classList.remove('visible', 'stacked');
      setTimeout(() => w.remove(), 600);
    });

    // Push current behind
    $$('.window.visible').forEach(w => {
      if (w.dataset.window !== sectionId) {
        w.classList.add('behind');
        w.classList.remove('visible');
      }
    });

    // Show target
    zCounter++;
    windowEl.style.zIndex = zCounter;
    windowEl.classList.remove('behind');
    windowEl.classList.add('visible');

    // Update active state
    activeWindow = sectionId;
    updateNavActive(sectionId);
    updateSidebarActive(sectionId);
    windowStack.push(sectionId);

    // Init halftone for contact if needed
    if (sectionId === 'contact') {
      setTimeout(() => initHalftone2(), 300);
    }
  }

  // ── Open Project Detail ──
  function openProjectDetail(project, idx) {
    // Remove existing detail windows
    $$('.window[data-window^="project-detail"]').forEach(w => {
      w.classList.remove('visible', 'stacked');
      setTimeout(() => w.remove(), 600);
    });

    const detailWindow = document.createElement('div');
    detailWindow.className = 'window';
    detailWindow.dataset.window = `project-detail-${idx}`;
    
    zCounter++;
    detailWindow.style.zIndex = zCounter;

    detailWindow.innerHTML = `
      <div class="window-titlebar">
        <div class="window-titlebar-left">
          <div class="window-dot"></div>
          <div class="window-dot"></div>
          <span class="window-title">Project</span>
        </div>
        <div class="window-titlebar-right">
          <button class="window-close" data-close-detail>
            <span>Close</span>
            <span class="window-close-x">&times;</span>
          </button>
        </div>
      </div>
      <div class="window-content">
        <div class="project-detail-header">
          <h2 class="project-detail-title">${project.title}</h2>
          <p class="project-detail-subtitle">${project.subtitle}</p>
        </div>

        <div class="project-detail-image">
          <canvas id="detailCanvas${idx}" width="800" height="450"></canvas>
        </div>

        <div class="project-detail-meta">
          <div class="project-detail-meta-item">
            <span class="project-detail-meta-label">Category</span>
            <span class="project-detail-meta-value">${project.category}</span>
          </div>
          <div class="project-detail-meta-item">
            <span class="project-detail-meta-label">Year</span>
            <span class="project-detail-meta-value">${project.year}</span>
          </div>
          <div class="project-detail-meta-item">
            <span class="project-detail-meta-label">Type</span>
            <span class="project-detail-meta-value">${project.type}</span>
          </div>
        </div>

        <div class="project-detail-body">
          <p>${project.description}</p>
          <p>${project.details}</p>
          <div>
            <span class="project-detail-meta-label" style="display:block; margin-bottom: 8px;">Tech Stack</span>
            <span style="font-size: var(--fs-sm); color: var(--text-dark);">${project.tech}</span>
          </div>
          <a href="${project.github}" target="_blank" class="project-github-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    `;

    const container = $('#windowsContainer');
    container.appendChild(detailWindow);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        detailWindow.classList.add('visible');
      });
    });

    // Bind close button
    detailWindow.querySelector('[data-close-detail]').addEventListener('click', () => {
      detailWindow.classList.remove('visible');
      setTimeout(() => detailWindow.remove(), 600);
    });

    // Draw generative art on the project canvas
    setTimeout(() => {
      drawProjectArt(`detailCanvas${idx}`, idx);
    }, 100);
  }

  // ── Bring Window to Front ──
  function bringToFront(windowEl) {
    zCounter++;
    windowEl.style.zIndex = zCounter;
  }

  // ── Update Active Nav ──
  function updateNavActive(sectionId) {
    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  }

  // ── Update Sidebar Active ──
  function updateSidebarActive(sectionId) {
    $$('.sidebar-thumb').forEach(thumb => {
      thumb.classList.toggle('active', thumb.dataset.section === sectionId);
    });
  }

  // ── Capitalize ──
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── Halftone Canvas Effect ──
  function initHalftone() {
    const canvas = $('#halftoneCanvas');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 375;
    
    drawHalftone(canvas, 0);
  }

  function initHalftone2() {
    const canvas = $('#halftoneCanvas2');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width || 500;
    canvas.height = rect.height || 500;
    
    drawHalftone(canvas, 1);
  }

  function drawHalftone(canvas, seed) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = '#c8c4be';
    ctx.fillRect(0, 0, w, h);

    // Generate abstract portrait-like halftone
    const dotSize = 4;
    const spacing = 8;
    const cols = Math.floor(w / spacing);
    const rows = Math.floor(h / spacing);

    // Create a radial gradient pattern (portrait-esque)
    const cx = w * 0.5;
    const cy = h * 0.4;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + spacing / 2;
        const y = row * spacing + spacing / 2;

        // Distance from center
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Create face-like shape
        const normalizedDist = dist / maxDist;
        
        // Head shape (ellipse)
        const headX = (x - cx) / (w * 0.25);
        const headY = (y - cy * 1.1) / (h * 0.35);
        const inHead = (headX * headX + headY * headY) < 1;
        
        // Shoulders
        const shoulderY = (y - h * 0.7) / (h * 0.2);
        const shoulderX = (x - cx) / (w * 0.45);
        const inShoulders = y > h * 0.55 && (shoulderX * shoulderX + shoulderY * shoulderY) < 1;

        let intensity = 0;
        if (inHead) {
          intensity = 0.3 + 0.5 * (1 - (headX * headX + headY * headY));
          // Add some noise
          intensity += (Math.sin(x * 0.1 + seed * 50) * Math.cos(y * 0.1)) * 0.15;
        } else if (inShoulders) {
          intensity = 0.2 + 0.3 * (1 - Math.abs(shoulderX));
        }

        if (intensity > 0.05) {
          const radius = dotSize * Math.min(intensity, 1);
          ctx.fillStyle = `rgba(50, 50, 50, ${Math.min(intensity + 0.2, 0.9)})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Add some horizontal scan lines
    ctx.strokeStyle = 'rgba(180, 175, 168, 0.3)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 3) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  // ── Draw Project Art (generative) ──
  function drawProjectArt(canvasId, projectIdx) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Color palettes per project type
    const palettes = [
      ['#cd6633', '#e17e66', '#c4877a', '#1a1a1a', '#d4d0cb'], // Research warm
      ['#2d3436', '#636e72', '#b2bec3', '#cd6633', '#dfe6e9'], // Research cool
      ['#00b894', '#00cec9', '#0984e3', '#1a1a1a', '#dfe6e9'], // Open Source
      ['#6c5ce7', '#a29bfe', '#fd79a8', '#1a1a1a', '#f5f5f5'], // AI/ML
      ['#e17055', '#fdcb6e', '#00b894', '#2d3436', '#dfe6e9'], // Engineering
      ['#e84393', '#fd79a8', '#6c5ce7', '#1a1a1a', '#f5f5f5'], // Game Dev
      ['#fdcb6e', '#e17055', '#d63031', '#2d3436', '#f5f5f5'], // AI/ML 2
      ['#cd6633', '#2d3436', '#636e72', '#e17e66', '#dfe6e9'], // Research 2
    ];

    const palette = palettes[projectIdx % palettes.length];

    // Background
    ctx.fillStyle = palette[4];
    ctx.fillRect(0, 0, w, h);

    // Draw generative pattern
    const seed = projectIdx * 137;
    
    // Grid of rectangles (modernist/Swiss design inspired)
    const gridCols = 8;
    const gridRows = 5;
    const cellW = w / gridCols;
    const cellH = h / gridRows;

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const x = col * cellW;
        const y = row * cellH;
        const pseudoRandom = Math.sin(seed + col * 7 + row * 13) * 0.5 + 0.5;

        if (pseudoRandom > 0.4) {
          const colorIdx = Math.floor(pseudoRandom * 4) % 4;
          ctx.fillStyle = palette[colorIdx];
          ctx.globalAlpha = 0.15 + pseudoRandom * 0.5;

          const margin = 4;
          const rw = cellW - margin * 2;
          const rh = cellH - margin * 2;

          if (pseudoRandom > 0.7) {
            // Circle
            ctx.beginPath();
            ctx.arc(x + cellW / 2, y + cellH / 2, Math.min(rw, rh) / 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Rectangle
            ctx.fillRect(x + margin, y + margin, rw * pseudoRandom + rw * 0.3, rh);
          }
        }
      }
    }

    ctx.globalAlpha = 1;

    // Title text
    ctx.fillStyle = palette[3];
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText(PROJECTS[projectIdx]?.title || '', 30, h - 40);

    // Subtle grid overlay
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += cellW) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += cellH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  // ── Handle Resize ──
  window.addEventListener('resize', () => {
    // Regenerate spiral dots
    const sidebar = $('#sidebarRight');
    if (sidebar) {
      sidebar.innerHTML = '';
      generateSpiralDots();
    }
  });

  // ── Keyboard Navigation ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuOpen) {
        menuOpen = false;
        $('#menuOverlay')?.classList.remove('open');
      }
      // Close detail windows
      const detailWindow = document.querySelector('.window[data-window^="project-detail"].visible');
      if (detailWindow) {
        detailWindow.classList.remove('visible');
        setTimeout(() => detailWindow.remove(), 600);
      }
    }
  });

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
