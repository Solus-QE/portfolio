/**
 * Alexander Jameson Portfolio Engine
 * Exact PX PUSH Animation System, Lenis Kinetic Smooth Scroll, Dynamic Difference Cursor Grid & High-Efficiency WebGL Suite
 * Zero AI slop, zero em dashes.
 */

(function() {
  'use strict';

  // Research Papers Data (Rigorous Scientific Publications)
  const RESEARCH_PAPERS = [
    {
      num: 'Nº001',
      id: 'adversarial-sae',
      title: 'Adversarial Reasoning with Sparse Autoencoders',
      role: 'Lead Author (2026)',
      venue: 'Manuscript in Preparation',
      formula: 'min_{W_e, W_d} ||x - W_d f(W_e x)||_2^2 + λ||f(W_e x)||_1',
      desc: 'Investigating adversarial manipulation in large language models using Sparse Autoencoders (SAEs). By decomposing residual stream activations into interpretable sparse feature dictionaries, we identify deceptive reasoning sub-circuits and measure feature steerability under adversarial prompt perturbations.',
      tags: ['Mechanistic Interpretability', 'Sparse Autoencoders', 'Adversarial Robustness', 'PyTorch'],
      github: 'https://github.com/Solus-QE/GaslightingAI',
      bibtex: `@article{jameson2026adversarial,
  title={Adversarial Reasoning in Language Models via Sparse Autoencoder Architectures},
  author={Jameson, Alexander},
  journal={Preprint},
  year={2026}
}`
    },
    {
      num: 'Nº002',
      id: 'latent-geometry',
      title: 'Geometric Structure of Latent Space Reasoning',
      role: 'Co-Author (2026)',
      venue: 'NEMI National Workshop',
      formula: 'd_M(u, v) = arccos((u · v) / (||u||_2 ||v||_2))',
      desc: 'Analyzing manifold geometry and internal representations during complex multi-step reasoning tasks. Exploring how attention routing shifts semantic vector trajectories across intermediate layers in transformer models.',
      tags: ['Latent Manifolds', 'Neural Geometry', 'Representation Learning', 'Transformers'],
      github: 'https://github.com/Solus-QE/eval',
      bibtex: `@inproceedings{jameson2026latent,
  title={Geometric Structure of Latent Space Reasoning in Transformer Models},
  author={Jameson, Alexander and Collaborators},
  booktitle={NEMI National Workshop on Neural Representation},
  year={2026}
}`
    },
    {
      num: 'Nº003',
      id: 'acl-review',
      title: 'Invited Peer Reviewer (EvalEval Workshop)',
      role: 'Invited Reviewer (ACL 2026)',
      venue: 'Association for Computational Linguistics',
      formula: 'Scorecard_E(M) = E_{x ~ D}[ U(M(x), y) ]',
      desc: 'Invited peer reviewer for machine learning research submissions focused on model evaluation methodologies, safety benchmarks, and capability scorecards for the EvalEval workshop at ACL 2026.',
      tags: ['Peer Review', 'Model Evaluation', 'Safety Benchmarks', 'ACL 2026'],
      github: 'https://github.com/Solus-QE/eval',
      bibtex: `@misc{acl2026evaleval,
  title={Invited Reviewer: ACL 2026 Workshop on Model Evaluation},
  author={Jameson, Alexander},
  year={2026}
}`
    }
  ];

  // Engineering Projects for Horizontal Showcase
  const WORKS_PROJECTS = [
    {
      num: '01',
      tag: 'Research',
      title: 'GaslightingAI SAEs',
      stack: 'PyTorch · CUDA · SAEs',
      desc: 'Sparse dictionary pipelines isolating deceptive sub-circuits and measuring feature steerability vectors under adversarial prompts.',
      link: 'https://github.com/Solus-QE/GaslightingAI'
    },
    {
      num: '02',
      tag: 'Open Source',
      title: 'EvalEval Scorecards',
      stack: 'TypeScript · Python · React',
      desc: 'Frontend architecture for standardized AI capability scorecards and safety benchmarking across frontier models.',
      link: 'https://github.com/Solus-QE/eval'
    },
    {
      num: '03',
      tag: 'Systems & Graphics',
      title: 'Aerodynamics in C',
      stack: 'C · OpenGL · GLSL',
      desc: 'Low-level Navier-Stokes fluid dynamics and real-time aerodynamics simulation engine with GPU shaders.',
      link: 'https://github.com/Solus-QE/aerodynamics_graphics'
    },
    {
      num: '04',
      tag: 'Autonomous AI',
      title: 'Codey Agent',
      stack: 'Python · AsyncIO · LLM APIs',
      desc: 'Autonomous coding agent orchestration with tool-calling workflows, sandbox execution, and test verification.',
      link: 'https://github.com/Solus-QE/codey'
    },
    {
      num: '05',
      tag: 'Game Engine',
      title: 'Aperture Engine',
      stack: 'GDScript · Godot Engine',
      desc: 'Custom physics and spatial mechanics prototype built within Godot Engine.',
      link: 'https://github.com/Solus-QE/Aperture'
    },
    {
      num: '06',
      tag: 'Security',
      title: 'CryptoFraudDetector',
      stack: 'Python · Scikit-learn',
      desc: 'Anomaly detection and graph-based feature extraction for blockchain transactions.',
      link: 'https://github.com/Solus-QE/CryptoFraudDetector'
    }
  ];

  // Experience & Leadership
  const EXPERIENCE_ITEMS = [
    {
      num: 'Nº001',
      title: 'Raiders Drum & Bugle Corps',
      role: 'Trumpet Section Leader · 6+ Year Veteran',
      date: '2023 to Present',
      desc: 'Selected for nationally recognized touring drum corps ensemble. Leading trumpet section rehearsals, musical execution, and performance discipline across national performance tours.'
    },
    {
      num: 'Nº002',
      title: 'Aviation Flight Training',
      role: 'FAA Student Pilot Certificate',
      date: '2025 to Present',
      desc: 'Actively logging flight hours and cross-country navigation towards FAA Private Pilot Certificate (expected Summer 2026).'
    },
    {
      num: 'Nº003',
      title: 'ARCSOFT QA Testing',
      role: 'Software QA Tester',
      date: 'January 2026 to Present',
      desc: 'Conducted systematic software testing to identify edge-case defects, validated functional adherence to specifications, and collaborated with engineering teams.'
    },
    {
      num: 'Nº004',
      title: 'Planet Hacks & Campfire',
      role: 'Hackathon Director',
      date: '2025 to Present',
      desc: 'Managing event logistics, corporate sponsorships, and attendee operations for two student-led hackathons.'
    },
    {
      num: 'Nº005',
      title: 'Kemper Sports',
      role: 'Golf Operations Attendant',
      date: 'August 2025 to Present',
      desc: 'Managed facility operations and fleet maintenance, ensuring high appearance standards and smooth guest experience.'
    }
  ];

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  let lenisInstance = null;
  const numColumns = 20;

  function init() {
    // 1. Initialize Lenis Smooth Kinetic Scrolling
    initSmoothScroll();

    // 2. Initialize 20-Column Difference Cursor Grid (Pixel-Perfect)
    initCursorGrid();

    // 3. Initialize Background Wave Canvas
    const bgCanvas = $('#bg-canvas');
    if (bgCanvas && window.BgWaveShader) {
      window.BgWaveShader.init(bgCanvas);
    }

    // 4. Initialize Centerpiece 3D Hero Sculpture
    const heroCanvasBox = $('#hero-3d-sculpture');
    if (heroCanvasBox && window.HeroSculpture) {
      window.HeroSculpture.init(heroCanvasBox);
    }

    // 5. Initialize Chapter 2 SAE Polytope Canvas
    const saeCanvas = $('#sae-canvas');
    if (saeCanvas && window.SAEPolytope3D) {
      window.SAEPolytope3D.init(saeCanvas);
      bindSaeControls();
    }

    // 6. Initialize Chapter 3 3D Aerodynamic Wind Tunnel
    const aeroCanvas = $('#aero-canvas');
    if (aeroCanvas && window.AeroWindTunnel3D) {
      window.AeroWindTunnel3D.init(aeroCanvas);
      bindAeroControls();
    }

    // 7. Initialize Chapter 5 3D Brass Harmonic Canvas
    const brassCanvas = $('#brass-canvas');
    if (brassCanvas && window.BrassHarmonic3D) {
      window.BrassHarmonic3D.init(brassCanvas);
    }

    // 8. Render Dynamic Content
    renderResearchAccordions();
    renderWorksShowcase();
    renderExperienceAccordions();

    // 9. Bind Sculpture Switchers
    bindSculptureControls();

    // 10. Bind Horizontal Works Drag & Skim Cursor
    initWorksShowcaseInteraction();

    // 11. Bind Copy Actions
    bindCopyActions();

    // 12. Handle Window Resize
    window.addEventListener('resize', onWindowResize, { passive: true });
  }

  // 1. Lenis Smooth Scrolling
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    try {
      lenisInstance = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        infinite: false
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      if (typeof ScrollTrigger !== 'undefined') {
        lenisInstance.on('scroll', ScrollTrigger.update);
      }
    } catch(err) {
      console.warn('Lenis initialization fallback:', err);
    }
  }

  // 2. 20-Column Difference Pixel Cursor Grid (Pixel-Matched to Viewport)
  let cursorBoxes = [];
  let boxSize = 0;
  let numRows = 0;

  function buildGridElements() {
    const cursor = $('#cursor-grid');
    if (!cursor) return;

    const inner = cursor.querySelector('.cursor__inner');
    if (!inner) return;

    inner.innerHTML = '';
    boxSize = window.innerWidth / numColumns;
    numRows = Math.ceil(window.innerHeight / boxSize) + 2;
    const totalBoxes = numColumns * numRows;

    for (let i = 0; i < totalBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'cursor__inner-box';
      inner.appendChild(box);
    }

    cursorBoxes = inner.querySelectorAll('.cursor__inner-box');
  }

  function initCursorGrid() {
    buildGridElements();

    let mouseX = -1;
    let mouseY = -1;
    let isScheduled = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(updateCursor);
      }
    }, { passive: true });

    function updateCursor() {
      isScheduled = false;
      if (!boxSize || boxSize <= 0) return;

      const col = Math.floor(mouseX / boxSize);
      const row = Math.floor(mouseY / boxSize);

      if (col >= 0 && col < numColumns && row >= 0 && row < numRows) {
        const index = row * numColumns + col;
        const targetBox = cursorBoxes[index];
        if (targetBox) {
          targetBox.style.opacity = '1';
          setTimeout(() => {
            targetBox.style.opacity = '0';
          }, 300);
        }
      }
    }
  }

  function onWindowResize() {
    buildGridElements();
  }

  // 3. Chapter 2 SAE Slider Controls
  function bindSaeControls() {
    const slider = $('#sae-slider');
    const label = $('#sae-steer-val');
    if (!slider || !label) return;

    slider.addEventListener('input', () => {
      const val = parseInt(slider.value, 10);
      label.textContent = `Δz = ${val >= 0 ? '+' : ''}${val}%`;
      if (window.SAEPolytope3D) {
        window.SAEPolytope3D.setSteer(val);
      }
    });
  }

  // 4. Chapter 3 Aerodynamics Slider Controls
  function bindAeroControls() {
    const slider = $('#aero-slider');
    const label = $('#aero-alpha-val');
    if (!slider || !label) return;

    slider.addEventListener('input', () => {
      const alpha = parseInt(slider.value, 10);
      label.textContent = `α = ${alpha >= 0 ? '+' : ''}${alpha}°`;
      if (window.AeroWindTunnel3D) {
        window.AeroWindTunnel3D.setAngle(alpha);
      }
    });
  }

  // 5. Render Research Accordions
  function renderResearchAccordions() {
    const list = $('#research-accordion');
    if (!list) return;

    list.innerHTML = RESEARCH_PAPERS.map(p => `
      <li class="accordion-item" data-id="${p.id}">
        <div class="accordion-header-row">
          <div style="display: flex; align-items: baseline; gap: 2vw;">
            <span class="monospace">${p.num}</span>
            <span class="accordion-header-title">${p.title}</span>
          </div>
          <div class="accordion-header-meta">
            <span class="monospace">${p.role}</span>
            <span class="more">+</span>
          </div>
        </div>
        <div class="accordion__content" style="display: none;">
          <div class="research-math-block">
            <span class="research-math-formula">${p.formula}</span>
            <p class="monospace__p" style="color: var(--grey); margin-bottom: 12px;">${p.desc}</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
              ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
            </div>
            <div style="display: flex; gap: 12px;">
              <a href="${p.github}" target="_blank" class="button button__half" style="border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; width: auto; font-size: 11px;">
                <span>View Repository</span>
                <span class="arrow">↗</span>
              </a>
              <button class="button button__half copy-bibtex-btn" data-id="${p.id}" style="border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; width: auto; font-size: 11px;">
                <span>Copy BibTeX</span>
              </button>
            </div>
          </div>
        </div>
      </li>
    `).join('');

    bindAccordionToggles(list);
  }

  // 6. Render Experience Accordions
  function renderExperienceAccordions() {
    const list = $('#experience-accordion');
    if (!list) return;

    list.innerHTML = EXPERIENCE_ITEMS.map(e => `
      <li class="accordion-item">
        <div class="accordion-header-row">
          <div style="display: flex; align-items: baseline; gap: 2vw;">
            <span class="monospace">${e.num}</span>
            <span class="accordion-header-title">${e.title}</span>
          </div>
          <div class="accordion-header-meta">
            <span class="monospace">${e.role}</span>
            <span class="more">+</span>
          </div>
        </div>
        <div class="accordion__content" style="display: none;">
          <div class="monospace" style="color: var(--lightblue); margin-bottom: 8px;">${e.date}</div>
          <p class="lead" style="font-size: 18px; line-height: 1.4; max-width: 65ch;">${e.desc}</p>
        </div>
      </li>
    `).join('');

    bindAccordionToggles(list);
  }

  function bindAccordionToggles(list) {
    list.querySelectorAll('.accordion-item').forEach(item => {
      const header = item.querySelector('.accordion-header-row');
      const content = item.querySelector('.accordion__content');

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        list.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherContent = other.querySelector('.accordion__content');
            if (otherContent) {
              if (typeof gsap !== 'undefined') {
                gsap.to(otherContent, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.inOut', onComplete: () => { otherContent.style.display = 'none'; } });
              } else {
                otherContent.style.display = 'none';
              }
            }
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          if (typeof gsap !== 'undefined') {
            gsap.to(content, { height: 0, opacity: 0, duration: 0.35, ease: 'power3.inOut', onComplete: () => { content.style.display = 'none'; } });
          } else {
            content.style.display = 'none';
          }
        } else {
          item.classList.add('open');
          content.style.display = 'block';
          content.style.height = 'auto';
          const autoHeight = content.offsetHeight;
          content.style.height = '0px';

          if (typeof gsap !== 'undefined') {
            gsap.to(content, { height: autoHeight, opacity: 1, duration: 0.45, ease: 'power3.out' });
          } else {
            content.style.height = 'auto';
          }
        }
      });
    });
  }

  // 7. Render Works Horizontal Showcase
  function renderWorksShowcase() {
    const loop = $('#showcase-loop');
    if (!loop) return;

    loop.innerHTML = WORKS_PROJECTS.map(w => `
      <div class="homeworks__showcaseItem" onclick="window.open('${w.link}', '_blank')">
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 1.5vw;">
            <span class="monospace">${w.tag}</span>
            <span class="monospace">${w.num}</span>
          </div>
          <h4 style="font-size: clamp(20px, 2.2vw, 32px); margin-bottom: 10px;">${w.title}</h4>
          <p class="monospace__p" style="color: var(--grey);">${w.desc}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1vw; margin-top: 1.5vw;">
          <span class="monospace" style="color: var(--lightblue); font-size: 10px;">${w.stack}</span>
          <span class="arrow">↗</span>
        </div>
      </div>
    `).join('');
  }

  // 8. Horizontal Showcase Drag & Skim Cursor
  function initWorksShowcaseInteraction() {
    const showcase = $('#works-showcase');
    const skimCursor = $('#skim-cursor');
    if (!showcase) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    showcase.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - showcase.offsetLeft;
      scrollLeft = showcase.scrollLeft;
    });

    showcase.addEventListener('mouseleave', () => {
      isDown = false;
      if (skimCursor) skimCursor.style.opacity = '0';
    });

    showcase.addEventListener('mouseup', () => {
      isDown = false;
    });

    showcase.addEventListener('mousemove', (e) => {
      if (skimCursor) {
        skimCursor.style.opacity = '1';
        skimCursor.style.transform = `translate3d(${e.clientX - 45}px, ${e.clientY - 20}px, 0)`;
      }

      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - showcase.offsetLeft;
      const walk = (x - startX) * 1.8;
      showcase.scrollLeft = scrollLeft - walk;
    });
  }

  // 9. Sculpture Controls
  function bindSculptureControls() {
    $$('.sculpture-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.sculpture-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        if (window.HeroSculpture) window.HeroSculpture.setMode(mode);
      });
    });
  }

  // 10. Copy Actions
  function bindCopyActions() {
    $('#copy-email-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('solus.quant.exps@gmail.com');
      showToast('Email address copied to clipboard');
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-bibtex-btn');
      if (btn) {
        const id = btn.dataset.id;
        const paper = RESEARCH_PAPERS.find(p => p.id === id);
        if (paper && paper.bibtex) {
          navigator.clipboard.writeText(paper.bibtex);
          showToast('BibTeX citation copied');
        }
      }
    });
  }

  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
