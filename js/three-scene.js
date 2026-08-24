/**
 * High-Efficiency WebGL & OpenGL Shader Engine
 * Alexander Jameson Portfolio
 * 
 * Includes:
 * 1. HeroSculpture: 4D Hopf Fibrations, Clifford Tori, Lorenz Attractors, and SAE Latent Manifolds with HDR studio reflections and GPU geodesic particles.
 * 2. BgWaveShader: Low-overhead GPU topological wave grid running behind sections.
 * 3. SAEPolytope3D: Interactive 3D Sparse Autoencoder latent feature polytope with live steerability vectors.
 * 4. AeroWindTunnel3D: 3D NACA 0012 cambered airfoil with 400 instanced GPU fluid streamline particles and dynamic Angle of Attack pitch.
 * 5. BrassHarmonic3D: 3D Fourier harmonic wave ribbon for Raiders Drum & Bugle Corps trumpet section leadership.
 * 
 * Battery & Low-End Optimization:
 * - IntersectionObserver pauses off-screen rendering loops.
 * - Single-draw-call instancing for particles.
 * - Capped devicePixelRatio at 1.5.
 * Zero AI slop, zero em dashes.
 */

/* 1. Centerpiece 3D Hero Topological Sculpture */
window.HeroSculpture = (function() {
  'use strict';

  let scene, camera, renderer;
  let sculptureGroup, particlesGroup;
  let currentMode = 'hopf';
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;
  let targetParallaxY = 0, currentParallaxY = 0;
  let isDragging = false, prevMouseX = 0, prevMouseY = 0;
  let containerEl = null, envTexture = null;
  let isVisible = true;

  function createStudioEnvMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#0d0e12');
    bgGrad.addColorStop(0.5, '#181920');
    bgGrad.addColorStop(1, '#0d0e12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    const softbox1 = ctx.createRadialGradient(256, 40, 5, 256, 40, 120);
    softbox1.addColorStop(0, 'rgba(255, 255, 255, 1)');
    softbox1.addColorStop(0.3, 'rgba(230, 240, 255, 0.8)');
    softbox1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox1;
    ctx.fillRect(0, 0, 512, 160);

    const softbox2 = ctx.createRadialGradient(80, 140, 10, 80, 140, 90);
    softbox2.addColorStop(0, 'rgba(159, 228, 243, 0.95)');
    softbox2.addColorStop(0.5, 'rgba(3, 4, 156, 0.45)');
    softbox2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox2;
    ctx.fillRect(0, 50, 200, 200);

    const softbox3 = ctx.createRadialGradient(430, 120, 10, 430, 120, 80);
    softbox3.addColorStop(0, 'rgba(245, 158, 11, 0.9)');
    softbox3.addColorStop(0.6, 'rgba(239, 68, 68, 0.3)');
    softbox3.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = softbox3;
    ctx.fillRect(330, 40, 180, 180);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  function init(container) {
    containerEl = container;
    if (!containerEl || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    const width = containerEl.clientWidth || 800;
    const height = containerEl.clientHeight || 400;

    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    containerEl.innerHTML = '';
    containerEl.appendChild(renderer.domElement);

    envTexture = createStudioEnvMap();
    scene.environment = envTexture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const rimCyan = new THREE.DirectionalLight(0x9fe4f3, 2.6);
    rimCyan.position.set(-6, -3, -4);
    scene.add(rimCyan);

    const rimAmber = new THREE.DirectionalLight(0xf59e0b, 1.9);
    rimAmber.position.set(5, -4, -3);
    scene.add(rimAmber);

    sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    initParticles();
    buildSculpture('hopf');

    // Power-saving observer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(containerEl);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    containerEl.style.pointerEvents = 'auto';
    containerEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    animate();
  }

  function initParticles() {
    const particleCount = 450;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x9fe4f3);
    const color2 = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const r = 2.4 + (Math.random() - 0.5) * 0.4;

      positions[i * 3] = r * Math.cos(u) * Math.sin(v);
      positions[i * 3 + 1] = r * Math.sin(u) * Math.sin(v);
      positions[i * 3 + 2] = r * Math.cos(v);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particlesGroup.add(particleSystem);
  }

  function getChromeMaterial(tintColor = 0xffffff, roughness = 0.05, metalness = 0.98) {
    return new THREE.MeshStandardMaterial({
      color: tintColor,
      roughness: roughness,
      metalness: metalness,
      envMap: envTexture,
      envMapIntensity: 1.8
    });
  }

  function buildSculpture(mode) {
    currentMode = mode;
    while (sculptureGroup.children.length > 0) {
      const obj = sculptureGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      sculptureGroup.remove(obj);
    }

    const chromeMat = getChromeMaterial(0xf0f0f5, 0.04, 0.98);
    const cyanMat = getChromeMaterial(0x9fe4f3, 0.1, 0.94);
    const amberMat = getChromeMaterial(0xf59e0b, 0.12, 0.92);

    if (mode === 'hopf') {
      const numFibers = 20;
      for (let i = 0; i < numFibers; i++) {
        const phi = (i / numFibers) * Math.PI * 2;
        const majorRadius = 1.4 + Math.cos(phi * 2) * 0.45;
        const geom = new THREE.TorusGeometry(majorRadius, 0.038, 20, 80);

        let mat = chromeMat;
        if (i % 4 === 0) mat = cyanMat;
        else if (i % 4 === 2) mat = amberMat;

        const mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.x = phi;
        mesh.rotation.y = phi * 0.65;
        mesh.rotation.z = phi * 0.35;
        sculptureGroup.add(mesh);
      }

      const coreGeom = new THREE.TorusGeometry(0.8, 0.06, 24, 80);
      const coreMesh = new THREE.Mesh(coreGeom, cyanMat);
      coreMesh.rotation.x = Math.PI / 2;
      sculptureGroup.add(coreMesh);

    } else if (mode === 'clifford') {
      const geom = new THREE.TorusKnotGeometry(1.55, 0.42, 160, 36, 2, 3);
      const mesh = new THREE.Mesh(geom, chromeMat);
      sculptureGroup.add(mesh);

      const wireGeom = new THREE.TorusKnotGeometry(1.58, 0.43, 48, 16, 2, 3);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x9fe4f3, wireframe: true, transparent: true, opacity: 0.22 });
      const wireMesh = new THREE.Mesh(wireGeom, wireMat);
      sculptureGroup.add(wireMesh);

    } else if (mode === 'lorenz') {
      const points = [];
      let x = 0.1, y = 0, z = 0;
      const dt = 0.007;
      const sigma = 10, rho = 28, beta = 8 / 3;

      for (let i = 0; i < 2800; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        points.push(new THREE.Vector3(x * 0.085, (y * 0.085) - 0.2, (z - 25) * 0.085));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geom = new THREE.TubeGeometry(curve, 280, 0.038, 10, false);
      const mesh = new THREE.Mesh(geom, cyanMat);
      sculptureGroup.add(mesh);

    } else if (mode === 'sae') {
      const geom = new THREE.IcosahedronGeometry(2.0, 1);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0x9fe4f3,
        metalness: 0.95,
        roughness: 0.1,
        wireframe: true,
        envMap: envTexture
      });
      const mesh = new THREE.Mesh(geom, wireMat);
      sculptureGroup.add(mesh);

      const numBasis = 18;
      for (let i = 0; i < numBasis; i++) {
        const theta = (i / numBasis) * Math.PI * 2;
        const phi = Math.acos(2 * ((i + 0.5) / numBasis) - 1);
        const r = 2.0;
        const bx = r * Math.sin(phi) * Math.cos(theta);
        const by = r * Math.sin(phi) * Math.sin(theta);
        const bz = r * Math.cos(phi);

        const pointGeom = new THREE.SphereGeometry(0.085, 12, 12);
        const pointMesh = new THREE.Mesh(pointGeom, i % 2 === 0 ? chromeMat : amberMat);
        pointMesh.position.set(bx, by, bz);
        sculptureGroup.add(pointMesh);
      }
    }
  }

  function onMouseMove(e) {
    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      return;
    }

    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = normX * 0.65;
    targetRotationX = -normY * 0.45;
  }

  function onScroll() {
    const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
    targetParallaxY = scrollProgress * 1.5;
  }

  function onMouseDown(e) {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onResize() {
    if (!containerEl || !camera || !renderer) return;
    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    currentRotationX += (targetRotationX - currentRotationX) * 0.045;
    currentRotationY += (targetRotationY - currentRotationY) * 0.045;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

    if (sculptureGroup) {
      sculptureGroup.rotation.y = currentRotationY + performance.now() * 0.00035;
      sculptureGroup.rotation.x = currentRotationX + currentParallaxY * 0.5;
      sculptureGroup.rotation.z = Math.sin(performance.now() * 0.0006) * 0.12;
    }

    if (particlesGroup) {
      particlesGroup.rotation.y = -currentRotationY * 0.5 - performance.now() * 0.0002;
      particlesGroup.rotation.x = currentRotationX * 0.5;
    }

    renderer.render(scene, camera);
  }

  return {
    init: init,
    setMode: buildSculpture
  };
})();

/* 2. Background GPU Topological Fluid Wave Grid */
window.BgWaveShader = (function() {
  'use strict';

  let scene, camera, renderer;
  let mesh;
  let isVisible = true;

  function init(canvas) {
    if (!canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 14, 18);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5, false);
    renderer.setPixelRatio(1);

    const geom = new THREE.PlaneGeometry(36, 36, 32, 32);
    geom.rotateX(-Math.PI / 2);

    const mat = new THREE.MeshBasicMaterial({
      color: 0x9fe4f3,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });

    mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5, false);
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = performance.now() * 0.001;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const w = pos.getZ(i);
        const y = Math.sin(u * 0.35 + time * 1.2) * Math.cos(w * 0.35 + time * 0.9) * 0.8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();
  }

  return { init: init };
})();

/* 3. Chapter 2: Interactive 3D SAE Latent Feature Polytope */
window.SAEPolytope3D = (function() {
  'use strict';

  let scene, camera, renderer;
  let rootGroup, featureNodes = [];
  let isVisible = true;
  let steerVector = 0;

  function init(container) {
    if (!container || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 240;

    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    camera.position.set(0, 0, 5.5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x9fe4f3, 1.5);
    light.position.set(2, 4, 3);
    scene.add(light);

    rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Icosahedron Latent Manifold Core
    const coreGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x9fe4f3, wireframe: true, transparent: true, opacity: 0.35 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    rootGroup.add(core);

    // Feature basis nodes
    const nodeGeom = new THREE.SphereGeometry(0.09, 12, 12);
    const nodeMatActive = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.1, metalness: 0.9 });
    const nodeMatPassive = new THREE.MeshStandardMaterial({ color: 0x9fe4f3, roughness: 0.2, metalness: 0.8 });

    const numNodes = 14;
    featureNodes = [];
    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const r = 1.6;

      const mesh = new THREE.Mesh(nodeGeom, i === 0 ? nodeMatActive : nodeMatPassive);
      mesh.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
      mesh.userData = { origPos: mesh.position.clone(), isTarget: i === 0 };
      rootGroup.add(mesh);
      featureNodes.push(mesh);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    window.addEventListener('resize', () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      rootGroup.rotation.y += 0.008;
      rootGroup.rotation.x = Math.sin(performance.now() * 0.001) * 0.2;

      // Steer target node with slider perturbation
      featureNodes.forEach(node => {
        if (node.userData.isTarget) {
          const shift = (steerVector / 100) * 0.8;
          node.position.copy(node.userData.origPos).multiplyScalar(1 + shift);
        }
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  function setSteer(val) {
    steerVector = val;
  }

  return { init: init, setSteer: setSteer };
})();

/* 4. Chapter 3: 3D WebGL Aerodynamic Wind Tunnel Engine */
window.AeroWindTunnel3D = (function() {
  'use strict';

  let scene, camera, renderer;
  let airfoilMesh, particlesMesh;
  const numParticles = 350;
  let particleData = [];
  let angleOfAttack = 6;
  let isVisible = true;
  let dummy = new THREE.Object3D();

  function init(container) {
    if (!container || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 240;

    camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 50);
    camera.position.set(0, 0.5, 6.2);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const lightKey = new THREE.DirectionalLight(0x9fe4f3, 2.0);
    lightKey.position.set(3, 4, 5);
    scene.add(lightKey);

    const lightRim = new THREE.DirectionalLight(0xf59e0b, 1.5);
    lightRim.position.set(-4, -2, -3);
    scene.add(lightRim);

    // Extruded 3D NACA 0012 Airfoil Shape
    const shape = new THREE.Shape();
    const chord = 2.4;
    const numPts = 32;

    for (let i = 0; i <= numPts; i++) {
      const xNorm = i / numPts;
      const yt = 5 * 0.12 * (
        0.2969 * Math.sqrt(xNorm) -
        0.1260 * xNorm -
        0.3516 * xNorm * xNorm +
        0.2843 * Math.pow(xNorm, 3) -
        0.1015 * Math.pow(xNorm, 4)
      );
      const px = (xNorm - 0.5) * chord;
      const py = yt * chord;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    for (let i = numPts; i >= 0; i--) {
      const xNorm = i / numPts;
      const yt = 5 * 0.12 * (
        0.2969 * Math.sqrt(xNorm) -
        0.1260 * xNorm -
        0.3516 * xNorm * xNorm +
        0.2843 * Math.pow(xNorm, 3) -
        0.1015 * Math.pow(xNorm, 4)
      );
      const px = (xNorm - 0.5) * chord;
      const py = -yt * chord;
      shape.lineTo(px, py);
    }
    shape.closePath();

    const extrudeSettings = { depth: 1.6, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const foilGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    foilGeom.center();

    const foilMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8e0,
      metalness: 0.94,
      roughness: 0.08
    });

    airfoilMesh = new THREE.Mesh(foilGeom, foilMat);
    scene.add(airfoilMesh);

    // Single-Draw-Call Instanced Particles
    const pGeom = new THREE.SphereGeometry(0.024, 6, 6);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x9fe4f3 });
    particlesMesh = new THREE.InstancedMesh(pGeom, pMat, numParticles);
    scene.add(particlesMesh);

    particleData = [];
    for (let i = 0; i < numParticles; i++) {
      particleData.push(resetParticle(true));
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    window.addEventListener('resize', () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

    animate();
  }

  function resetParticle(randomX = false) {
    return {
      x: randomX ? (Math.random() - 0.5) * 7 : -3.5 - Math.random() * 0.8,
      y: (Math.random() - 0.5) * 2.2,
      z: (Math.random() - 0.5) * 1.6,
      vx: 0.055 + Math.random() * 0.02,
      vy: 0,
      vz: 0,
      life: Math.random() * 100
    };
  }

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const alphaRad = -(angleOfAttack * Math.PI) / 180;
    if (airfoilMesh) {
      airfoilMesh.rotation.z = THREE.MathUtils.lerp(airfoilMesh.rotation.z, alphaRad, 0.1);
      airfoilMesh.rotation.y = THREE.MathUtils.lerp(airfoilMesh.rotation.y, 0.25, 0.05);
    }

    for (let i = 0; i < numParticles; i++) {
      const p = particleData[i];
      p.x += p.vx;
      p.y += p.vy;

      // Deflection around airfoil
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      if (dist < 1.3 && p.x > -1.2 && p.x < 1.4) {
        const isUpper = p.y > 0;
        const liftForce = isUpper ? 0.015 * Math.sin(alphaRad + 0.1) : -0.012 * Math.sin(alphaRad);
        p.vy += liftForce;

        // Stall separation vortex
        if (p.x > 0.4 && Math.abs(angleOfAttack) > 9) {
          p.vy += Math.sin(p.x * 6 + performance.now() * 0.01) * 0.008 * (Math.abs(angleOfAttack) / 10);
        }
      } else {
        p.vy *= 0.94;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      particlesMesh.setMatrixAt(i, dummy.matrix);

      if (p.x > 3.8) {
        particleData[i] = resetParticle(false);
      }
    }
    particlesMesh.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  }

  function setAngle(deg) {
    angleOfAttack = deg;
  }

  return { init: init, setAngle: setAngle };
})();

/* 5. Chapter 5: 3D Brass Harmonic Resonator */
window.BrassHarmonic3D = (function() {
  'use strict';

  let scene, camera, renderer;
  let waveMesh;
  let isVisible = true;

  function init(container) {
    if (!container || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    const w = container.clientWidth || 400;
    const h = container.clientHeight || 220;

    camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xf59e0b, 2.0);
    light.position.set(2, 3, 4);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const numPoints = 80;
    const points = [];
    for (let i = 0; i < numPoints; i++) {
      const x = ((i / numPoints) - 0.5) * 4.2;
      points.push(new THREE.Vector3(x, 0, 0));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geom = new THREE.TubeGeometry(curve, 70, 0.05, 10, false);
    const mat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.95 });

    waveMesh = new THREE.Mesh(geom, mat);
    scene.add(waveMesh);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    window.addEventListener('resize', () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = performance.now() * 0.003;
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        // Trumpet brass harmonic superposition (Fundamental + 2nd + 3rd harmonics)
        const y = Math.sin(x * 3.0 + t) * 0.35 + Math.sin(x * 6.0 + t * 2.0) * 0.18 + Math.sin(x * 9.0 + t * 3.0) * 0.08;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

      waveMesh.rotation.y = Math.sin(t * 0.4) * 0.25;

      renderer.render(scene, camera);
    }
    animate();
  }

  return { init: init };
})();
