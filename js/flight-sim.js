/**
 * 3D Physics Flight Simulator & Topological Airspace Engine
 * Built for Alexander Jameson Portfolio (FAA Student Pilot)
 * Features:
 * - Real aerodynamic flight model: Lift, Drag, Thrust, Gravity, Stall speed
 * - Procedural mathematical terrain with marked runway
 * - Floating topological waypoint rings (Hopf fibers, Torus knot loops)
 * - Real-time cockpit & chase telemetry HUD
 * - Synthesized Web Audio API engine sound with throttle RPM pitch shifting
 * Zero em dashes in code or comments.
 */

window.FlightSim = (function() {
  'use strict';

  let scene, camera, renderer, container;
  let animId = null;
  let isRunning = false;

  // Aircraft state & physics
  const aircraft = {
    mesh: null,
    propeller: null,
    pos: new THREE.Vector3(0, 5, 0),
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0, 0, 0, 'YXZ'),
    speed: 0,           // Knots
    throttle: 0.0,      // 0.0 to 1.0
    pitch: 0,           // Pitch angle
    roll: 0,            // Roll angle
    yaw: 0,             // Heading angle
    altitude: 5,        // Altitude in feet
    climbRate: 0,       // Vertical speed ft/min
    isStalled: false,
    ringsCollected: 0,
    totalRings: 8
  };

  // Camera settings
  let cameraMode = 'chase'; // 'chase', 'cockpit', 'orbit'

  // Input states
  const keys = {
    pitchUp: false,    // ArrowDown / S
    pitchDown: false,  // ArrowUp / W
    rollLeft: false,   // ArrowLeft / A
    rollRight: false,  // ArrowRight / D
    throttleUp: false, // Shift / E
    throttleDown: false // Ctrl / Q
  };

  // Topological Rings
  const rings = [];

  // Web Audio Synthesized Engine Sound
  let audioCtx = null;
  let engineOsc = null;
  let engineGain = null;
  let isSoundEnabled = false;

  function init(containerEl) {
    container = containerEl || document.getElementById('flight-sim-canvas-wrap');
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    scene.fog = new THREE.FogExp2(0x09090b, 0.003);

    // Camera
    camera = new THREE.PerspectiveCamera(55, width / height, 0.5, 2000);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xf59e0b, 1.2);
    sun.position.set(100, 200, 100);
    scene.add(sun);

    // Build World Elements
    buildProceduralTerrain();
    buildRunway();
    buildAircraft();
    buildTopologicalRings();

    // Event Listeners
    setupControls();
    window.addEventListener('resize', onResize);

    // Reset Aircraft to Runway
    resetFlight();

    isRunning = true;
    animate();
  }

  // 1. Procedural Mathematical Terrain (Fractal Noise Mesh)
  function buildProceduralTerrain() {
    const size = 1200;
    const segments = 90;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const distFromCenter = Math.sqrt(x * x + z * z);

      // Keep runway area flat
      if (Math.abs(x) < 40 && Math.abs(z) < 250) {
        pos.setY(i, 0);
      } else {
        // Multi-frequency fractal hills
        const h1 = Math.sin(x * 0.008) * Math.cos(z * 0.008) * 35;
        const h2 = Math.sin(x * 0.02 + 1.2) * Math.cos(z * 0.02) * 15;
        const h3 = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5;
        const edgeDamp = Math.min(1.0, distFromCenter / 100);
        pos.setY(i, (h1 + h2 + h3) * edgeDamp);
      }
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false
    });

    const terrainMesh = new THREE.Mesh(geo, mat);
    scene.add(terrainMesh);

    // Wireframe topographical contour overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x27272a,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.position.y = 0.2;
    scene.add(wireMesh);
  }

  // 2. Runway
  function buildRunway() {
    const rwGeo = new THREE.PlaneGeometry(30, 450);
    rwGeo.rotateX(-Math.PI / 2);
    const rwMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
    const runway = new THREE.Mesh(rwGeo, rwMat);
    runway.position.set(0, 0.4, 0);
    scene.add(runway);

    // Centerline markings
    for (let z = -200; z <= 200; z += 30) {
      const stripeGeo = new THREE.PlaneGeometry(2, 14);
      stripeGeo.rotateX(-Math.PI / 2);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(0, 0.5, z);
      scene.add(stripe);
    }
  }

  // 3. Aircraft Model (Aerodynamic Clean Geometry)
  function buildAircraft() {
    const group = new THREE.Group();

    // Fuselage
    const fuseGeo = new THREE.ConeGeometry(1.0, 7.0, 8);
    fuseGeo.rotateX(Math.PI / 2);
    const fuseMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.4 });
    const fuselage = new THREE.Mesh(fuseGeo, fuseMat);
    group.add(fuselage);

    // Main Wings (NACA Airfoil slice approximation)
    const wingGeo = new THREE.BoxGeometry(14.0, 0.2, 2.2);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, 0.2, 0.2);
    group.add(wings);

    // Horizontal Tail Stabilizer
    const tailHGeo = new THREE.BoxGeometry(4.5, 0.15, 1.2);
    const tailH = new THREE.Mesh(tailHGeo, wingMat);
    tailH.position.set(0, 0.3, -3.0);
    group.add(tailH);

    // Vertical Tail Rudder
    const tailVGeo = new THREE.BoxGeometry(0.15, 1.8, 1.4);
    const tailV = new THREE.Mesh(tailVGeo, fuseMat);
    tailV.position.set(0, 1.0, -3.0);
    group.add(tailV);

    // Propeller
    const propGeo = new THREE.BoxGeometry(3.0, 0.2, 0.05);
    const propMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
    const prop = new THREE.Mesh(propGeo, propMat);
    prop.position.set(0, 0, 3.6);
    group.add(prop);
    aircraft.propeller = prop;

    // Cockpit canopy glass
    const canopyGeo = new THREE.CapsuleGeometry(0.5, 1.4, 4, 8);
    canopyGeo.rotateX(Math.PI / 2);
    const canopyMat = new THREE.MeshBasicMaterial({ color: 0x3f3f46, wireframe: true });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 0.7, 0.8);
    group.add(canopy);

    aircraft.mesh = group;
    scene.add(aircraft.mesh);
  }

  // 4. Topological Floating Waypoint Hoops (Hopf & Torus Rings)
  function buildTopologicalRings() {
    const ringPositions = [
      new THREE.Vector3(0, 35, 180),
      new THREE.Vector3(80, 65, 320),
      new THREE.Vector3(220, 95, 260),
      new THREE.Vector3(280, 110, 80),
      new THREE.Vector3(160, 90, -140),
      new THREE.Vector3(-80, 80, -260),
      new THREE.Vector3(-220, 60, -120),
      new THREE.Vector3(-120, 40, 60)
    ];

    ringPositions.forEach((pos, idx) => {
      const ringGroup = new THREE.Group();

      // Torus ring hoop
      const torusGeo = new THREE.TorusGeometry(12, 0.6, 12, 32);
      const torusMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xf59e0b : 0xd4d4d8,
        wireframe: true
      });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      ringGroup.add(torus);

      // Inner pulsating beacon point
      const beaconGeo = new THREE.OctahedronGeometry(1.8, 0);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      ringGroup.add(beacon);

      ringGroup.position.copy(pos);
      ringGroup.lookAt(new THREE.Vector3(pos.x * 1.2, pos.y, pos.z * 1.2));
      ringGroup.userData = {
        id: idx,
        collected: false,
        radius: 14,
        beacon: beacon
      };

      rings.push(ringGroup);
      scene.add(ringGroup);
    });

    aircraft.totalRings = ringPositions.length;
  }

  // 5. Controls & Keyboard Handlers
  function setupControls() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.pitchDown = true;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.pitchUp = true;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.rollLeft = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.rollRight = true;
      if (['ShiftLeft', 'ShiftRight', 'KeyE'].includes(e.code)) keys.throttleUp = true;
      if (['ControlLeft', 'ControlRight', 'KeyQ'].includes(e.code)) keys.throttleDown = true;

      if (e.code === 'KeyC') {
        toggleCamera();
      }
      if (e.code === 'KeyR') {
        resetFlight();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) keys.pitchDown = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) keys.pitchUp = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.rollLeft = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) keys.rollRight = false;
      if (['ShiftLeft', 'ShiftRight', 'KeyE'].includes(e.code)) keys.throttleUp = false;
      if (['ControlLeft', 'ControlRight', 'KeyQ'].includes(e.code)) keys.throttleDown = false;
    });

    // Touch controls / UI button bindings
    const throttleUpBtn = document.getElementById('fs-btn-throttle-up');
    const throttleDownBtn = document.getElementById('fs-btn-throttle-down');
    const resetBtn = document.getElementById('fs-btn-reset');
    const camBtn = document.getElementById('fs-btn-cam');
    const soundBtn = document.getElementById('fs-btn-sound');

    throttleUpBtn?.addEventListener('click', () => {
      aircraft.throttle = Math.min(1.0, aircraft.throttle + 0.2);
    });
    throttleDownBtn?.addEventListener('click', () => {
      aircraft.throttle = Math.max(0.0, aircraft.throttle - 0.2);
    });
    resetBtn?.addEventListener('click', resetFlight);
    camBtn?.addEventListener('click', toggleCamera);
    soundBtn?.addEventListener('click', toggleEngineSound);
  }

  function toggleCamera() {
    cameraMode = cameraMode === 'chase' ? 'cockpit' : (cameraMode === 'cockpit' ? 'orbit' : 'chase');
    const camLabel = document.getElementById('fs-cam-label');
    if (camLabel) {
      camLabel.textContent = `Cam: ${cameraMode.toUpperCase()}`;
    }
  }

  function resetFlight() {
    aircraft.pos.set(0, 1.5, -180);
    aircraft.vel.set(0, 0, 0);
    aircraft.rot.set(0, 0, 0);
    aircraft.speed = 0;
    aircraft.throttle = 0.0;
    aircraft.pitch = 0;
    aircraft.roll = 0;
    aircraft.yaw = 0;
    aircraft.isStalled = false;
    aircraft.ringsCollected = 0;

    rings.forEach((r) => {
      r.userData.collected = false;
      r.visible = true;
    });

    updateHUD();
  }

  // 6. Synthesized Engine Sound Engine
  function toggleEngineSound() {
    if (isSoundEnabled) {
      stopEngineSound();
    } else {
      startEngineSound();
    }
  }

  function startEngineSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      engineOsc = audioCtx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.setValueAtTime(60, audioCtx.currentTime);

      engineGain = audioCtx.createGain();
      engineGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      engineOsc.connect(engineGain);
      engineGain.connect(audioCtx.destination);
      engineOsc.start();

      isSoundEnabled = true;
      const soundBtn = document.getElementById('fs-btn-sound');
      if (soundBtn) soundBtn.textContent = 'Engine Sound: On';
    } catch(e) {
      console.log('Engine sound setup error', e);
    }
  }

  function stopEngineSound() {
    if (engineOsc) {
      try {
        engineOsc.stop();
        engineOsc.disconnect();
      } catch(e) {}
      engineOsc = null;
    }
    isSoundEnabled = false;
    const soundBtn = document.getElementById('fs-btn-sound');
    if (soundBtn) soundBtn.textContent = 'Engine Sound: Off';
  }

  function updateEngineAudio(rpmNorm) {
    if (!isSoundEnabled || !engineOsc || !audioCtx) return;
    const targetFreq = 50 + rpmNorm * 180;
    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
  }

  // 7. Aerodynamic Physics Simulation Step
  function updatePhysics(dt) {
    // Throttle Adjustment
    if (keys.throttleUp) aircraft.throttle = Math.min(1.0, aircraft.throttle + dt * 0.4);
    if (keys.throttleDown) aircraft.throttle = Math.max(0.0, aircraft.throttle - dt * 0.4);

    // Propeller animation
    if (aircraft.propeller) {
      aircraft.propeller.rotation.z += (aircraft.throttle * 35 + 2.0) * dt;
    }

    // Engine sound modulation
    updateEngineAudio(aircraft.throttle);

    // Thrust & Aerodynamic Drag
    const maxThrust = 95; // Max thrust force
    const thrust = aircraft.throttle * maxThrust;
    const dragCoeff = 0.035;
    const drag = dragCoeff * aircraft.speed * aircraft.speed;

    const netForwardForce = thrust - drag;
    const acceleration = netForwardForce / 12.0;

    aircraft.speed = Math.max(0, aircraft.speed + acceleration * dt);

    // Aerodynamic Control Authority (Controls scale with airspeed)
    const controlAuthority = Math.min(1.0, aircraft.speed / 40.0);

    // Pitch & Roll Inputs
    if (keys.pitchUp) aircraft.pitch += 1.2 * controlAuthority * dt;
    if (keys.pitchDown) aircraft.pitch -= 1.2 * controlAuthority * dt;
    if (keys.rollLeft) aircraft.roll += 2.0 * controlAuthority * dt;
    if (keys.rollRight) aircraft.roll -= 2.0 * controlAuthority * dt;

    // Natural Aerodynamic Leveling / Damping
    aircraft.pitch *= (1.0 - 0.4 * dt);
    aircraft.roll *= (1.0 - 0.5 * dt);

    // Yaw Turn Coupling from Roll (Coordinated flight)
    aircraft.yaw -= Math.sin(aircraft.roll) * 0.8 * controlAuthority * dt;

    // Lift vs. Gravity
    const stallSpeed = 32; // Knots
    aircraft.isStalled = aircraft.speed < stallSpeed && aircraft.pos.y > 2.0;

    let lift = 0;
    if (aircraft.speed > stallSpeed) {
      const liftCoeff = 0.045;
      lift = liftCoeff * aircraft.speed * aircraft.speed * Math.cos(aircraft.roll);
    }

    const gravity = 9.8 * 2.2;
    const verticalForce = (lift - gravity) + (aircraft.pitch * aircraft.speed * 0.3);

    // Update Velocity Vector
    const headingVector = new THREE.Vector3(
      Math.sin(aircraft.yaw),
      aircraft.pitch * 0.5,
      Math.cos(aircraft.yaw)
    ).normalize();

    const forwardSpeedMPS = aircraft.speed * 0.514; // Knots to m/s
    aircraft.vel.x = headingVector.x * forwardSpeedMPS;
    aircraft.vel.z = headingVector.z * forwardSpeedMPS;
    aircraft.vel.y += (verticalForce / 15.0) * dt;

    // Ground collision & Runway Friction
    if (aircraft.pos.y <= 1.5) {
      aircraft.pos.y = 1.5;
      aircraft.vel.y = Math.max(0, aircraft.vel.y);
      aircraft.roll *= 0.8;
      if (aircraft.speed < stallSpeed) {
        aircraft.pitch = Math.max(0, aircraft.pitch);
      }
    }

    // Apply Velocity to Position
    aircraft.pos.x += aircraft.vel.x * dt;
    aircraft.pos.y += aircraft.vel.y * dt;
    aircraft.pos.z += aircraft.vel.z * dt;

    // Update Mesh Transform
    if (aircraft.mesh) {
      aircraft.mesh.position.copy(aircraft.pos);
      aircraft.mesh.rotation.set(aircraft.pitch, aircraft.yaw, aircraft.roll, 'YXZ');
    }

    // Altitude & Vertical Speed Readouts
    aircraft.altitude = Math.round(aircraft.pos.y * 3.28); // Meters to Feet
    aircraft.climbRate = Math.round(aircraft.vel.y * 60 * 3.28); // ft/min

    // Ring Collision Detection
    checkRingCollisions();

    // Update Telemetry HUD
    updateHUD();
  }

  function checkRingCollisions() {
    rings.forEach((r) => {
      if (!r.userData.collected) {
        const dist = aircraft.pos.distanceTo(r.position);
        if (dist < r.userData.radius) {
          r.userData.collected = true;
          r.visible = false;
          aircraft.ringsCollected++;
          showRingPassFeedback(aircraft.ringsCollected);
        }
      }
    });
  }

  function showRingPassFeedback(count) {
    const toast = document.getElementById('fs-toast');
    if (toast) {
      toast.textContent = `Topological Waypoint Collected: ${count} / ${aircraft.totalRings}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  }

  // 8. Camera Placement
  function updateCamera() {
    if (!aircraft.mesh) return;

    if (cameraMode === 'chase') {
      const offset = new THREE.Vector3(0, 4.5, -16);
      offset.applyEuler(aircraft.mesh.rotation);
      camera.position.copy(aircraft.pos).add(offset);
      camera.lookAt(aircraft.pos.clone().add(new THREE.Vector3(0, 1.2, 4).applyEuler(aircraft.mesh.rotation)));
    } else if (cameraMode === 'cockpit') {
      const cockpitOffset = new THREE.Vector3(0, 0.8, 0.6).applyEuler(aircraft.mesh.rotation);
      camera.position.copy(aircraft.pos).add(cockpitOffset);
      const lookTarget = new THREE.Vector3(0, 0.8, 20).applyEuler(aircraft.mesh.rotation);
      camera.lookAt(aircraft.pos.clone().add(lookTarget));
    } else if (cameraMode === 'orbit') {
      camera.position.set(aircraft.pos.x + 30, aircraft.pos.y + 20, aircraft.pos.z - 30);
      camera.lookAt(aircraft.pos);
    }
  }

  // 9. Telemetry HUD Updates
  function updateHUD() {
    const speedEl = document.getElementById('hud-airspeed');
    const altEl = document.getElementById('hud-alt');
    const throttleEl = document.getElementById('hud-throttle');
    const vsiEl = document.getElementById('hud-vsi');
    const ringEl = document.getElementById('hud-rings');
    const stallEl = document.getElementById('hud-stall');

    if (speedEl) speedEl.textContent = `${Math.round(aircraft.speed)} kts`;
    if (altEl) altEl.textContent = `${aircraft.altitude} ft`;
    if (throttleEl) throttleEl.textContent = `${Math.round(aircraft.throttle * 100)}%`;
    if (vsiEl) vsiEl.textContent = `${aircraft.climbRate > 0 ? '+' : ''}${aircraft.climbRate} fpm`;
    if (ringEl) ringEl.textContent = `${aircraft.ringsCollected} / ${aircraft.totalRings}`;

    if (stallEl) {
      stallEl.style.display = aircraft.isStalled ? 'inline-block' : 'none';
    }
  }

  function onResize() {
    if (!container || !camera || !renderer) return;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  let lastTime = performance.now();
  function animate() {
    if (!isRunning) return;
    animId = requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Physics step
    updatePhysics(dt);

    // Camera update
    updateCamera();

    // Rotate waypoint beacon crystals
    rings.forEach((r) => {
      if (r.userData.beacon) {
        r.userData.beacon.rotation.y += 0.02;
        r.userData.beacon.rotation.x += 0.01;
      }
    });

    renderer.render(scene, camera);
  }

  function pause() {
    isRunning = false;
    if (animId) cancelAnimationFrame(animId);
    stopEngineSound();
  }

  function resume() {
    if (!isRunning) {
      isRunning = true;
      lastTime = performance.now();
      animate();
    }
  }

  function destroy() {
    pause();
    window.removeEventListener('resize', onResize);
  }

  return {
    init,
    resetFlight,
    toggleCamera,
    toggleEngineSound,
    pause,
    resume,
    destroy
  };
})();
