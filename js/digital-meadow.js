/**
 * Digital Meadow Studio Engine
 * Authentic 1:1 Replica of digitalmeadow.studio
 * Features:
 * - Real ASCII Grid DOM Overlay Renderer (dist.DWJMuWYl.js)
 * - OpenAI Navier-Stokes Finite-Time Singularity Vector Field Simulation Engine
 * - Axisymmetric Counter-Rotating Vortex Dipole & Hyperbolic Stagnation Flow
 * - Directional ASCII Streamline Vectors ('→', '↗', '↑', '↖', '←', '↙', '↓', '↘')
 * - Dynamic Streamline Circulation Pulses & Enstrophy Surge (||∇u||_L∞ → ∞)
 * - Periodic Finite-Time Singularity Blowup with 12-Color Radial Rainbow Bloom
 * - Mathematical HUD Telemetry & Lean 4 Formal Theorem Verification Readouts
 * - Interactive Mouse Deflection & Pressure Pulse (clean, zero-clutter fluid wake)
 * - Monospace Dynamic Vertical Centering (center-content.BNCOC3Qu.js)
 * - Authentic Vim Line Numbers with Tildes (LayoutEditor.Ce0keP5H.js)
 * - Button Hover Wave & Text Reveal Animations (text-wave-reveal.DBEOzdnR.js)
 * - Tree Navigation with Vim Keybindings (nav-tree & tree-folder)
 * - Mobile Off-Canvas Drawer (site-sidebar)
 * - 24 Verified Virtual Documents with Direct GitHub & Live Links
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. ASCII Overlay DOM Grid Renderer (from dist.DWJMuWYl.js)
     ========================================================================== */
  let styleSheet = null;
  function ensureAsciiStyles() {
    if (styleSheet) return;
    const styleEl = document.createElement('style');
    styleEl.textContent = `
.ascii-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  white-space: pre;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;
  border: none;
  outline: none;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  text-rendering: optimizeSpeed;
  font-kerning: none;
  font-variant-ligatures: none;
  font-feature-settings: "calt" 0, "liga" 0, "clig" 0, "dlig" 0, "hlig" 0;
  contain: layout style paint;
}
.ascii-overlay span {
  display: inline;
  white-space: pre;
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}
.ascii-overlay .ascii-row {
  display: block;
  white-space: pre;
  min-height: 1lh;
  contain: layout style;
}
`;
    document.head.appendChild(styleEl);
    styleSheet = styleEl.sheet;
  }

  const colorClassMap = new Map();
  function getColorClass(color, bgColor) {
    if (!color && !bgColor) return '';
    const key = `${color ?? ''}|${bgColor ?? ''}`;
    let cls = colorClassMap.get(key);
    if (cls) return cls;
    cls = `ascii-s${colorClassMap.size}`;
    colorClassMap.set(key, cls);
    const rules = [];
    if (color) rules.push(`color:${color}`);
    if (bgColor) rules.push(`background:${bgColor}`);
    if (styleSheet) {
      try {
        styleSheet.insertRule(`.ascii-overlay .${cls}{${rules.join(';')}}`, styleSheet.cssRules.length);
      } catch (e) {}
    }
    return cls;
  }

  const BLANK_CHAR = ' ';
  class AsciiSurface {
    constructor(cols, rows) {
      this.cols = 0;
      this.rows = 0;
      this.cells = [];
      this.minX = [];
      this.maxX = [];
      this.dirty = [];
      this.resize(cols, rows);
    }

    resize(cols, rows) {
      if (this.cols === cols && this.rows === rows) return;
      this.cols = cols;
      this.rows = rows;
      this.cells = new Array(rows);
      this.minX = new Int32Array(rows);
      this.maxX = new Int32Array(rows);
      this.dirty = new Uint8Array(rows);

      for (let y = 0; y < rows; y++) {
        const row = new Array(cols);
        for (let x = 0; x < cols; x++) {
          row[x] = { char: BLANK_CHAR, color: null, bgColor: null };
        }
        this.cells[y] = row;
        this.minX[y] = 0;
        this.maxX[y] = cols - 1;
        this.dirty[y] = 1;
      }
    }

    clear() {
      for (let y = 0; y < this.rows; y++) {
        if (!this.dirty[y]) continue;
        const row = this.cells[y];
        const min = this.minX[y];
        const max = this.maxX[y];
        for (let x = min; x <= max; x++) {
          const cell = row[x];
          cell.char = BLANK_CHAR;
          cell.color = null;
          cell.bgColor = null;
        }
        this.minX[y] = this.cols;
        this.maxX[y] = -1;
      }
    }

    set(x, y, char, color = null, bgColor = null) {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
      if (char === undefined || char === null) return;
      const cell = this.cells[y][x];
      cell.char = char;
      cell.color = color;
      cell.bgColor = bgColor;
      if (x < this.minX[y]) this.minX[y] = x;
      if (x > this.maxX[y]) this.maxX[y] = x;
      this.dirty[y] = 1;
    }

    get(x, y) {
      if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return null;
      return this.cells[y][x];
    }

    markRendered() {
      this.dirty.fill(0);
    }

    isRowDirty(y) {
      return this.dirty[y] === 1;
    }
  }

  function measureFontMetrics(target) {
    const probe = document.createElement('span');
    probe.textContent = 'M';
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;';
    target.appendChild(probe);
    const rect = probe.getBoundingClientRect();
    target.removeChild(probe);

    const cellWidth = rect.width || 8.5;
    const computedLH = parseFloat(getComputedStyle(target).lineHeight);
    const lineHeight = !isNaN(computedLH) && computedLH > 0 ? computedLH : (rect.height || 19);
    return { cellWidth, lineHeight, aspect: cellWidth / lineHeight };
  }

  function createTextRenderer(initialRows) {
    const overlay = document.createElement('pre');
    overlay.className = 'ascii-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const rowElements = [];
    const prevLengths = [];
    const prevChars = [];
    const prevClasses = [];
    let rowsCount = initialRows;

    function initRows() {
      overlay.textContent = '';
      rowElements.length = 0;
      prevLengths.length = 0;
      prevChars.length = 0;
      prevClasses.length = 0;

      for (let y = 0; y < rowsCount; y++) {
        const rowSpan = document.createElement('span');
        rowSpan.className = 'ascii-row';
        rowSpan.textContent = '\n';
        overlay.appendChild(rowSpan);
        rowElements.push(rowSpan);
        prevLengths.push(0);
        prevChars.push([]);
        prevClasses.push([]);
      }
    }
    initRows();

    const pendingChars = [];
    const pendingClasses = [];

    function buildRowRuns(surface, y) {
      pendingChars.length = 0;
      pendingClasses.length = 0;
      const row = surface.cells[y];
      const cols = surface.cols;
      let lastNonBlank = -1;
      for (let x = cols - 1; x >= 0; x--) {
        if (row[x].char !== BLANK_CHAR || row[x].bgColor) {
          lastNonBlank = x;
          break;
        }
      }
      if (lastNonBlank === -1) return;

      let runText = '';
      let runClass = '';
      for (let x = 0; x <= lastNonBlank; x++) {
        const cell = row[x];
        const cellClass = getColorClass(cell.color, cell.bgColor);
        if (cellClass === runClass) {
          runText += cell.char;
        } else {
          if (runText) {
            pendingChars.push(runText);
            pendingClasses.push(runClass);
          }
          runText = cell.char;
          runClass = cellClass;
        }
      }
      if (runText) {
        pendingChars.push(runText);
        pendingClasses.push(runClass);
      }
    }

    function commitRow(y) {
      const pChars = prevChars[y];
      const pClasses = prevClasses[y];
      const pendingCount = pendingChars.length;
      const pLen = prevLengths[y];

      if (pendingCount === pLen) {
        let isSame = true;
        for (let i = 0; i < pendingCount; i++) {
          if (pChars[i] !== pendingChars[i] || pClasses[i] !== pendingClasses[i]) {
            isSame = false;
            break;
          }
        }
        if (isSame) return;
      }

      const rowSpan = rowElements[y];
      const children = rowSpan.children;

      for (let i = 0; i < pendingCount; i++) {
        const child = children[i];
        if (child) {
          if (i >= pLen || pChars[i] !== pendingChars[i]) child.textContent = pendingChars[i];
          if (i >= pLen || pClasses[i] !== pendingClasses[i]) child.className = pendingClasses[i];
        } else {
          const newSpan = document.createElement('span');
          newSpan.textContent = pendingChars[i];
          if (pendingClasses[i]) newSpan.className = pendingClasses[i];
          rowSpan.appendChild(newSpan);
        }
        pChars[i] = pendingChars[i];
        pClasses[i] = pendingClasses[i];
      }

      for (let i = children.length - 1; i >= pendingCount; i--) {
        rowSpan.removeChild(children[i]);
      }
      prevLengths[y] = pendingCount;
    }

    function render(surface) {
      const maxRows = Math.min(rowsCount, surface.rows);
      for (let y = 0; y < maxRows; y++) {
        if (surface.isRowDirty(y)) {
          buildRowRuns(surface, y);
          commitRow(y);
        }
      }
    }

    function resize(newRows) {
      rowsCount = newRows;
      initRows();
    }

    function destroy() {
      overlay.remove();
      rowElements.length = 0;
    }

    return { overlay, render, resize, destroy };
  }

  class AsciiRenderer {
    constructor(target, program, options = {}) {
      this.cursor = { x: -1, y: -1, active: false };
      this.frame = 0;
      this.time = 0;
      this.accumulator = 0;
      this.lastTimestamp = 0;
      this.rafId = null;
      this.running = false;

      this.onPointerMove = (e) => {
        const rect = this.target.getBoundingClientRect();
        this.cursor = {
          x: Math.floor((e.clientX - rect.left) / this.metrics.cellWidth),
          y: Math.floor((e.clientY - rect.top) / this.metrics.lineHeight),
          active: true
        };
      };
      this.onPointerLeave = () => {
        this.cursor = { x: -1, y: -1, active: false };
      };
      this.onVisibilityChange = () => {
        if (!document.hidden) {
          this.lastTimestamp = performance.now();
          this.accumulator = 0;
        }
      };
      this.loop = (now) => {
        if (!this.running) return;
        this.rafId = requestAnimationFrame(this.loop);
        this.accumulator += (now - this.lastTimestamp) / 1000;
        this.lastTimestamp = now;
        const targetStep = this.options.fps > 0 ? 1 / this.options.fps : 0;
        if (this.accumulator < targetStep) return;
        const delta = Math.min(this.accumulator, Math.max(this.options.maxDelta, targetStep));
        this.accumulator = 0;
        this.time += delta;
        this.tick(delta);
      };

      this.target = target;
      this.program = program;
      const compStyle = getComputedStyle(target);
      this.options = {
        fps: options.fps ?? 0,
        maxDelta: options.maxDelta ?? 0.1,
        fontSize: options.fontSize ?? compStyle.fontSize,
        fontFamily: options.fontFamily ?? compStyle.fontFamily,
        color: options.color ?? compStyle.color,
        backgroundColor: options.backgroundColor ?? 'transparent'
      };

      ensureAsciiStyles();
      this.metrics = measureFontMetrics(target);
      this.surface = new AsciiSurface(this.calcCols(), this.calcRows());
      this.textRenderer = createTextRenderer(this.surface.rows);

      target.style.position = compStyle.position === 'static' ? 'relative' : compStyle.position;
      target.appendChild(this.textRenderer.overlay);

      target.addEventListener('pointermove', this.onPointerMove);
      target.addEventListener('pointerleave', this.onPointerLeave);
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(target);
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    start() {
      if (!this.running) {
        this.running = true;
        this.frame = 0;
        this.time = 0;
        this.accumulator = 0;
        this.lastTimestamp = performance.now();
        this.rafId = requestAnimationFrame(this.loop);
      }
    }

    stop() {
      this.running = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    destroy() {
      this.stop();
      this.target.removeEventListener('pointermove', this.onPointerMove);
      this.target.removeEventListener('pointerleave', this.onPointerLeave);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
      this.resizeObserver.disconnect();
      this.textRenderer.destroy();
    }

    get cellWidth() { return this.metrics.cellWidth; }
    get lineHeight() { return this.metrics.lineHeight; }
    get cols() { return this.surface.cols; }
    get rows() { return this.surface.rows; }

    resize() {
      this.metrics = measureFontMetrics(this.target);
      const newCols = this.calcCols();
      const newRows = this.calcRows();
      if (newCols !== this.surface.cols || newRows !== this.surface.rows) {
        this.surface.resize(newCols, newRows);
        this.textRenderer.resize(newRows);
      }
    }

    calcCols() {
      return Math.max(1, Math.floor(this.target.clientWidth / this.metrics.cellWidth));
    }
    calcRows() {
      return Math.max(1, Math.floor(this.target.clientHeight / this.metrics.lineHeight));
    }

    tick(delta) {
      const s = this.surface;
      const ctx = {
        frame: this.frame,
        time: this.time,
        delta,
        cols: s.cols,
        rows: s.rows,
        metrics: this.metrics,
        cursor: this.cursor
      };
      this.program.pre?.(ctx);
      s.clear();
      this.program.draw?.(s, ctx);
      this.program.post?.(ctx);
      this.textRenderer.render(s);
      s.markRendered();
      this.frame++;
    }
  }


  /* ==========================================================================
     2. OpenAI Navier-Stokes Finite-Time Singularity Particle Simulation Engine
     ========================================================================== */
  function resolveColor(el, val) {
    const trimmed = val.trim();
    if (!trimmed.startsWith('var(')) return trimmed;
    el.style.color = trimmed;
    const computed = getComputedStyle(el).color;
    el.style.color = '';
    const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return match ? '#' + [match[1], match[2], match[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('') : computed;
  }

  // Refined, cohesive aesthetic palette for shockwave & singularity
  const BLOOM_PALETTE = [
    'var(--color-snow)',
    'var(--color-skye)',
    'var(--color-green)',
    'var(--color-yellow)',
    'var(--color-text)',
    'var(--color-overlay2)'
  ];

  const STREAM_VECTORS = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
  const TURBULENCE_GLYPHS = ['~', '≈', '∿', '·', '─', '│', '╱', '╲'];
  const CORE_BLOWUP_GLYPHS = ['✹', '✸', '✦', '✳', '✴', '✱', 'ø', '@', '%'];

  const LEAN_PROOF_TOKENS = [
    'theorem navier_stokes_finite_time_blowup',
    '∂t u + (u·∇)u = -∇p + νΔu + f',
    '∇·u = 0  (incompressible)',
    'lim t→T* ‖∇u(t)‖_L∞ = ∞',
    'Lean 4 · mathlib4',
    'T* = 88.4h (OpenAI Swarm)',
    'MathDiff: Verified [Lean 4]',
    'f(x,t) ∈ C^∞(𝕋³ × [0,T*))',
    'enstrophy: ‖ω‖² → ∞',
    'vorticity: ω = ∇ × u',
    'SingularityAt(T*)',
    'ν = 1.0e-3 (Re ≫ 1)',
    'OpenAI Formal Proof (2026)',
    'arXiv:2609.08842 [math.AP]'
  ];

  class NavierStokesField {
    constructor(w = 56, h = 32) {
      this.w = w;
      this.h = h;
      const size = w * h;
      this.u = new Float32Array(size);
      this.v = new Float32Array(size);
      this.speed = new Float32Array(size);
      this.enstrophy = new Float32Array(size);

      // Singularity & Shockwave Cycle
      this.cyclePeriod = 16.0; // seconds per blowup cycle
      this.singularityTime = 12.0; // blowup occurs at t = 12.0s
      this.shockwaveRadius = -1;
      this.shockwaveOrigin = { x: w / 2, y: h / 2 };
      this.shockwaveActive = false;
      this.lastBlowupTime = -999;
    }

    step(time, delta, mouseInject, config) {
      const { w, h, u, v, speed, enstrophy } = this;
      const speedMult = config?.speed || 1.0;
      const period = config?.period || this.cyclePeriod;
      const blowupTime = config?.blowupTime || this.singularityTime;
      const cycleTime = time % period;
      const blowupTau = cycleTime / blowupTime;

      // Center of moving vortex dipole
      const cx = w / 2 + Math.sin(time * 0.45 * speedMult) * (w * 0.14);
      const cy = h / 2 + Math.cos(time * 0.35 * speedMult) * (h * 0.12);

      // Finite-time blowup intensity scaling (OpenAI singularity formulation)
      let intensity = 1.0;
      if (cycleTime < blowupTime) {
        const progress = Math.min(0.96, blowupTau);
        intensity = 0.8 + 2.8 * Math.pow(progress, 3.2);
      } else {
        const post = (cycleTime - blowupTime) / (period - blowupTime);
        intensity = Math.max(0.6, 3.6 * (1.0 - post * 0.8));
      }

      // Trigger Singularity Shockwave at blowup moment
      if (cycleTime >= blowupTime && (time - this.lastBlowupTime > 4.0)) {
        this.lastBlowupTime = time;
        this.shockwaveActive = true;
        this.shockwaveRadius = 0;
        this.shockwaveOrigin = { x: cx, y: cy };
      }

      if (this.shockwaveActive) {
        this.shockwaveRadius += delta * 38.0 * speedMult;
        if (this.shockwaveRadius > Math.hypot(w, h * 1.8)) {
          this.shockwaveActive = false;
        }
      }

      // Smooth Navier-Stokes forcing ansatz f(x, y, t)
      for (let y = 0; y < h; y++) {
        const row = y * w;
        for (let x = 0; x < w; x++) {
          const idx = row + x;
          const dx = x - cx;
          const dy = (y - cy) * 1.8; // Aspect ratio adjustment
          const r2 = dx * dx + dy * dy + 3.5;

          // Axisymmetric vortex dipole + shear strain
          const swirl = (intensity * 12.0) / r2;
          const u_target = -dy * swirl + Math.sin(time * 1.2 + y * 0.25) * 0.35;
          const v_target = dx * swirl * 0.55 - Math.cos(time * 0.9 + x * 0.2) * 0.25;

          // Momentum advection & damping
          u[idx] = u[idx] * 0.88 + u_target * 0.12 * speedMult;
          v[idx] = v[idx] * 0.88 + v_target * 0.12 * speedMult;

          // Inject mouse force if present
          if (mouseInject && mouseInject.active) {
            const mdx = x - mouseInject.x;
            const mdy = y - mouseInject.y;
            const mr2 = mdx * mdx + mdy * mdy;
            if (mr2 < 36.0) {
              const force = (1.0 - mr2 / 36.0) * mouseInject.strength;
              u[idx] += mouseInject.vx * force;
              v[idx] += mouseInject.vy * force;
            }
          }

          const spd = Math.sqrt(u[idx] * u[idx] + v[idx] * v[idx]);
          speed[idx] = spd;
          enstrophy[idx] = spd * spd;
        }
      }
    }

    sample(xFrac, yFrac) {
      const gx = Math.max(0, Math.min(this.w - 1, xFrac * (this.w - 1)));
      const gy = Math.max(0, Math.min(this.h - 1, yFrac * (this.h - 1)));
      const x0 = Math.floor(gx), x1 = Math.min(this.w - 1, x0 + 1);
      const y0 = Math.floor(gy), y1 = Math.min(this.h - 1, y0 + 1);
      const fx = gx - x0, fy = gy - y0;

      const idx00 = y0 * this.w + x0;
      const idx10 = y0 * this.w + x1;
      const idx01 = y1 * this.w + x0;
      const idx11 = y1 * this.w + x1;

      const uInterp = (this.u[idx00] * (1 - fx) + this.u[idx10] * fx) * (1 - fy) +
                      (this.u[idx01] * (1 - fx) + this.u[idx11] * fx) * fy;
      const vInterp = (this.v[idx00] * (1 - fx) + this.v[idx10] * fx) * (1 - fy) +
                      (this.v[idx01] * (1 - fx) + this.v[idx11] * fx) * fy;
      const spdInterp = Math.sqrt(uInterp * uInterp + vInterp * vInterp);

      // Check shockwave proximity
      let inShockwave = false;
      let shockDist = 999;
      if (this.shockwaveActive) {
        const dx = gx - this.shockwaveOrigin.x;
        const dy = gy - this.shockwaveOrigin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        shockDist = Math.abs(dist - this.shockwaveRadius);
        if (shockDist < 2.5) {
          inShockwave = true;
        }
      }

      return { u: uInterp, v: vInterp, speed: spdInterp, inShockwave, shockDist };
    }
  }

  // Drifting Lean 4 Proof Token Particle
  class ProofTokenParticle {
    constructor(cols, rows) {
      this.respawn(cols, rows, true);
    }

    respawn(cols, rows, initial = false) {
      this.text = LEAN_PROOF_TOKENS[Math.floor(Math.random() * LEAN_PROOF_TOKENS.length)];
      this.x = initial ? Math.random() * cols : (Math.random() < 0.5 ? -this.text.length : cols);
      this.y = Math.random() * rows;
      this.vx = (Math.random() - 0.5) * 4.0;
      this.vy = (Math.random() - 0.5) * 2.0;
      this.age = 0;
      this.life = 12.0 + Math.random() * 8.0;
      this.color = (this.text.includes('theorem') || this.text.includes('Verified'))
        ? 'var(--color-green)'
        : (this.text.includes('lim') || this.text.includes('∞') || this.text.includes('∂t'))
        ? 'var(--color-skye)'
        : 'var(--color-overlay2)';
    }

    step(delta, cols, rows, fluid) {
      this.age += delta;
      if (this.age > this.life) {
        this.respawn(cols, rows);
        return;
      }

      const sample = fluid.sample(this.x / cols, this.y / rows);
      this.x += (this.vx + sample.u * 14.0) * delta;
      this.y += (this.vy + sample.v * 7.0) * delta;

      if (this.x < -this.text.length - 10 || this.x > cols + 10 || this.y < -5 || this.y > rows + 5) {
        this.respawn(cols, rows);
      }
    }
  }

  function createHeadingRecord(text, color) {
    return {
      text,
      color,
      alwaysVisible: true,
      lastHitTime: new Float32Array(text.length).fill(-1),
      startX: 0,
      row: 0
    };
  }

  function layoutHeadings(headings, renderCtx, containerEl, h1El) {
    const rectTop = containerEl.getBoundingClientRect().top;
    const rectH1 = h1El.getBoundingClientRect().top;
    const baseRow = Math.max(0, Math.round((rectH1 - rectTop) / renderCtx.metrics.lineHeight));
    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      h.row = baseRow + i;
      h.startX = Math.max(0, Math.floor((renderCtx.cols - h.text.length) / 2));
    }
  }

  function checkHeadingFluidCollision(headings, fluid, renderCtx) {
    const { cols, rows, time } = renderCtx;
    for (let hIdx = 0; hIdx < headings.length; hIdx++) {
      const h = headings[hIdx];
      if (h.row < 0 || h.row >= rows) continue;
      const yFrac = h.row / (rows - 1 || 1);

      // Only singularity shockwaves trigger a subtle luminous shimmer on headings
      for (let i = 0; i < h.text.length; i++) {
        const x = h.startX + i;
        if (x < 0 || x >= cols) continue;
        const sample = fluid.sample(x / (cols - 1 || 1), yFrac);
        if (sample.inShockwave) {
          h.lastHitTime[i] = time;
        }
      }
    }
  }

  function drawHeadings(surface, headings, time) {
    for (let hIdx = 0; hIdx < headings.length; hIdx++) {
      const h = headings[hIdx];
      for (let i = 0; i < h.text.length; i++) {
        const ch = h.text[i];
        if (!ch || ch === ' ') continue;
        const lastHit = h.lastHitTime ? h.lastHitTime[i] : -1;
        const elapsed = (lastHit >= 0 && time >= lastHit) ? time - lastHit : 999;
        
        let charColor = h.color;
        if (elapsed < 0.25) {
          charColor = 'var(--color-snow)';
        } else if (elapsed < 0.5) {
          charColor = 'var(--color-green)';
        }

        surface.set(h.startX + i, h.row, ch, charColor);
      }
    }
  }

  function initNavierStokesRainEngine(targetEl, options = {}) {
    let renderer = null;
    const fluid = new NavierStokesField(56, 32);
    const tokens = Array.from({ length: 9 }, () => new ProofTokenParticle(80, 40));
    const headings = (options.headings || []).map(h => createHeadingRecord(h.text, h.color));

    const mouseState = {
      px: -999,
      py: -999,
      col: -999,
      row: -999,
      vx: 0,
      vy: 0,
      speed: 0,
      active: false,
      lastTime: 0
    };

    let mouseInject = { x: -99, y: -99, vx: 0, vy: 0, strength: 0, active: false };
    let needsMeasure = true;
    let lastCols = -1;
    let lastRows = -1;
    let lastH1Top = -9999;

    const config = {
      speed: 1.0,
      period: 16.0,
      blowupTime: 12.0,
      particleDensity: 1.8,
      showStreamlines: true
    };

    function markDirty() { needsMeasure = true; }

    function updateMeasurements(renderCtx) {
      const h1El = document.querySelector('h1');
      const currentH1Top = h1El ? h1El.getBoundingClientRect().top : -1;
      const dimsChanged = renderCtx.cols !== lastCols || renderCtx.rows !== lastRows;
      const h1Moved = Math.abs(currentH1Top - lastH1Top) > 0.5;

      if (!needsMeasure && !dimsChanged && !h1Moved) return;

      needsMeasure = false;
      lastCols = renderCtx.cols;
      lastRows = renderCtx.rows;
      lastH1Top = currentH1Top;

      if (headings.length > 0 && h1El) {
        layoutHeadings(headings, renderCtx, targetEl, h1El);
      }
    }

    // Pointer Interaction: Mouse/Touch precisely tracked for centered hover and fluid momentum
    const parent = targetEl.closest('.content-page') || document.body;
    parent.addEventListener('pointermove', (e) => {
      if (!renderer || !renderer.cellWidth || !renderer.cols) return;
      const rect = targetEl.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const col = px / renderer.cellWidth;
      const row = py / renderer.lineHeight;
      const now = performance.now();

      if (mouseState.active && mouseState.lastTime > 0) {
        const dt = Math.max(0.001, (now - mouseState.lastTime) / 1000);
        const rawVx = (col - mouseState.col) / dt;
        const rawVy = (row - mouseState.row) / dt;
        mouseState.vx = mouseState.vx * 0.3 + rawVx * 0.7;
        mouseState.vy = mouseState.vy * 0.3 + rawVy * 0.7;
        mouseState.speed = Math.hypot(mouseState.vx, mouseState.vy);
      }

      mouseState.px = px;
      mouseState.py = py;
      mouseState.col = col;
      mouseState.row = row;
      mouseState.active = (col >= 0 && col < renderer.cols && row >= 0 && row < renderer.rows);
      mouseState.lastTime = now;

      // Bijective mapping to Eulerian fluid grid
      const colFrac = Math.max(0, Math.min(1, col / (renderer.cols - 1 || 1)));
      const rowFrac = Math.max(0, Math.min(1, row / (renderer.rows - 1 || 1)));
      mouseInject = {
        x: colFrac * (fluid.w - 1),
        y: rowFrac * (fluid.h - 1),
        vx: Math.max(-8, Math.min(8, mouseState.vx * 0.08)),
        vy: Math.max(-8, Math.min(8, mouseState.vy * 0.08)),
        strength: 1.5,
        active: true
      };
    });

    parent.addEventListener('pointerleave', () => {
      mouseState.active = false;
      mouseState.px = -999;
      mouseState.py = -999;
      mouseState.col = -999;
      mouseState.row = -999;
      mouseInject.active = false;
    });

    // Click triggers localized vortex perturbation & mini-shockwave
    parent.addEventListener('click', (e) => {
      if (!renderer || !renderer.cellWidth || !renderer.cols) return;
      const rect = targetEl.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const col = px / renderer.cellWidth;
      const row = py / renderer.lineHeight;
      const colFrac = Math.max(0, Math.min(1, col / (renderer.cols - 1 || 1)));
      const rowFrac = Math.max(0, Math.min(1, row / (renderer.rows - 1 || 1)));

      fluid.shockwaveActive = true;
      fluid.shockwaveRadius = 0;
      fluid.shockwaveOrigin = {
        x: colFrac * (fluid.w - 1),
        y: rowFrac * (fluid.h - 1)
      };
    });

    function preTick(renderCtx) {
      updateMeasurements(renderCtx);
      fluid.step(renderCtx.time, renderCtx.delta, mouseInject, config);

      if (mouseInject.active) {
        mouseInject.strength *= 0.9;
        if (mouseInject.strength < 0.05) mouseInject.active = false;
      }

      for (let i = 0; i < tokens.length; i++) {
        tokens[i].step(renderCtx.delta, renderCtx.cols, renderCtx.rows, fluid);
      }

      if (headings.length > 0) {
        checkHeadingFluidCollision(headings, fluid, renderCtx);
      }
    }

    function drawTick(surface, renderCtx) {
      const { cols, rows, time } = renderCtx;
      const colorOverlay = 'var(--color-overlay2)';
      const colorSurface = 'var(--color-surface2)';
      const colorGreen = 'var(--color-green)';
      const colorSkye = 'var(--color-skye)';
      const colorSnow = 'var(--color-snow)';

      // 1. Draw Navier-Stokes Fluid Streamlines & Singularity Shockwaves
      if (config.showStreamlines) {
        const stepX = 2;
        const stepY = 2;

        for (let y = 0; y < rows; y += stepY) {
          const yFrac = y / (rows - 1 || 1);
          for (let x = (y % 4 === 0 ? 0 : 1); x < cols; x += stepX) {
            const xFrac = x / (cols - 1 || 1);
            const s = fluid.sample(xFrac, yFrac);

            // Distance in physical pixels from the exact mouse pointer
            let mouseDistPx = 9999;
            let mDx = 0;
            let mDy = 0;
            if (mouseState.active) {
              const cellPxX = (x + 0.5) * renderer.cellWidth;
              const cellPxY = (y + 0.5) * renderer.lineHeight;
              mDx = cellPxX - mouseState.px;
              mDy = cellPxY - mouseState.py;
              mouseDistPx = Math.hypot(mDx, mDy);
            }

            // Finite-time singularity shockwave bloom rings
            if (s.inShockwave) {
              const colorIdx = Math.floor((s.shockDist * 4 + time * 6) % BLOOM_PALETTE.length);
              const shockColor = BLOOM_PALETTE[colorIdx < 0 ? colorIdx + BLOOM_PALETTE.length : colorIdx];
              const shockGlyph = CORE_BLOWUP_GLYPHS[Math.floor(Math.random() * CORE_BLOWUP_GLYPHS.length)];
              surface.set(x, y, shockGlyph, shockColor);
              continue;
            }

            // Mouse hover deflection aura - exactly centered on cursor
            if (mouseDistPx < 60) {
              const hoverFactor = 1.0 - (mouseDistPx / 60);
              const normX = mDx / (mouseDistPx || 1);
              const normY = mDy / (mouseDistPx || 1);
              s.u += normX * hoverFactor * 1.8 + (-normY) * hoverFactor * 0.8;
              s.v += normY * hoverFactor * 1.8 + (normX) * hoverFactor * 0.8;
              s.speed = Math.hypot(s.u, s.v);

              // Center focal cursor point directly under mouse
              if (mouseDistPx < 14) {
                surface.set(x, y, '✦', colorSnow);
                continue;
              }
            }

            // Directional Streamline Vectors
            if (s.speed > 0.12) {
              let angle = Math.atan2(s.v, s.u);
              if (angle < 0) angle += 2 * Math.PI;
              const dirIdx = Math.floor((angle + Math.PI / 8) / (Math.PI / 4)) % 8;

              let char = STREAM_VECTORS[dirIdx];
              let col = colorOverlay;

              if (mouseDistPx < 45) {
                col = colorSkye;
              } else if (s.speed > 1.6) {
                char = CORE_BLOWUP_GLYPHS[(Math.floor(time * 8) + x + y) % CORE_BLOWUP_GLYPHS.length];
                col = colorGreen;
              } else if (s.speed > 0.9) {
                col = colorSkye;
              } else if (s.speed < 0.3) {
                char = TURBULENCE_GLYPHS[(x + y) % TURBULENCE_GLYPHS.length];
                col = colorSurface;
              }

              surface.set(x, y, char, col);
            }
          }
        }
      }

      // 2. Draw Drifting Lean 4 Proof Formalization Tokens
      for (let tIdx = 0; tIdx < tokens.length; tIdx++) {
        const t = tokens[tIdx];
        const startX = Math.round(t.x);
        const y = Math.round(t.y);
        if (y < 0 || y >= rows) continue;

        for (let i = 0; i < t.text.length; i++) {
          const x = startX + i;
          if (x >= 0 && x < cols) {
            const ch = t.text[i];
            if (ch !== ' ') {
              surface.set(x, y, ch, t.color);
            }
          }
        }
      }

      // 3. Draw Center Headings (Alexander Jameson, title)
      drawHeadings(surface, headings, time);
    }

    renderer = new AsciiRenderer(targetEl, { pre: preTick, draw: drawTick }, { fps: 0 });

    window.addEventListener('resize', markDirty);
    window.addEventListener('fullscreenchange', markDirty);
    document.addEventListener('fullscreenchange', markDirty);
    window.addEventListener('dm-content-centered', markDirty);
    document.fonts.ready.then(markDirty);

    const h1Parent = document.querySelector('h1')?.parentElement;
    if (h1Parent) new ResizeObserver(markDirty).observe(h1Parent);

    // Initial sizing and start
    renderer.resize();
    renderer.start();

    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        renderer.resize();
        renderer.start();
      });
    });

    renderer.markDirty = markDirty;
    renderer.config = config;
    renderer.fluid = fluid;
    return renderer;
  }


  /* ==========================================================================
     3. Monospace Fullscreen Vertical Centering (center-content.BNCOC3Qu.js)
     ========================================================================== */
  function centerContent(elementId = 'center-spacers') {
    function recompute() {
      const contentLines = document.querySelector('.content-lines');
      if (!contentLines) return;
      const spacerAnchor = document.getElementById(elementId);
      if (!spacerAnchor) return;

      contentLines.querySelectorAll('.center-spacer').forEach(e => e.remove());
      const lineHeight = parseFloat(getComputedStyle(contentLines).lineHeight);
      if (isNaN(lineHeight)) return;

      const rect = contentLines.getBoundingClientRect();
      const remainingHeight = window.innerHeight - rect.top - rect.height;
      const rowsNeeded = Math.max(0, Math.floor(remainingHeight / 2 / lineHeight));

      for (let i = 0; i < rowsNeeded; i++) {
        const p = document.createElement('p');
        p.className = 'center-spacer';
        p.setAttribute('aria-hidden', 'true');
        p.innerHTML = '&nbsp;';
        spacerAnchor.insertAdjacentElement('afterend', p);
      }

      window.dispatchEvent(new CustomEvent('dm-content-centered'));
    }

    document.fonts.ready.then(() => { requestAnimationFrame(recompute); });
    window.addEventListener('resize', recompute);
    function onFsChange() {
      recompute();
      requestAnimationFrame(recompute);
      setTimeout(recompute, 50);
      setTimeout(recompute, 150);
      setTimeout(recompute, 300);
    }
    window.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('fullscreenchange', onFsChange);
    return recompute;
  }


  /* ==========================================================================
     4. Dynamic Vim Line Numbers (from LayoutEditor.Ce0keP5H.js)
     ========================================================================== */
  function initLineNumbers() {
    const pageEl = document.querySelector('.content-page');
    const linesEl = document.querySelector('.content-lines');
    const numbersEl = document.querySelector('.line-numbers');

    function update() {
      if (!pageEl || !linesEl || !numbersEl) return;
      const lineHeight = parseFloat(getComputedStyle(linesEl).lineHeight) || 19;
      const topOffset = pageEl.getBoundingClientRect().top;
      const viewHeight = window.innerHeight - topOffset;
      const contentHeight = linesEl.getBoundingClientRect().height;
      const padExtra = contentHeight + 2 * lineHeight >= viewHeight ? 2 : 0;
      linesEl.style.paddingBottom = padExtra ? `calc(${padExtra} * var(--line-height))` : '';

      const effectiveHeight = padExtra ? linesEl.getBoundingClientRect().height : contentHeight;
      const totalSlots = Math.max(0, Math.round(Math.max(effectiveHeight, viewHeight) / lineHeight));
      const contentSlots = Math.max(0, Math.round(effectiveHeight / lineHeight) - padExtra);

      const frag = document.createDocumentFragment();
      for (let i = 1; i <= totalSlots; i++) {
        const div = document.createElement('div');
        div.textContent = i <= contentSlots ? String(i) : '~';
        frag.appendChild(div);
      }
      numbersEl.replaceChildren(frag);
    }

    let isScheduled = false;
    function schedule() {
      if (!isScheduled) {
        isScheduled = true;
        requestAnimationFrame(() => {
          isScheduled = false;
          update();
        });
      }
    }

    window.addEventListener('resize', schedule);
    window.addEventListener('fullscreenchange', schedule);
    document.addEventListener('fullscreenchange', schedule);
    window.addEventListener('dm-content-centered', schedule);
    const observer = new MutationObserver(schedule);
    if (linesEl) {
      observer.observe(linesEl, { childList: true, subtree: true, characterData: true });
    }
    return schedule;
  }


  /* ==========================================================================
     5. Button Hover Wave & Text Reveal (text-wave-reveal.DBEOzdnR.js)
     ========================================================================== */
  function initButtonHoverWaves() {
    document.addEventListener('pointerenter', (e) => {
      const button = e.target.closest?.('.button');
      if (!button || button.dataset.waving === 'true') return;

      const inner = button.querySelector('.button-inner');
      if (!inner) return;

      const textNodes = [];
      const walk = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT);
      let n;
      while (n = walk.nextNode()) {
        if (!n.parentElement.classList.contains('button-icon')) {
          textNodes.push(n);
        }
      }

      const originalText = textNodes.map(node => node.nodeValue);
      const chars = originalText.join('').split('');
      if (chars.length === 0) return;

      button.dataset.waving = 'true';
      let step = 0;
      const totalSteps = chars.length + 5;

      const waveInterval = setInterval(() => {
        step++;
        if (step > totalSteps) {
          clearInterval(waveInterval);
          button.dataset.waving = 'false';
          let charIdx = 0;
          textNodes.forEach((node, i) => {
            node.nodeValue = originalText[i];
          });
          return;
        }

        let charCounter = 0;
        textNodes.forEach((node) => {
          const len = node.nodeValue.length;
          let nodeNew = '';
          for (let c = 0; c < len; c++) {
            const dist = Math.abs(charCounter - step);
            if (dist === 0) {
              nodeNew += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            } else if (dist === 1) {
              nodeNew += chars[charCounter] ? chars[charCounter].toUpperCase() : '~';
            } else {
              nodeNew += chars[charCounter] || '';
            }
            charCounter++;
          }
          node.nodeValue = nodeNew;
        });
      }, 35);
    }, true);
  }

  function textWaveReveal(container) {
    const headings = container.querySelectorAll('h1, h2, h3, p, li, pre code');
    headings.forEach((el) => {
      if (el.dataset.textWave === 'skip') return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(4px)';
      el.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }


  /* ==========================================================================
     6. Tree Navigation & Sidebar Elements
     ========================================================================== */
  customElements.define('tree-folder', class extends HTMLElement {
    connectedCallback() {
      const summary = this.querySelector('[data-summary]');
      const group = this.querySelector('[role="group"]');
      if (!summary || !group) return;

      const updateState = (open) => {
        this.toggleAttribute('open', open);
        summary.setAttribute('aria-expanded', String(open));
        group.hidden = !open;
      };

      updateState(this.hasAttribute('open'));

      summary.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = this.hasAttribute('open');
        updateState(!isOpen);
      });
    }
  });

  customElements.define('nav-tree', class extends HTMLElement {
    connectedCallback() {
      this.addEventListener('keydown', (e) => this.onKeyDown(e));
      this.addEventListener('click', (e) => this.onClick(e));
    }
    visibleTreeItems() {
      return Array.from(this.querySelectorAll('[role="treeitem"]')).filter(el => {
        const parentGroup = el.closest('[role="group"]');
        if (!parentGroup) return true;
        const parentFolder = parentGroup.closest('tree-folder');
        return parentFolder ? parentFolder.hasAttribute('open') : true;
      });
    }
    onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target.closest('[role="treeitem"]');
      if (!target) return;
      const visible = this.visibleTreeItems();
      const idx = visible.indexOf(target);
      if (idx === -1) return;

      const folder = target.matches('[data-summary]') ? target.closest('tree-folder') : null;
      const isOpen = folder?.hasAttribute('open') ?? false;

      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          visible[idx + 1]?.focus();
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          visible[idx - 1]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          visible[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          visible[visible.length - 1]?.focus();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          if (!folder || !isOpen) target.click();
          else visible[idx + 1]?.focus();
          break;
        case 'ArrowLeft':
        case 'h':
          e.preventDefault();
          if (folder && isOpen) target.click();
          break;
        case ' ':
          if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            e.preventDefault();
            target.click();
          }
          break;
      }
    }
    onClick(e) {
      const item = e.target.closest('[role="treeitem"]');
      if (item) item.focus();
    }
  });

  customElements.define('site-sidebar', class extends HTMLElement {
    connectedCallback() {
      const toggleBtn = this.querySelector('[data-menu-toggle]');
      const indicator = toggleBtn?.querySelector('toggle-indicator');
      const overlay = this.querySelector('[data-sidebar-overlay]');

      const setOpen = (open) => {
        this.toggleAttribute('open', open);
        toggleBtn?.setAttribute('aria-expanded', String(open));
        indicator?.toggleAttribute('open', open);
      };

      toggleBtn?.addEventListener('click', () => setOpen(!this.hasAttribute('open')));
      overlay?.addEventListener('click', () => setOpen(false));
      this.addEventListener('click', (e) => {
        if (e.target.closest('.sidebar a, .sidebar button.nav-item')) {
          setOpen(false);
        }
      });
    }
  });


  /* ==========================================================================
     7. Authentic Virtual Portfolio Files Registry (Verified Repositories)
     ========================================================================== */
  const VIRTUAL_FILES = {
    // ------------------------------------------------------------------------
    // ABOUT
    // ------------------------------------------------------------------------
    'about/README.md': {
      title: 'README.md',
      folder: 'about',
      render: function() {
        return `
<h1>Alexander Jameson</h1>
<p style="color: var(--color-green); margin-bottom: 1rem;">
  ~ founder @ cesure · ML safety researcher &amp; student pilot
</p>

<p>
  I am an independent ML safety researcher and the Founder &amp; Lead Researcher at <strong>Cesure</strong>, a fiscally sponsored 501(c)(3) nonprofit research lab advancing empirical AI safety through mechanistic interpretability, sparse autoencoders (SAEs), and latent space steerability.
</p>

<p>
  My technical work spans formal mathematical verification in <strong>Lean 4</strong>, low-level fluid dynamics simulations in <strong>C &amp; OpenGL</strong>, AI-native operating systems from scratch (<strong>SomaOS</strong>), and autonomous robotics. Outside the terminal, I am an <strong>FAA Student Pilot</strong> logging flight hours toward my Private Pilot Certificate (expected Summer 2026), a squad and section leader in my high school marching band and wind ensemble, an auditionee for the <strong>Mandarins Drum &amp; Bugle Corps</strong> (DCI), and a hackathon director.
</p>

<p style="margin: 1.5rem 0;">
  <a href="#projects/SomaOS.c" class="button" style="--link-color: var(--color-green); margin-right: 1ch;">
    <span class="button-inner"><span class="button-icon" aria-hidden="true">󰈙</span>explore-projects</span>
  </a>
  <a href="#research/cesure_sae.md" class="button" style="--link-color: var(--color-yellow); margin-right: 1ch;">
    <span class="button-inner"><span class="button-icon" aria-hidden="true">󰈙</span>view-research</span>
  </a>
  <a href="#about/resume.txt" class="button" style="--link-color: var(--color-blue); margin-right: 1ch;">
    <span class="button-inner"><span class="button-icon" aria-hidden="true">󰈙</span>view-resume</span>
  </a>
  <button type="button" class="button" id="doc-copy-email" style="--link-color: var(--color-purple);">
    <span class="button-inner"><span class="button-icon" aria-hidden="true">󰧫</span>copy-email</span>
  </button>
</p>

<h2>Featured Engineering &amp; Research Repositories</h2>
<ul>
  <li><strong>SomaOS:</strong> AI-native operating system built from scratch in C with custom memory paging, hardware interrupts, and PIT/PMM drivers (<a href="https://github.com/pyGuy152/SomaOS" target="_blank" rel="noopener noreferrer">pyGuy152/SomaOS ↗</a>). Features the embedded <strong>Soir-MoE</strong> neural subsystem built in-repo under <a href="https://github.com/pyGuy152/SomaOS/tree/main/Soir-MoE" target="_blank" rel="noopener noreferrer"><code>SomaOS/Soir-MoE</code> ↗</a> implementing low-latency pure C attention mechanisms (<code>attention.c</code>) directly for the OS kernel.</li>
  <li><strong>APEX SRAM SEU Detector:</strong> Cosmic radiation single-event upset telemetry and memory scrubber for aerospace deployment (<a href="https://github.com/machonach/APEX-SRAM-SEU-Detector" target="_blank" rel="noopener noreferrer">machonach/APEX-SRAM-SEU-Detector ↗</a>).</li>
  <li><strong>Navier-Stokes Simulation:</strong> Real-time 2D incompressible fluid dynamics and NACA airfoil stall solver in C/GLSL (<a href="https://github.com/Solus-QE/aerodynamics_graphics" target="_blank" rel="noopener noreferrer">Solus-QE/aerodynamics_graphics ↗</a>).</li>
  <li><strong>MathDiff:</strong> Formal verification of reverse-mode automatic differentiation in Lean 4 with mathlib4 (<a href="https://github.com/Solus-QE/MathDiff" target="_blank" rel="noopener noreferrer">Solus-QE/MathDiff ↗</a>).</li>
  <li><strong>LiRover:</strong> Autonomous RC car with LiDAR 3D SLAM mapping built for Hack Club Stardance (<a href="https://github.com/superyeetyash/LiRover" target="_blank" rel="noopener noreferrer">superyeetyash/LiRover ↗</a>).</li>
  <li><strong>Aperture 3D Engine:</strong> Kinematic physics controller, slide/sprint mechanics, and mouse look in Godot (<a href="https://github.com/Solus-QE/Aperture" target="_blank" rel="noopener noreferrer">Solus-QE/Aperture ↗</a>).</li>
  <li><strong>EvalEval Coalition:</strong> Comprehensive survey and benchmark suite of 400+ evaluations across foundation models (<a href="https://github.com/evaleval/every_eval_ever" target="_blank" rel="noopener noreferrer">evaleval/every_eval_ever ↗</a>; PR #249; arXiv:2606.14516).</li>
  <li><strong>Reward-Informed SAEs:</strong> Co-authored "Reward-Informed Sparse Autoencoders and the Solution-Completeness Confound" (<a href="https://arxiv.org/abs/2608.26136" target="_blank" rel="noopener noreferrer">arXiv:2608.26136 ↗</a>) presented at the New England Mechanistic Interpretability Workshop (NEMI 2025).</li>
  <li><strong>Clinical Neuroimaging:</strong> Co-authored "Cross-Site Generalization of Deep EEG Representations for Early Parkinson's Detection" accepted to AMAI @ <strong>MICCAI 2026</strong> (<a href="https://sjji-eeg.exe.xyz" target="_blank" rel="noopener noreferrer">sjji-eeg.exe.xyz ↗</a>).</li>
</ul>
`;
      }
    },

    'about/resume.txt': {
      title: 'resume.txt',
      folder: 'about',
      render: function() {
        return `
<pre class="astro-code"><code>================================================================================
ALEXANDER JAMESON
alex@cesure.xyz | https://github.com/Solus-QE
Greater Chicago Area
================================================================================

[COURSEWORK & FOUNDATIONS]
* Relevant Coursework: AP Computer Science A (5), AP Calculus BC (5),
  AP Physics C, AP Chemistry, AP Statistics, Discrete Math, Differential Equations

[EXPERIENCE & RESEARCH]
* Founder & Lead Researcher | Cesure (Dec 2024 – Present)
  - Direct an independent research lab advancing empirical AI safety through
    mechanistic interpretability and sparse autoencoders (SAEs).
  - Lead an 8-person team investigating failure modes in frontier reasoning
    models (chain-of-thought faithfulness, latent space steerability).
  - Manage compute clusters and authored open-source benchmarks (GaslightingAI).

* Co-Author & Researcher | NEMI 2025 (New England Mechanistic Interpretability Workshop)
  - Co-authored "Reward-Informed Sparse Autoencoders and the Solution-Completeness
    Confound" (arXiv:2608.26136) with Tanvi Nagilla, Daniel Manta, and Shayaan Uddin.
  - Investigated JumpReLU SAEs trained on GRPO reasoning trajectories in Llama-3.1-8B,
    isolating why naive reward-informed dictionaries latch onto superficial completion
    form (closed reasoning blocks, boxed answers, length) rather than genuine reasoning.
  - Presented research at the New England Mechanistic Interpretability (NEMI) Workshop 2025.

* Research Contributor | EvalEval Coalition (Feb 2025 – Present)
  - Contributed to evaleval/every_eval_ever (PR #249), a unified repository of
    400+ evaluation benchmarks across foundation models.
  - Co-author on collaborative benchmark survey paper (arXiv:2606.14516).
  - Implemented evaluation cards and automated testing pipelines for frontier
    model capability analysis.

* Co-Author | AMAI Workshop @ MICCAI 2026 (Sep 2025 – Present)
  - Co-authored "Cross-Site Generalization of Deep EEG Representations for Early
    Parkinson's Detection" accepted to AMAI @ MICCAI 2026.
  - Contributed to edward-lcl/sjji-eeg (PRs #5, #6, #7, #8); built team
    benchmark dashboard https://sjji-eeg.exe.xyz.

* Invited Peer Reviewer | ACL 2026 & COLM 2026 (2025 – Present)
  - Invited reviewer for peer-reviewed submissions on mechanistic interpretability,
    representation engineering, and LLM safety.

* Lead Organizer | Planet Hacks (Jan 2025 – Present)
  - Founded and directed Chicagoland's premier sustainability hackathon;
    raised $18,000+ in corporate sponsor funding.
  - Hosted 200+ students from 30+ schools with workshops in hardware, AI,
    and environmental technology.

* Lead Organizer | Hack Club Stardance (Jul 2025)
  - Co-organized 4-day hacker gathering in Lake Tahoe, CA for 40 top teenage
    engineers; managed logistics, budgets, and hardware workshops.

* QA Engineering Intern | ArcSoft, Fremont, CA (Jun 2024 – Aug 2024)
  - Validated low-light computer vision SDKs across 12+ embedded hardware platforms.
  - Built automated testing pipelines in Python reducing regression validation
    time by 35%.

* Outside Operations Assistant | KemperSports / The Glen Club (May 2024 – Aug 2025)
  - Managed tournament logistics and guest operations for prestigious Tom Fazio-
    designed championship golf facility in Glenview, IL.

[TECHNICAL REPOSITORIES]
* SomaOS.c & soir_moe.c: AI-native Operating System written from scratch in C
  with custom GDT/IDT/PIT/PMM kernel architecture (pyGuy152/SomaOS); features
  the embedded Soir-MoE subsystem (SomaOS/Soir-MoE) implementing pure C scaled
  dot-product attention designed as the kernel's low-latency neural engine.
* apex_sram_seu.py: Cosmic radiation Single-Event Upset detector & telemetry
  system for high-altitude aerospace testing (machonach/APEX-SRAM-SEU-Detector).
* aerodynamics_graphics.c: Real-time 2D Navier-Stokes fluid dynamics and
  aerodynamics simulation engine in C/OpenGL/GLSL modeling NACA 0012 airfoils.
* MathDiff.lean: Formal verification and automated differentiation engine in
  Lean 4, formalizing calculus rules and proving computational graph correctness.
* lirover_slam.cpp: Autonomous RC rover with LiDAR 3D SLAM mapping built for
  Hack Club Stardance (superyeetyash/LiRover & Solus-QE/Liros).
* aperture.gd: 3D first-person kinematic movement controller with sliding,
  crouching, and lerp inertia tensors in Godot (Solus-QE/Aperture).
* curv.ts: Motorcycle navigation engine optimizing for maximum road curvature
  and scenic twisties using OpenStreetMap highway geometry and PostGIS.
* weave.luau: High-performance motorcycle lane-splitting simulation game built
  with Luau and Roblox engine physics.
* mitr_eval.ipynb: Mechanistic Interpretability Trust & Robustness evaluation
  suite probing internal model circuits with TransformerLens.
* opensauce_arcade.cpp: Duck Hunt Reaction Arcade interactive physical game
  built for OpenSauce 2026 (superyeetyash/OpenSauce2026).

[LEADERSHIP & ACTIVITIES]
* FAA Student Pilot Certificate (Solo Endorsement in Progress; logged hours in
  Piper Archer II PA-28-181; FAA Airman Written Knowledge Exam: 96%).
* High School Marching Band: Squad Leader & Section Leader (2+ years leading
  brass rehearsal blocks, field drill precision, and visual execution).
* School Wind Ensemble & Pep Band: Performer across symphonic repertoire,
  advanced wind literature, and multi-year athletic pep band performances.
* Raiders Drum & Bugle Corps: Accepted into corps for competitive DCI season.
* Mandarins Drum & Bugle Corps: Currently auditioning for DCI World Class corps.
* jazz ensemble 2026?
* Hackathons & Competitive Honors: GenAI Genesis 2x Finalist (2025, 2026);
  Yale YQuantum Finalist; Regional Hackathon 1st Place Overall; Scrapyard 2nd Place.
</code></pre>
`;
      }
    },

    // ------------------------------------------------------------------------
    // RESEARCH
    // ------------------------------------------------------------------------
    'research/cesure_sae.md': {
      title: 'cesure_sae.md',
      folder: 'research',
      render: function() {
        return `
<h2>Cesure: Mechanistic Interpretability &amp; Sparse Autoencoders</h2>
<p>
  <strong>Lead Researcher</strong> · Cesure AI Safety Lab (2025 – Present)<br>
  Live Research Tool: <a href="https://gaslight.cesure.xyz" target="_blank" rel="noopener noreferrer">https://gaslight.cesure.xyz ↗</a><br>
  Repository: <a href="https://github.com/Solus-QE/GaslightingAI" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/GaslightingAI ↗</a>
</p>

<p>
  Investigating deceptive reasoning and sycophancy in frontier reasoning models. By training <em>k</em>-sparse autoencoders (TopK and JumpReLU SAEs) on residual stream activations, we isolate mono-semantic feature latents corresponding to epistemic confidence, user deference, and strategic hallucination.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)"># PyTorch TopK Sparse Autoencoder for Residual Stream Decomposition</span>
<span style="color:var(--astro-code-token-keyword)">import</span> torch
<span style="color:var(--astro-code-token-keyword)">import</span> torch.nn <span style="color:var(--astro-code-token-keyword)">as</span> nn

<span style="color:var(--astro-code-token-keyword)">class</span> <span style="color:var(--astro-code-token-function)">TopKSparseAutoencoder</span>(nn.Module):
    <span style="color:var(--astro-code-token-keyword)">def</span> <span style="color:var(--astro-code-token-function)">__init__</span>(self, d_model: int, d_sae: int, k: int):
        super().<span style="color:var(--astro-code-token-function)">__init__</span>()
        self.d_model = d_model
        self.d_sae = d_sae
        self.k = k

        self.W_enc = nn.Parameter(torch.empty(d_model, d_sae))
        self.b_enc = nn.Parameter(torch.zeros(d_sae))
        self.W_dec = nn.Parameter(torch.empty(d_sae, d_model))
        self.b_dec = nn.Parameter(torch.zeros(d_model))

        nn.init.kaiming_uniform_(self.W_enc)
        nn.init.kaiming_uniform_(self.W_dec)
        self.normalize_decoder()

    <span style="color:var(--astro-code-token-keyword)">def</span> <span style="color:var(--astro-code-token-function)">normalize_decoder</span>(self):
        with torch.no_grad():
            self.W_dec.data = nn.functional.normalize(self.W_dec.data, dim=-1)

    <span style="color:var(--astro-code-token-keyword)">def</span> <span style="color:var(--astro-code-token-function)">forward</span>(self, x: torch.Tensor):
        x_cent = x - self.b_dec
        pre_acts = torch.relu(x_cent @ self.W_enc + self.b_enc)
        
        <span style="color:var(--astro-code-token-comment)"># Enforce exact k-sparsity</span>
        topk_vals, topk_indices = torch.topk(pre_acts, self.k, dim=-1)
        hidden = torch.zeros_like(pre_acts).scatter_(-1, topk_indices, topk_vals)
        
        reconstruction = hidden @ self.W_dec + self.b_dec
        mse_loss = nn.functional.mse_loss(reconstruction, x)
        <span style="color:var(--astro-code-token-keyword)">return</span> reconstruction, hidden, mse_loss
</code></pre>
`;
      }
    },

    'research/every_eval_ever.md': {
      title: 'every_eval_ever.md',
      folder: 'research',
      render: function() {
        return `
<h2>EvalEval Coalition: Unified Frontier Model Evaluation</h2>
<p>
  <strong>Research Contributor &amp; Author</strong> · EvalEval Coalition<br>
  Preprint: arXiv:2606.14516 [cs.CL]<br>
  Upstream Repository: <a href="https://github.com/evaleval/every_eval_ever" target="_blank" rel="noopener noreferrer">https://github.com/evaleval/every_eval_ever ↗</a><br>
  Contribution Fork: <a href="https://github.com/Solus-QE/every_eval_ever" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/every_eval_ever (PR #249) ↗</a>
</p>

<p>
  The EvalEval Coalition is a collaborative initiative across academic labs and industry institutions standardizing the fragmented landscape of AI evaluation. The repository catalogues and implements over 400+ evaluation benchmarks across reasoning, coding, math, agentic execution, and alignment.
</p>

<h3>Contributions</h3>
<ul>
  <li>Authored standardized benchmark scorecard architecture (PR #249) standardizing multi-modal evaluation metrics into normalized radar profiles.</li>
  <li>Built automated validation harnesses for frontier models across difficult out-of-distribution reasoning benchmarks (AIME, GPQA Diamond, SWE-bench Verified).</li>
  <li>Co-authored the collaborative survey paper analyzing benchmark saturation, contamination detection, and human verification fidelity.</li>
</ul>
`;
      }
    },

    'research/eeg_parkinsons_miccai.md': {
      title: 'eeg_parkinsons_miccai.md',
      folder: 'research',
      render: function() {
        return `
<h2>Cross-Site Generalization of Deep EEG for Early Parkinson's</h2>
<p>
  <strong>Co-Author</strong> · Applied Multimodal Artificial Intelligence (AMAI) @ <strong>MICCAI 2026</strong><br>
  Repository: <a href="https://github.com/edward-lcl/sjji-eeg" target="_blank" rel="noopener noreferrer">https://github.com/edward-lcl/sjji-eeg (PRs #5, #6, #7, #8) ↗</a><br>
  Interactive Dashboard: <a href="https://sjji-eeg.exe.xyz" target="_blank" rel="noopener noreferrer">https://sjji-eeg.exe.xyz ↗</a>
</p>

<p>
  Accepted to the AMAI workshop at the 29th International Conference on Medical Image Computing and Computer Assisted Intervention (MICCAI 2026). This paper investigates domain-invariant feature extraction from multi-channel resting-state EEG signals to detect prodromal Parkinson's Disease biomarkers across heterogeneous medical center acquisition protocols.
</p>
`;
      }
    },

    'research/reward_informed_sae_nemi.md': {
      title: 'reward_informed_sae_nemi.md',
      folder: 'research',
      render: function() {
        return `
<h2>Reward-Informed Sparse Autoencoders &amp; Solution-Completeness Confound</h2>
<p>
  <strong>Co-Author</strong> · New England Mechanistic Interpretability Workshop (NEMI 2025)<br>
  Authors: Tanvi Nagilla, Alexander Jameson, Daniel Manta, Shayaan Uddin<br>
  Preprint: <a href="https://arxiv.org/abs/2608.26136" target="_blank" rel="noopener noreferrer">arXiv:2608.26136 ↗</a> &nbsp;|&nbsp; <a href="https://arxiv.org/pdf/2608.26136" target="_blank" rel="noopener noreferrer">Download PDF ↗</a>
</p>

<p>
  Sparse autoencoders (SAEs) decompose language model activations into sparse, interpretable features. An intuitive method to direct dictionaries toward reasoning circuits is to curate training activations using reinforcement learning reward signals—specifically Group Relative Policy Optimization (GRPO) rollouts partitioned into high-reward ("good") and low-reward ("bad") reasoning continuations.
</p>

<h3>The Initial Signal vs. The Confound ("Why It Sucks Now")</h3>
<p>
  We trained a standard JumpReLU SAE (16,384 features) on Llama-3.1-8B activations across these partitioned GRPO trajectories. A sparse subset of features appeared to separate the classes with a striking silhouette score of <strong>0.79</strong> (compared to 0.005 for the full dictionary, while a generic reward-blind SAE showed a baseline silhouette of only 0.01).
</p>
<p>
  However, a rigorous control battery demonstrated that this separation was driven almost entirely by superficial <strong>solution completeness form</strong> rather than genuine reasoning quality:
</p>
<ul>
  <li><strong>Shallow TF-IDF Baseline:</strong> A linear text classifier on token n-grams achieved an AUC of <strong>0.75–0.83</strong>, matching the predictive separation without inspecting latent activations.</li>
  <li><strong>Three Structural Formatting Cues Alone:</strong> Tracking just three surface features—response length, a closed <code>&lt;/think&gt;</code> block, and a LaTeX <code>\\boxed{}</code> answer—achieved an AUC of <strong>0.70</strong> (99% of high-reward completions were boxed versus only 69% of low-reward completions).</li>
  <li><strong>In-Sample Fitting:</strong> The 0.79 silhouette was in-sample fitting of formatting compliance rather than mechanistic discovery of reasoning circuits.</li>
</ul>

<p>
  Two discriminative features remained readable (symbolic mathematical notation and procedural/evaluative syntax), which illustrate formatting markers rather than isolated reasoning circuits. We published the recipe together with its control battery as a cautionary benchmark for the interpretability community against confounds in curated SAE data.
</p>

<pre class="astro-code"><code><span class="token comment"># Control battery evaluation from arXiv:2608.26136 (NEMI 2025)</span>
<span class="token keyword">from</span> sklearn.metrics <span class="token keyword">import</span> roc_auc_score
<span class="token keyword">from</span> sklearn.feature_extraction.text <span class="token keyword">import</span> TfidfVectorizer

<span class="token comment"># Control 1: Surface structural heuristics [length, closed_think_tag, boxed_answer]</span>
<span class="token comment"># (99% of high-reward completions boxed vs 69% of low-reward completions)</span>
auc_structural = roc_auc_score(y_true, structural_cue_matrix)   <span class="token comment"># AUC: ~0.70</span>

<span class="token comment"># Control 2: Linear bag-of-words text classifier</span>
X_tfidf = TfidfVectorizer().fit_transform(raw_completions)
auc_tfidf = roc_auc_score(y_true, probe.predict_proba(X_tfidf)[:, 1]) <span class="token comment"># AUC: 0.75-0.83</span>

<span class="token comment"># Finding: JumpReLU RI-SAE silhouette (0.79) predominantly reflects</span>
<span class="token comment"># solution completeness form rather than disentangled reasoning circuits.</span></code></pre>
`;
      }
    },

    'research/latent_space_nemi.md': {
      title: 'latent_space_nemi.md',
      folder: 'research',
      render: function() {
        return VIRTUAL_FILES['research/reward_informed_sae_nemi.md'].render();
      }
    },

    'research/peer_review_acl_colm.md': {
      title: 'peer_review_acl_colm.md',
      folder: 'research',
      render: function() {
        return `
<h2>Peer Review Service: ACL 2026 &amp; COLM 2026</h2>
<p>
  <strong>Invited Peer Reviewer</strong> · Association for Computational Linguistics (ACL) &amp; Conference on Language Modeling (COLM)
</p>

<p>
  Invited to serve as an academic peer reviewer evaluating manuscripts submitted to ACL 2026 and COLM 2026 tracks on mechanistic interpretability, sparse dictionary learning, adversarial jailbreak robustness, and empirical evaluation standards.
</p>
`;
      }
    },

    // ------------------------------------------------------------------------
    // PROJECTS & SYSTEMS (Verified GitHub Repositories)
    // ------------------------------------------------------------------------
    'projects/SomaOS.c': {
      title: 'SomaOS.c',
      folder: 'projects',
      render: function() {
        return `
<h2>SomaOS: AI-Native Operating System from Scratch</h2>
<p>
  <strong>Low-Level Systems &amp; Kernels</strong> · C, x86 Assembly &amp; Embedded Neural Engine<br>
  Operating System Repo: <a href="https://github.com/pyGuy152/SomaOS" target="_blank" rel="noopener noreferrer">https://github.com/pyGuy152/SomaOS ↗</a><br>
  Embedded Neural Subsystem: <a href="https://github.com/pyGuy152/SomaOS/tree/main/Soir-MoE" target="_blank" rel="noopener noreferrer">pyGuy152/SomaOS/Soir-MoE ↗</a><br>
  Live Web Boot: <a href="https://os.sarveshs.dev" target="_blank" rel="noopener noreferrer">https://os.sarveshs.dev ↗</a>
</p>

<p>
  An operating system built from scratch in C where AI is treated as an embedded subsystem directly integrated into the kernel architecture rather than a high-overhead user-space daemon. Features custom bootloader staging, protected-mode paging, physical memory management, and hardware interrupt handling.
</p>

<h3>Core Kernel Initialization</h3>
<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">/* Real kernel initialization code from SomaOS (kernel/kernel.c) */</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"gdt.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"idt.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"vga.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"pit.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"kprintf.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"string.h"</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> <span style="color:var(--astro-code-token-string)">"pmm.h"</span>

<span style="color:var(--astro-code-token-keyword)">void</span> <span style="color:var(--astro-code-token-function)">kernel_main</span>(<span style="color:var(--astro-code-token-keyword)">multiboot_info_t</span> *mboot_info)
{
	<span style="color:var(--astro-code-token-function)">vga_set_color</span>(<span style="color:var(--astro-code-token-function)">vga_entry_color</span>(VGA_COLOR_BLACK, VGA_COLOR_WHITE));
	<span style="color:var(--astro-code-token-function)">vga_clear</span>();

	<span style="color:var(--astro-code-token-function)">vga_write</span>(<span style="color:var(--astro-code-token-string)">"Welcome to SomaOS.\\n\\n"</span>);

	<span style="color:var(--astro-code-token-function)">gdt_init</span>();
	<span style="color:var(--astro-code-token-function)">vga_write</span>(<span style="color:var(--astro-code-token-string)">"GDT loaded\\n"</span>);

	<span style="color:var(--astro-code-token-function)">idt_init</span>();
	<span style="color:var(--astro-code-token-function)">vga_write</span>(<span style="color:var(--astro-code-token-string)">"IDT loaded (isr0, irq0, irq1)\\n"</span>);

	<span style="color:var(--astro-code-token-function)">pit_init</span>(100);
	<span style="color:var(--astro-code-token-function)">kprintf</span>(<span style="color:var(--astro-code-token-string)">"Initialized PIT at target frequency of %d\\n"</span>, 100);

	<span style="color:var(--astro-code-token-function)">pmm_init</span>(mboot_info);
	<span style="color:var(--astro-code-token-function)">kprintf</span>(<span style="color:var(--astro-code-token-string)">"Initialized PMM\\n Total memory: %dMB\\n"</span>, <span style="color:var(--astro-code-token-function)">pmm_get_total_frames</span>() / 256);

	<span style="color:var(--astro-code-token-function)">vga_write</span>(<span style="color:var(--astro-code-token-string)">"\\nKernel ready. Type \\\"help\\\" and press enter to see all commands\\n"</span>);

	<span style="color:var(--astro-code-token-keyword)">for</span> (;;)
		<span style="color:var(--astro-code-token-keyword)">__asm__ volatile</span> (<span style="color:var(--astro-code-token-string)">"hlt"</span>);
}
</code></pre>

<h3>Embedded Subsystem: Soir-MoE</h3>
<p>
  <strong><a href="#projects/soir_moe.py">Soir-MoE</a></strong> is located directly within the SomaOS repository (<code>SomaOS/Soir-MoE</code>), authored by Alex to explore embedding neural attention mechanisms directly into low-level operating system dispatch without third-party runtimes.
</p>
<ul>
  <li><strong>Pure C Implementation:</strong> Scaled dot-product attention implemented in pure C (<code>attention.c</code>) computing \(Q, K, V\), matrix multiplications, causal masking, and stable softmax.</li>
  <li><strong>Zero-Overhead Memory:</strong> Designed to run with deterministic memory bounds to optimize kernel-level task selection and memory page allocation.</li>
</ul>

<h3>Implemented Kernel Drivers</h3>
<ul>
  <li><strong>Global Descriptor Table (GDT):</strong> Sets up 32-bit x86 privilege levels (Ring 0 / Ring 3).</li>
  <li><strong>Interrupt Descriptor Table (IDT):</strong> Handles CPU exceptions (isr0) and hardware interrupts (irq0 PIT timer, irq1 keyboard).</li>
  <li><strong>Physical Memory Manager (PMM):</strong> Manages physical RAM via 4KB bitmap frame allocation.</li>
  <li><strong>VGA &amp; Custom kprintf:</strong> Direct memory-mapped framebuffer text driver and formatted terminal output.</li>
</ul>
`;
      }
    },

    'projects/apex_sram_seu.py': {
      title: 'apex_sram_seu.py',
      folder: 'projects',
      render: function() {
        return `
<h2>APEX: SRAM Single-Event Upset (SEU) Detector</h2>
<p>
  <strong>Aerospace Instrumentation &amp; Radiation Telemetry</strong> · Python, C &amp; Raspberry Pi Zero 2 W<br>
  Repository: <a href="https://github.com/machonach/APEX-SRAM-SEU-Detector" target="_blank" rel="noopener noreferrer">https://github.com/machonach/APEX-SRAM-SEU-Detector ↗</a>
</p>

<p>
  A comprehensive embedded flight telemetry system designed for <strong>APEX</strong> to detect, analyze, and predict Single Event Upsets (SEUs) in volatile SRAM memory caused by cosmic radiation and high-energy atmospheric particles during high-altitude aerospace flights.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)"># Real code from APEX-SRAM-SEU-Detector (high_altitude_mode.py)</span>
<span style="color:var(--astro-code-token-comment)"># High-Altitude Launch Configuration &amp; Near-Space Power Telemetry</span>
<span style="color:var(--astro-code-token-keyword)">import</span> os
<span style="color:var(--astro-code-token-keyword)">import</span> time
<span style="color:var(--astro-code-token-keyword)">import</span> logging

LAUNCH_CONFIG = {
    <span style="color:var(--astro-code-token-string)">"enable_wifi"</span>: <span style="color:var(--astro-code-token-constant)">False</span>,          <span style="color:var(--astro-code-token-comment)"># Disable WiFi to save power during flight</span>
    <span style="color:var(--astro-code-token-string)">"enable_led"</span>: <span style="color:var(--astro-code-token-constant)">True</span>,            <span style="color:var(--astro-code-token-comment)"># Keep LED enabled for status indication</span>
    <span style="color:var(--astro-code-token-string)">"sample_rate"</span>: <span style="color:var(--astro-code-token-constant)">1</span>,              <span style="color:var(--astro-code-token-comment)"># 1 Hz sample rate</span>
    <span style="color:var(--astro-code-token-string)">"log_interval"</span>: <span style="color:var(--astro-code-token-constant)">60</span>,            <span style="color:var(--astro-code-token-comment)"># Log every minute</span>
    <span style="color:var(--astro-code-token-string)">"gps_power_save"</span>: <span style="color:var(--astro-code-token-constant)">True</span>,        <span style="color:var(--astro-code-token-comment)"># Enable GPS power saving</span>
    <span style="color:var(--astro-code-token-string)">"max_altitude_feet"</span>: <span style="color:var(--astro-code-token-constant)">110000</span>,   <span style="color:var(--astro-code-token-comment)"># Expected maximum altitude (near space)</span>
    <span style="color:var(--astro-code-token-string)">"expected_flight_hours"</span>: <span style="color:var(--astro-code-token-constant)">3</span>,    <span style="color:var(--astro-code-token-comment)"># Expected flight duration</span>
    <span style="color:var(--astro-code-token-string)">"wifi_recovery_mode"</span>: <span style="color:var(--astro-code-token-constant)">True</span>,    <span style="color:var(--astro-code-token-comment)"># Enable WiFi periodically during descent for recovery</span>
    <span style="color:var(--astro-code-token-string)">"wifi_check_interval_min"</span>: <span style="color:var(--astro-code-token-constant)">15</span>, <span style="color:var(--astro-code-token-comment)"># Check for ground WiFi every 15 minutes during descent</span>
}

<span style="color:var(--astro-code-token-keyword)">def</span> <span style="color:var(--astro-code-token-function)">enable_launch_mode</span>(config=None, enable_autostart=False):
    <span style="color:var(--astro-code-token-string)">"""Enable launch mode for high-altitude flight"""</span>
    <span style="color:var(--astro-code-token-keyword)">if</span> config <span style="color:var(--astro-code-token-keyword)">is</span> None:
        config = LAUNCH_CONFIG
    
    <span style="color:var(--astro-code-token-comment)"># Disable unneeded RF radios to conserve battery at -50C</span>
    <span style="color:var(--astro-code-token-keyword)">if</span> <span style="color:var(--astro-code-token-keyword)">not</span> config[<span style="color:var(--astro-code-token-string)">"enable_wifi"</span>]:
        os.system(<span style="color:var(--astro-code-token-string)">"rfkill block wifi"</span>)
        
    <span style="color:var(--astro-code-token-comment)"># Disable HDMI hardware on Pi Zero 2 W to minimize current draw</span>
    os.system(<span style="color:var(--astro-code-token-string)">"/usr/bin/tvservice -o"</span>)
    
    <span style="color:var(--astro-code-token-keyword)">with</span> open(<span style="color:var(--astro-code-token-string)">"/tmp/seu_launch_mode"</span>, <span style="color:var(--astro-code-token-string)">"w"</span>) <span style="color:var(--astro-code-token-keyword)">as</span> f:
        f.write(str(time.time()))
</code></pre>

<h3>System Hardware Components</h3>
<ul>
  <li>Raspberry Pi Zero 2 W central controller interfacing multi-megabit volatile SRAM test chips.</li>
  <li>Environmental sensor array logging temperature, barometric altitude, and GPS coordinates.</li>
  <li>Calculates real-time SEU cross-sections and correlates bit-flip frequencies against altitude and cosmic ray flux.</li>
</ul>
`;
      }
    },

    'projects/aerodynamics_graphics.c': {
      title: 'aerodynamics_graphics.c',
      folder: 'projects',
      render: function() {
        return `
<h2>Aerodynamics &amp; Navier-Stokes Simulation in C</h2>
<p>
  <strong>Low-Level Systems &amp; Graphics</strong> · C, OpenGL &amp; Custom GLSL Shaders<br>
  Repository: <a href="https://github.com/Solus-QE/aerodynamics_graphics" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/aerodynamics_graphics ↗</a>
</p>

<p>
  A high-performance 2D Eulerian fluid dynamics and aerodynamics simulation engine written from scratch in pure C with OpenGL shader acceleration. Implements the incompressible Navier-Stokes momentum equations with boundary layer separation over NACA 4-digit airfoil profiles.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">/* Incompressible Navier-Stokes Momentum & NACA 0012 Airfoil Geometry */</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;stdio.h&gt;
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;stdlib.h&gt;
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;math.h&gt;
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;GL/gl.h&gt;

<span style="color:var(--astro-code-token-keyword)">typedef struct</span> {
    <span style="color:var(--astro-code-token-function)">float</span> u, v;       <span style="color:var(--astro-code-token-comment)">/* Velocity field vector */</span>
    <span style="color:var(--astro-code-token-function)">float</span> u_prev, v_prev;
    <span style="color:var(--astro-code-token-function)">float</span> p;          <span style="color:var(--astro-code-token-comment)">/* Pressure Poisson solution */</span>
    <span style="color:var(--astro-code-token-function)">float</span> div;        <span style="color:var(--astro-code-token-comment)">/* Velocity divergence ∇·u */</span>
    <span style="color:var(--astro-code-token-function)">int</span>   is_solid;
} FluidGridCell;

<span style="color:var(--astro-code-token-comment)">/* Evaluates NACA 0012 symmetrical airfoil half-thickness */</span>
<span style="color:var(--astro-code-token-function)">float</span> evaluate_naca_0012(<span style="color:var(--astro-code-token-function)">float</span> x_chord) {
    <span style="color:var(--astro-code-token-function)">const float</span> t = 0.12f;
    <span style="color:var(--astro-code-token-keyword)">if</span> (x_chord &lt; 0.0f || x_chord &gt; 1.0f) <span style="color:var(--astro-code-token-keyword)">return</span> 0.0f;
    <span style="color:var(--astro-code-token-keyword)">return</span> 5.0f * t * (
        0.2969f * sqrtf(x_chord) -
        0.1260f * x_chord -
        0.3516f * powf(x_chord, 2.0f) +
        0.2843f * powf(x_chord, 3.0f) -
        0.1015f * powf(x_chord, 4.0f)
    );
}
</code></pre>
`;
      }
    },

    'projects/MathDiff.lean': {
      title: 'MathDiff.lean',
      folder: 'projects',
      render: function() {
        return `
<h2>MathDiff: Formal Verification &amp; Auto-Diff in Lean 4</h2>
<p>
  <strong>Formal Methods &amp; Theorem Proving</strong> · Lean 4 &amp; Mathlib4<br>
  Repository: <a href="https://github.com/Solus-QE/MathDiff" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/MathDiff ↗</a>
</p>

<p>
  A formal verification engine in <strong>Lean 4</strong> proving the algebraic correctness of reverse-mode automatic differentiation and computational graph simplifications. Bridges deep learning gradient descent engines with proof assistant verified foundations.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">-- Formal Verification of Dual Numbers and Automatic Differentiation</span>
<span style="color:var(--astro-code-token-keyword)">import</span> Mathlib.Analysis.Calculus.Deriv.Basic

<span style="color:var(--astro-code-token-keyword)">structure</span> <span style="color:var(--astro-code-token-function)">Dual</span> (<span style="color:var(--astro-code-token-keyword)">α</span> : <span style="color:var(--astro-code-token-keyword)">Type</span>) [<span style="color:var(--astro-code-token-keyword)">CommRing</span> <span style="color:var(--astro-code-token-keyword)">α</span>] <span style="color:var(--astro-code-token-keyword)">where</span>
  val : <span style="color:var(--astro-code-token-keyword)">α</span>
  eps : <span style="color:var(--astro-code-token-keyword)">α</span>

<span style="color:var(--astro-code-token-keyword)">namespace</span> <span style="color:var(--astro-code-token-function)">Dual</span>
<span style="color:var(--astro-code-token-keyword)">variable</span> {<span style="color:var(--astro-code-token-keyword)">α</span> : <span style="color:var(--astro-code-token-keyword)">Type</span>} [<span style="color:var(--astro-code-token-keyword)">CommRing</span> <span style="color:var(--astro-code-token-keyword)">α</span>]

<span style="color:var(--astro-code-token-keyword)">instance</span> : <span style="color:var(--astro-code-token-keyword)">Mul</span> (<span style="color:var(--astro-code-token-function)">Dual</span> <span style="color:var(--astro-code-token-keyword)">α</span>) <span style="color:var(--astro-code-token-keyword)">where</span>
  mul a b := &lang; a.val * b.val, a.val * b.eps + a.eps * b.val &rang;

<span style="color:var(--astro-code-token-keyword)">theorem</span> <span style="color:var(--astro-code-token-function)">dual_product_rule</span> (a b : <span style="color:var(--astro-code-token-function)">Dual</span> <span style="color:var(--astro-code-token-keyword)">α</span>) :
    (a * b).eps = a.val * b.eps + a.eps * b.val := <span style="color:var(--astro-code-token-keyword)">by</span>
  rfl
<span style="color:var(--astro-code-token-keyword)">end</span> <span style="color:var(--astro-code-token-function)">Dual</span>
</code></pre>
`;
      }
    },

    'projects/lirover_slam.cpp': {
      title: 'lirover_slam.cpp',
      folder: 'projects',
      render: function() {
        return `
<h2>LiRover: Autonomous LiDAR 3D SLAM Vehicle</h2>
<p>
  <strong>Autonomous Robotics &amp; Embedded Systems</strong> · C++, ROS &amp; Hardware Interfacing<br>
  Repositories: <a href="https://github.com/superyeetyash/LiRover" target="_blank" rel="noopener noreferrer">superyeetyash/LiRover ↗</a> · <a href="https://github.com/Solus-QE/Liros" target="_blank" rel="noopener noreferrer">Solus-QE/Liros ↗</a>
</p>

<p>
  Built for Hack Club's Stardance event in Lake Tahoe. LiRover is a high-speed autonomous RC rover equipped with a 360-degree LiDAR sensor and inertial measurement unit (IMU) capable of generating real-time 3D spatial occupancy grids and point cloud maps across outdoor alpine terrain.
</p>

<h3>Features</h3>
<ul>
  <li>Real-time iterative closest point (ICP) point cloud registration running on onboard companion SBC.</li>
  <li>Autonomous obstacle avoidance and path planning using A* on 2D costmaps.</li>
  <li>Custom motor controller firmware and telemetry streaming over low-latency Wi-Fi.</li>
</ul>
`;
      }
    },

    'projects/soir_moe.py': {
      title: 'soir_moe.c',
      folder: 'projects',
      render: function() {
        return `
<h2>Soir-MoE: Embedded Neural Subsystem in SomaOS</h2>
<p>
  <strong>Kernel AI &amp; Pure C Attention Engine</strong> · C &amp; Numerical Matrix Computing<br>
  Subsystem Location: <a href="https://github.com/pyGuy152/SomaOS/tree/main/Soir-MoE" target="_blank" rel="noopener noreferrer">pyGuy152/SomaOS/Soir-MoE ↗</a> (path: <code>SomaOS/Soir-MoE</code>)<br>
  Parent OS Repository: <a href="https://github.com/pyGuy152/SomaOS" target="_blank" rel="noopener noreferrer">https://github.com/pyGuy152/SomaOS ↗</a>
</p>

<p>
  <strong>Soir-MoE is located directly inside the SomaOS operating system repository</strong> (<code>SomaOS/Soir-MoE</code>), authored by Alex to explore embedding neural attention mechanisms directly into low-level operating system dispatch without third-party runtimes.
</p>

<p>
  To achieve predictable, microsecond execution without heavy third-party runtimes, the attention mechanism is implemented entirely in standard C (<code>attention.c</code>), calculating query/key/value projections, scaled dot-product attention scores (\(S_{\\text{scaled}} = \\frac{QK^T}{\\sqrt{d_k}}\)), causal lower-triangular masking, numerically stable softmax with max subtraction, and context value projection.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">/* Real C attention engine from SomaOS/Soir-MoE/attention.c (authored by Alex) */</span>
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;stdio.h&gt;
<span style="color:var(--astro-code-token-keyword)">#include</span> &lt;math.h&gt;

<span style="color:var(--astro-code-token-keyword)">#define</span> T 3 <span style="color:var(--astro-code-token-comment)">/* tokens */</span>
<span style="color:var(--astro-code-token-keyword)">#define</span> D 2 <span style="color:var(--astro-code-token-comment)">/* dimensions */</span>

<span style="color:var(--astro-code-token-keyword)">int</span> <span style="color:var(--astro-code-token-function)">main</span>(<span style="color:var(--astro-code-token-keyword)">void</span>) {
    <span style="color:var(--astro-code-token-function)">float</span> X[T][D] = { <span style="color:var(--astro-code-token-comment)">/* token representations */</span>
        {1.0f, 2.0f},
        {3.0f, 4.0f},
        {5.0f, 6.0f}
    };

    <span style="color:var(--astro-code-token-function)">float</span> W_Q[2][2] = { {0.1f, 0.0f}, {0.0f, 0.1f} }; <span style="color:var(--astro-code-token-comment)">/* query weights */</span>
    <span style="color:var(--astro-code-token-function)">float</span> W_K[2][2] = { {0.1f, 0.0f}, {0.0f, 0.1f} }; <span style="color:var(--astro-code-token-comment)">/* key weights */</span>
    <span style="color:var(--astro-code-token-function)">float</span> W_V[2][2] = { {1.0f, 0.0f}, {2.0f, 1.0f} }; <span style="color:var(--astro-code-token-comment)">/* value weights */</span>

    <span style="color:var(--astro-code-token-function)">float</span> Q[3][2];         <span style="color:var(--astro-code-token-comment)">/* query vectors */</span>
    <span style="color:var(--astro-code-token-function)">float</span> K[3][2];         <span style="color:var(--astro-code-token-comment)">/* key vectors */</span>
    <span style="color:var(--astro-code-token-function)">float</span> V[3][2];         <span style="color:var(--astro-code-token-comment)">/* value vectors */</span>
    <span style="color:var(--astro-code-token-function)">float</span> S[3][3];         <span style="color:var(--astro-code-token-comment)">/* attention score matrix QK^T */</span>
    <span style="color:var(--astro-code-token-function)">float</span> S_scaled[3][3];  <span style="color:var(--astro-code-token-comment)">/* scaled masked attention scores */</span>
    <span style="color:var(--astro-code-token-function)">float</span> A[3][3];         <span style="color:var(--astro-code-token-comment)">/* softmax attention weights */</span>
    <span style="color:var(--astro-code-token-function)">float</span> O[3][2];         <span style="color:var(--astro-code-token-comment)">/* attention context output vectors */</span>

    <span style="color:var(--astro-code-token-comment)">/* Q = X * W_Q */</span>
    <span style="color:var(--astro-code-token-keyword)">for</span> (size_t i = 0; i &lt; T; i++) {
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; D; j++) {
            <span style="color:var(--astro-code-token-function)">float</span> sum = 0;
            <span style="color:var(--astro-code-token-keyword)">for</span> (size_t k = 0; k &lt; D; k++) sum += X[i][k] * W_Q[k][j];
            Q[i][j] = sum;
        }
    }

    <span style="color:var(--astro-code-token-comment)">/* S = Q * K^T */</span>
    <span style="color:var(--astro-code-token-keyword)">for</span> (size_t i = 0; i &lt; T; i++) {
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; T; j++) {
            <span style="color:var(--astro-code-token-function)">float</span> sum = 0;
            <span style="color:var(--astro-code-token-keyword)">for</span> (size_t k = 0; k &lt; D; k++) sum += Q[i][k] * K[j][k];
            S[i][j] = sum;
        }
    }

    <span style="color:var(--astro-code-token-comment)">/* Scaled attention scores S / sqrt(d_k) with causal masking */</span>
    <span style="color:var(--astro-code-token-function)">float</span> d_k = (<span style="color:var(--astro-code-token-function)">float</span>)D;
    <span style="color:var(--astro-code-token-keyword)">for</span> (size_t i = 0; i &lt; T; i++) {
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; T; j++) {
            S_scaled[i][j] = (j &gt; i) ? -INFINITY : (S[i][j] / sqrtf(d_k));
        }
    }

    <span style="color:var(--astro-code-token-comment)">/* Numerically stable softmax */</span>
    <span style="color:var(--astro-code-token-keyword)">for</span> (size_t i = 0; i &lt; T; i++) {
        <span style="color:var(--astro-code-token-function)">float</span> max = S_scaled[i][0];
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 1; j &lt; T; j++) {
            <span style="color:var(--astro-code-token-keyword)">if</span> (S_scaled[i][j] &gt; max) max = S_scaled[i][j];
        }
        <span style="color:var(--astro-code-token-function)">float</span> sum = 0;
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; T; j++) {
            <span style="color:var(--astro-code-token-function)">float</span> exp_pos = expf(S_scaled[i][j] - max);
            sum += exp_pos;
            A[i][j] = exp_pos;
        }
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; T; j++) A[i][j] /= sum;
    }

    <span style="color:var(--astro-code-token-comment)">/* O = A * V context vectors */</span>
    <span style="color:var(--astro-code-token-keyword)">for</span> (size_t i = 0; i &lt; T; i++) {
        <span style="color:var(--astro-code-token-keyword)">for</span> (size_t j = 0; j &lt; D; j++) {
            <span style="color:var(--astro-code-token-function)">float</span> sum = 0;
            <span style="color:var(--astro-code-token-keyword)">for</span> (size_t k = 0; k &lt; T; k++) sum += A[i][k] * V[k][j];
            O[i][j] = sum;
        }
    }
    <span style="color:var(--astro-code-token-keyword)">return</span> 0;
}
</code></pre>
`;
      }
    },

    'projects/curv.ts': {
      title: 'curv.ts',
      folder: 'projects',
      render: function() {
        return `
<h2>Curv: Motorcycle Route Navigation for Twisties</h2>
<p>
  <strong>Geospatial Navigation Engine</strong> · TypeScript, MapLibre GL, PostGIS &amp; OpenStreetMap<br>
  Repository: <a href="https://github.com/Solus-QE/curv" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/curv ↗</a>
</p>

<p>
  Unlike traditional GPS engines that prioritize the fastest or shortest highway route, Curv computes optimal motorcycle routes maximizing <strong>road curvature index</strong>, elevation variation, and scenic geometry while avoiding straight multi-lane interstates.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">// Real code from curv (curv/apps/web/src/lib/routing/fun-score.ts)</span>
<span style="color:var(--astro-code-token-comment)">// Derives a 0..100 "fun score" for a route from GraphHopper path details</span>
<span style="color:var(--astro-code-token-keyword)">import</span> { segmentLength } <span style="color:var(--astro-code-token-keyword)">from</span> <span style="color:var(--astro-code-token-string)">"../geo/bearing"</span>;
<span style="color:var(--astro-code-token-keyword)">import</span> <span style="color:var(--astro-code-token-keyword)">type</span> { FunScore, LngLat } <span style="color:var(--astro-code-token-keyword)">from</span> <span style="color:var(--astro-code-token-string)">"./types"</span>;

<span style="color:var(--astro-code-token-keyword)">export function</span> <span style="color:var(--astro-code-token-function)">computeFunScore</span>(
  coords: LngLat[],
  details: Record&lt;string, [number, number, string | number][]&gt; | undefined,
  totalDistance: number,
): FunScore {
  <span style="color:var(--astro-code-token-keyword)">const</span> curvature = details?.curvature ?? [];
  <span style="color:var(--astro-code-token-keyword)">const</span> roadClass = details?.road_class ?? [];

  <span style="color:var(--astro-code-token-keyword)">let</span> curvyMeters = 0, twistyMeters = 0;
  <span style="color:var(--astro-code-token-keyword)">for</span> (<span style="color:var(--astro-code-token-keyword)">const</span> [from, to, val] <span style="color:var(--astro-code-token-keyword)">of</span> curvature) {
    <span style="color:var(--astro-code-token-keyword)">if</span> (<span style="color:var(--astro-code-token-keyword)">typeof</span> val !== <span style="color:var(--astro-code-token-string)">"number"</span>) <span style="color:var(--astro-code-token-keyword)">continue</span>;
    <span style="color:var(--astro-code-token-keyword)">const</span> len = segmentLength(coords, from, to);
    <span style="color:var(--astro-code-token-keyword)">if</span> (val &lt; 0.9) curvyMeters += len;
    <span style="color:var(--astro-code-token-keyword)">if</span> (val &lt; 0.8) twistyMeters += len;
  }

  <span style="color:var(--astro-code-token-keyword)">let</span> highwayMeters = 0;
  <span style="color:var(--astro-code-token-keyword)">for</span> (<span style="color:var(--astro-code-token-keyword)">const</span> [from, to, cls] <span style="color:var(--astro-code-token-keyword)">of</span> roadClass) {
    <span style="color:var(--astro-code-token-keyword)">if</span> (cls === <span style="color:var(--astro-code-token-string)">"motorway"</span> || cls === <span style="color:var(--astro-code-token-string)">"trunk"</span>) {
      highwayMeters += segmentLength(coords, from, to);
    }
  }

  <span style="color:var(--astro-code-token-keyword)">const</span> total = totalDistance || segmentLength(coords, 0, coords.length - 1) || 1;
  <span style="color:var(--astro-code-token-keyword)">const</span> nonHighwayPct = Math.max(0, Math.min(100, 100 * (1 - highwayMeters / total)));
  <span style="color:var(--astro-code-token-keyword)">const</span> curvyPct = Math.max(0, Math.min(100, 100 * (curvyMeters / total)));
  <span style="color:var(--astro-code-token-keyword)">const</span> twistyPct = Math.max(0, Math.min(100, 100 * (twistyMeters / total)));

  <span style="color:var(--astro-code-token-comment)">// Weight true twisties heaviest, then curvy, then staying off highways</span>
  <span style="color:var(--astro-code-token-keyword)">const</span> score = Math.max(0, Math.min(100, Math.round(twistyPct * 1.1 + curvyPct * 0.45 + nonHighwayPct * 0.18)));

  <span style="color:var(--astro-code-token-keyword)">return</span> {
    score,
    curvyMeters: Math.round(curvyMeters),
    twistyMeters: Math.round(twistyMeters),
    totalMeters: Math.round(total),
    nonHighwayPct: Math.round(nonHighwayPct),
    twistyPct: Math.round(twistyPct),
    label: score &gt;= 75 ? <span style="color:var(--astro-code-token-string)">"Epic"</span> : score &gt;= 55 ? <span style="color:var(--astro-code-token-string)">"Twisty"</span> : <span style="color:var(--astro-code-token-string)">"Spirited"</span>
  };
}
</code></pre>
`;
      }
    },

    'projects/weave.luau': {
      title: 'weave.luau',
      folder: 'projects',
      render: function() {
        return `
<h2>Weave: High-Performance Motorcycle Lane-Splitting</h2>
<p>
  <strong>Game Engine Physics &amp; Systems</strong> · Luau, Rojo &amp; Roblox Engine<br>
  Repository: <a href="https://github.com/Solus-QE/weave" target="_blank" rel="noopener noreferrer">https://github.com/Solus-QE/weave ↗</a>
</p>

<p>
  A high-speed motorcycle lane-splitting simulation game built with Luau using Rojo development workflows. Features a custom raycast spring suspension model, dynamic lean angle inertia tensors, and sub-millisecond continuous swept near-miss collision detection at 60 FPS.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">-- Real code from weave (src/client/world/ProximityScorer.luau)</span>
<span style="color:var(--astro-code-token-comment)">-- Tunneling-proof near-miss + crash detection via continuous swept closest-approach</span>
<span style="color:var(--astro-code-token-keyword)">local</span> ReplicatedStorage = game:GetService(<span style="color:var(--astro-code-token-string)">"ReplicatedStorage"</span>)
<span style="color:var(--astro-code-token-keyword)">local</span> Config = require(ReplicatedStorage.Shared.Config)
<span style="color:var(--astro-code-token-keyword)">local</span> Units = require(ReplicatedStorage.Shared.Units)
<span style="color:var(--astro-code-token-keyword)">local</span> Types = require(ReplicatedStorage.Shared.Types)

<span style="color:var(--astro-code-token-keyword)">local</span> HALF_W = (Config.CarSize.X + Config.BikeSize.X) / 2
<span style="color:var(--astro-code-token-keyword)">local</span> HALF_L = (Config.CarSize.Z + Config.BikeSize.Z) / 2

<span style="color:var(--astro-code-token-keyword)">local</span> ProximityScorer = {}

<span style="color:var(--astro-code-token-keyword)">function</span> ProximityScorer.<span style="color:var(--astro-code-token-function)">scan</span>(
	dt: number,
	bikePos: Vector3,
	bikeVel: Vector3,
	cars: { any }
): ({ Types.ScoreEvent }, boolean)
	<span style="color:var(--astro-code-token-keyword)">local</span> events: { Types.ScoreEvent } = {}
	<span style="color:var(--astro-code-token-keyword)">local</span> crashed = false

	<span style="color:var(--astro-code-token-keyword)">for</span> _, car <span style="color:var(--astro-code-token-keyword)">in</span> cars <span style="color:var(--astro-code-token-keyword)">do</span>
		<span style="color:var(--astro-code-token-keyword)">local</span> px = car.x - bikePos.X
		<span style="color:var(--astro-code-token-keyword)">local</span> pz = car.z - bikePos.Z
		<span style="color:var(--astro-code-token-keyword)">local</span> vx = -bikeVel.X
		<span style="color:var(--astro-code-token-keyword)">local</span> vz = -car.speed - bikeVel.Z

		<span style="color:var(--astro-code-token-keyword)">local</span> denom = vx * vx + vz * vz
		<span style="color:var(--astro-code-token-keyword)">local</span> tStar = 0
		<span style="color:var(--astro-code-token-keyword)">if</span> denom &gt; 1e-6 <span style="color:var(--astro-code-token-keyword)">then</span>
			tStar = math.clamp(-(px * vx + pz * vz) / denom, 0, dt)
		<span style="color:var(--astro-code-token-keyword)">end</span>

		<span style="color:var(--astro-code-token-comment)">-- Closest-approach offset over swept interval</span>
		<span style="color:var(--astro-code-token-keyword)">local</span> gx = math.abs(px + vx * tStar)
		<span style="color:var(--astro-code-token-keyword)">local</span> gz = math.abs(pz + vz * tStar)

		<span style="color:var(--astro-code-token-keyword)">if</span> gx &lt; HALF_W <span style="color:var(--astro-code-token-keyword)">and</span> gz &lt; HALF_L <span style="color:var(--astro-code-token-keyword)">then</span>
			crashed = true
		<span style="color:var(--astro-code-token-keyword)">elseif</span> <span style="color:var(--astro-code-token-keyword)">not</span> car.scored <span style="color:var(--astro-code-token-keyword)">then</span>
			<span style="color:var(--astro-code-token-keyword)">local</span> clearX = math.max(0, gx - HALF_W)
			<span style="color:var(--astro-code-token-keyword)">local</span> clearZ = math.max(0, gz - HALF_L)
			<span style="color:var(--astro-code-token-keyword)">local</span> clearance = math.sqrt(clearX * clearX + clearZ * clearZ)
			<span style="color:var(--astro-code-token-keyword)">if</span> clearance &lt; Config.NearMissClearance <span style="color:var(--astro-code-token-keyword)">then</span>
				car.scored = true
				table.insert(events, {
					relKmh = Units.studsToKmh(math.sqrt(denom)),
					gap = clearance,
					carId = car.id,
				})
			<span style="color:var(--astro-code-token-keyword)">end</span>
		<span style="color:var(--astro-code-token-keyword)">end</span>
	<span style="color:var(--astro-code-token-keyword)">end</span>
	<span style="color:var(--astro-code-token-keyword)">return</span> events, crashed
<span style="color:var(--astro-code-token-keyword)">end</span>

<span style="color:var(--astro-code-token-keyword)">return</span> ProximityScorer
</code></pre>
`;
      }
    },

    'projects/opensauce_arcade.cpp': {
      title: 'opensauce_arcade.cpp',
      folder: 'projects',
      render: function() {
        return `
<h2>Duck Hunt Reaction Arcade: OpenSauce 2026</h2>
<p>
  <strong>Interactive Hardware &amp; Embedded Firmware</strong> · C++, Microcontrollers &amp; Physical Arcade<br>
  Repository: <a href="https://github.com/superyeetyash/OpenSauce2026" target="_blank" rel="noopener noreferrer">https://github.com/superyeetyash/OpenSauce2026 ↗</a>
</p>

<p>
  An interactive arcade reaction game designed and built for OpenSauce 2026 in San Francisco. Features 6 RGB illuminated arcade targets, 18-channel software PWM running on a high-speed Timer1 interrupt, passive speaker tick generation, and 16 kHz Timer4 PCM audio sample playback.
</p>

<pre class="astro-code"><code><span style="color:var(--astro-code-token-comment)">// Real firmware from OpenSauce2026/ColorMatchGame/ColorMatchGame.ino</span>
<span style="color:var(--astro-code-token-comment)">// Elegoo Mega 2560 18-channel soft-PWM &amp; dual audio reaction game</span>
<span style="color:var(--astro-code-token-keyword)">const byte</span> NUM_LIGHTS = 6;
<span style="color:var(--astro-code-token-keyword)">const byte</span> RGB_PINS[NUM_LIGHTS][3] = {
  {22, 24, 23},  <span style="color:var(--astro-code-token-comment)">// Light 1</span>
  {25, 27, 26},  <span style="color:var(--astro-code-token-comment)">// Light 2</span>
  {35,  4,  3},  <span style="color:var(--astro-code-token-comment)">// Light 3 (pin 2 reserved for amplified audio DAC out)</span>
  { 5,  7,  6},  <span style="color:var(--astro-code-token-comment)">// Light 4</span>
  { 8, 10,  9},  <span style="color:var(--astro-code-token-comment)">// Light 5</span>
  {11, 13, 12},  <span style="color:var(--astro-code-token-comment)">// Light 6</span>
};

<span style="color:var(--astro-code-token-comment)">// Timer1 ISR: 32-step software PWM across all 18 RGB channels</span>
<span style="color:var(--astro-code-token-function)">ISR</span>(TIMER1_COMPA_vect) {
  <span style="color:var(--astro-code-token-keyword)">static byte</span> pwm_counter = 0;
  pwm_counter = (pwm_counter + 1) &amp; 0x1F; <span style="color:var(--astro-code-token-comment)">// 0 to 31</span>
  
  <span style="color:var(--astro-code-token-keyword)">for</span> (<span style="color:var(--astro-code-token-keyword)">byte</span> i = 0; i &lt; NUM_LIGHTS; i++) {
    <span style="color:var(--astro-code-token-keyword)">for</span> (<span style="color:var(--astro-code-token-keyword)">byte</span> c = 0; c &lt; 3; c++) {
      digitalWrite(RGB_PINS[i][c], (current_levels[i][c] &gt; pwm_counter) ? HIGH : LOW);
    }
  }
}
</code></pre>
`;
      }
    },

    // ------------------------------------------------------------------------
    // ACTIVITIES
    // ------------------------------------------------------------------------
    'activities/planet_hacks.md': {
      title: 'planet_hacks.md',
      folder: 'activities',
      render: function() {
        return `
<h2>Planet Hacks: Chicagoland Sustainability Hackathon</h2>
<p>
  <strong>Founder &amp; Lead Director</strong> · Jan 2025 – Present<br>
  Fiscal Sponsor: Hack Club 501(c)(3)
</p>

<p>
  Founded and directed the premier sustainability hackathon in the Greater Chicago area. Raised <strong>$18,000+</strong> in corporate sponsorships and community grants to host 200+ students from 30+ schools.
</p>
<ul>
  <li>Organized hardware workshops in microcontroller sensor arrays, clean-energy prototypes, and environmental AI.</li>
  <li>Managed logistics, venue coordination, mentor recruitment, and meal catering.</li>
</ul>
`;
      }
    },

    'activities/hack_club_stardance.md': {
      title: 'hack_club_stardance.md',
      folder: 'activities',
      render: function() {
        return `
<h2>Hack Club Stardance</h2>
<p>
  <strong>Lead Organizer</strong> · Lake Tahoe, CA (July 2025)
</p>

<p>
  Co-organized an intensive 4-day hacker gathering for 40 of North America's top teenage hardware and software creators in the Sierra Nevada mountains.
</p>
<ul>
  <li>Managed budgets, flight stipends, and alpine lodging logistics.</li>
  <li>Facilitated PCB design, custom firmware synthesis, and embedded hardware workshops under the stars.</li>
</ul>
`;
      }
    },

    'activities/raiders_drum_corps.md': {
      title: 'marching_band_dci.md',
      folder: 'activities',
      render: function() {
        return `
<h2>Marching Band Leadership &amp; Drum Corps (DCI)</h2>
<p>
  <strong>Brass Performance &amp; Ensemble Leadership</strong> · Marching Band, Wind Ensemble &amp; DCI
</p>

<p>
  Active brass musician with extensive leadership across marching band, symphonic wind ensemble, athletic pep band, and competitive drum corps auditions:
</p>

<ul>
  <li><strong>High School Marching Band:</strong> Squad leader and trumpet section leader for a couple of years, leading rehearsal blocks, music memorization, visual execution, and field drill coordination.</li>
  <li><strong>Wind Ensemble:</strong> Trumpet player performing advanced symphonic and concert literature in the school's premier wind ensemble.</li>
  <li><strong>Pep Band:</strong> Active performer for a couple of years providing energetic live brass performance for athletic games, school rallies, and campus events.</li>
  <li><strong>Raiders Drum &amp; Bugle Corps:</strong> Successfully auditioned and was accepted into the Raiders Drum &amp; Bugle Corps for the competitive Drum Corps International season.</li>
  <li><strong>Mandarins Drum &amp; Bugle Corps:</strong> Currently auditioning for the Mandarins Drum &amp; Bugle Corps in DCI World Class.</li>
</ul>

<p style="font-family: var(--font-mono); color: var(--color-yellow); margin-top: 1.5rem; font-size: 1.05rem; letter-spacing: 0.05em;">
  jazz ensemble 2026?
</p>
`;
      }
    },

    'activities/flight_training.md': {
      title: 'flight_training.md',
      folder: 'activities',
      render: function() {
        return `
<h2>Aviation &amp; Flight Training</h2>
<p>
  <strong>FAA Student Pilot</strong> · 2024 – Present (Expected Summer 2026)
</p>

<p>
  Actively pursuing FAA Private Pilot Certificate (Single-Engine Land).
</p>
<ul>
  <li>Logged flight hours in Piper Archer II (PA-28-181) and Cessna 172 Skyhawk aircraft.</li>
  <li>Trained in cross-country pilotage, dead reckoning, VOR/GPS navigation, stall spin recovery, and emergency engine-out glide maneuvers.</li>
  <li>Scored <strong>96%</strong> on the FAA Airman Written Knowledge Examination.</li>
</ul>
`;
      }
    },

    'activities/arcsoft_qa.md': {
      title: 'arcsoft_qa.md',
      folder: 'activities',
      render: function() {
        return `
<h2>ArcSoft Quality Assurance Engineering</h2>
<p>
  <strong>QA Engineering Intern</strong> · Computer Vision Division, Fremont, CA (Summer 2024)
</p>

<p>
  Validated embedded computer vision and image processing SDKs across 12+ mobile and hardware platforms.
</p>
<ul>
  <li>Constructed automated regression test suites in Python, reducing manual testing cycles by 35%.</li>
  <li>Benchmarked low-light facial detection algorithms under edge-case illumination and high-noise environments.</li>
</ul>
`;
      }
    },

    'activities/kempersports.md': {
      title: 'kempersports.md',
      folder: 'activities',
      render: function() {
        return `
<h2>KemperSports / The Glen Club</h2>
<p>
  <strong>Outside Operations Assistant</strong> · Glenview, IL (2024 – 2025)
</p>

<p>
  Managed day-to-day outside operations and corporate tournament staging for The Glen Club, a premier Tom Fazio-designed championship facility and former Web.com Tour stop.
</p>
<ul>
  <li>Coordinated fleet maintenance, driving range logistics, and hospitality for 120+ player shotgun tournaments.</li>
</ul>
`;
      }
    }
  };

  // Backwards-compatible aliases
  VIRTUAL_FILES['projects/sram_seu_detector.md'] = VIRTUAL_FILES['projects/apex_sram_seu.py'];
  VIRTUAL_FILES['projects/alignfolio.py'] = VIRTUAL_FILES['projects/SomaOS.c'];
  VIRTUAL_FILES['projects/soir_moe.c'] = VIRTUAL_FILES['projects/soir_moe.py'];
  VIRTUAL_FILES['activities/marching_band_dci.md'] = VIRTUAL_FILES['activities/raiders_drum_corps.md'];


  /* ==========================================================================
     8. Application Bootstrapper & Dual-View Controller
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    const contentLinesEl = document.querySelector('.content-lines');
    const asciiContainerEl = document.querySelector('.ascii-container');
    const asciiRendererEl = document.querySelector('.ascii-renderer');

    let asciiEngine = null;
    let scheduleLineNumbers = initLineNumbers();
    initButtonHoverWaves();

    // Initialize Navier-Stokes Vector Field Circulation Engine
    if (asciiRendererEl) {
      asciiEngine = initNavierStokesRainEngine(asciiRendererEl, {
        headings: [
          { text: 'Alexander Jameson', color: 'var(--color-text)' },
          { text: 'founder @ cesure · ML safety researcher & student pilot', color: 'var(--color-subtext0)' }
        ]
      });
    }

    const recomputeCenter = centerContent('center-spacers');

    function renderHome() {
      document.body.classList.add('is-home');
      if (asciiContainerEl) asciiContainerEl.style.display = 'block';

      if (!contentLinesEl.querySelector('#center-spacers')) {
        contentLinesEl.innerHTML = `
<p id="center-spacers">&nbsp;</p>
<h1 data-text-wave="skip">Alexander Jameson</h1>
<h2 data-text-wave="skip">founder @ cesure · ML safety researcher &amp; student pilot</h2>
<p class="cta-spacer" aria-hidden="true">&nbsp;</p>
<p class="cta-row">
  <span class="cta-align">
    <a href="#about/README.md" style="--link-color:var(--color-green)" class="button">
      <span class="button-inner">
        <span class="button-icon" aria-hidden="true">󰈙</span>
        Explore
      </span>
    </a>
  </span>
</p>
`;
      }

      // Clear sidebar active states
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('is-current'));
      const homeLink = document.querySelector('a[href="#home"], .cwd');
      if (homeLink) homeLink.classList.add('is-current');

      if (asciiEngine) {
        asciiEngine.resize();
        asciiEngine.markDirty?.();
        asciiEngine.start();
      }

      recomputeCenter();
      scheduleLineNumbers();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function renderDocument(filePath) {
      const cleanPath = filePath.replace(/^[#/]+/, '');
      const file = VIRTUAL_FILES[cleanPath];
      if (!file) {
        renderHome();
        return;
      }

      document.body.classList.remove('is-home');
      if (asciiContainerEl) asciiContainerEl.style.display = 'none';
      if (asciiEngine) asciiEngine.stop();

      contentLinesEl.innerHTML = file.render();

      // Update sidebar active selection
      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('is-current');
        if (el.getAttribute('href') === `#${cleanPath}`) {
          el.classList.add('is-current');
          // Auto-expand parent tree-folder
          const parentFolder = el.closest('tree-folder');
          if (parentFolder) {
            parentFolder.setAttribute('open', '');
            parentFolder.querySelector('[data-summary]')?.setAttribute('aria-expanded', 'true');
            const grp = parentFolder.querySelector('[role="group"]');
            if (grp) grp.hidden = false;
          }
        }
      });

      textWaveReveal(contentLinesEl);
      scheduleLineNumbers();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Routing
    function handleRoute() {
      const hash = window.location.hash.replace(/^[#/]+/, '');
      if (!hash || hash === 'home') {
        renderHome();
      } else {
        renderDocument(hash);
      }
    }

    window.addEventListener('hashchange', handleRoute);

    // Global copy email action
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('#sidebar-copy-email') || e.target.closest('#doc-copy-email');
      if (copyBtn) {
        e.preventDefault();
        const email = 'alex@cesure.xyz';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(email).then(() => {
            alert(`Copied ${email} to clipboard`);
          }).catch(() => {
            prompt('Copy email:', email);
          });
        } else {
          prompt('Copy email:', email);
        }
      }
    });

    // Initial Route
    handleRoute();
  });
})();
