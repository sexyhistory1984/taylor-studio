/* Hero: a folded greeting card in front of its envelope, rendered with three.js. Loads after idle, only when WebGL is
   available and the visitor has not asked for reduced motion. The static composition stays as the fallback.
   Ownership: this module owns the card's transform; GSAP/ScrollTrigger only reports scroll progress. */
const stage = document.getElementById('heroStage');
const canvas = document.getElementById('heroCanvas');
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

function webgl() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
  catch (e) { return false; }
}

if (stage && canvas) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (!reduce && !saveData && webgl()) {
    const start = () => import(THREE_URL).then(init).catch(err => console.warn('hero3d: keeping the static card', err));
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 2500 }); else setTimeout(start, 700);
  }
}

function insideTexture(THREE, W, H) {
  const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * H / W);
  const g = c.getContext('2d');
  g.fillStyle = '#fbf7ef'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = 'rgba(27,22,18,.07)'; g.lineWidth = 1;
  for (let y = 120; y < c.height - 40; y += 44) { g.beginPath(); g.moveTo(60, y); g.lineTo(c.width - 60, y); g.stroke(); }
  const font = (document.fonts && document.fonts.check('30px Caveat')) ? 'Caveat' : 'cursive';
  g.fillStyle = '#3a2f2a'; g.font = `500 40px ${font}`; g.textAlign = 'left';
  g.fillText('Write what you mean.', 64, 112);
  g.font = `500 34px ${font}`; g.fillStyle = '#6b1420'; g.textAlign = 'right';
  g.fillText('— T.', c.width - 70, c.height - 80);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

async function init(THREE) {
  const art = stage.dataset.art;
  const aw = Number(stage.dataset.w) || 2, ah = Number(stage.dataset.h) || 3;
  const W = 2, H = 2 * (ah / aw);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
  camera.position.set(0, 0.8, 7.5); camera.lookAt(0, 0.0, 0);

  scene.add(new THREE.HemisphereLight(0xfff6ea, 0xcdbba7, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 1.25);
  key.position.set(3.4, 5.6, 4.6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 22 });
  key.shadow.radius = 5; key.shadow.bias = -0.0006; scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe4d2, 0.35); fill.position.set(-4, 2.2, 3); scene.add(fill);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -H / 2 - 0.03; ground.receiveShadow = true; scene.add(ground);

  // envelope ------------------------------------------------------------
  const env = new THREE.Group();
  const EW = W * 1.3, EH = H * 0.72;
  const body = new THREE.Mesh(new THREE.BoxGeometry(EW, EH, 0.06), new THREE.MeshStandardMaterial({ color: 0xefd9cf, roughness: 0.92 }));
  body.castShadow = true; body.receiveShadow = true; env.add(body);
  const pocket = new THREE.Shape();
  pocket.moveTo(-EW / 2, -EH / 2); pocket.lineTo(EW / 2, -EH / 2); pocket.lineTo(EW / 2, EH / 2); pocket.lineTo(0, -EH * 0.06); pocket.lineTo(-EW / 2, EH / 2); pocket.closePath();
  const pocketMesh = new THREE.Mesh(new THREE.ShapeGeometry(pocket), new THREE.MeshStandardMaterial({ color: 0xe4c1b5, roughness: 0.92 }));
  pocketMesh.position.z = 0.032; env.add(pocketMesh);
  const flapShape = new THREE.Shape(); flapShape.moveTo(-EW / 2, 0); flapShape.lineTo(EW / 2, 0); flapShape.lineTo(0, -EH * 0.6); flapShape.closePath();
  const flap = new THREE.Mesh(new THREE.ShapeGeometry(flapShape), new THREE.MeshStandardMaterial({ color: 0xf5e6dd, roughness: 0.92, side: THREE.DoubleSide }));
  flap.castShadow = true;
  const flapPivot = new THREE.Group(); flapPivot.position.set(0, EH / 2, -0.03); flapPivot.rotation.x = Math.PI * 0.84; flapPivot.add(flap); env.add(flapPivot);
  env.position.set(0.18, -H * 0.2, -0.95); env.rotation.set(-0.36, 0.1, 0.07); scene.add(env);

  // card -----------------------------------------------------------------
  const card = new THREE.Group();
  const paper = new THREE.MeshStandardMaterial({ color: 0xfbf7ef, roughness: 0.95 });
  const insideMat = new THREE.MeshStandardMaterial({ map: insideTexture(THREE, W, H), roughness: 0.95 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.02), [paper, paper, paper, paper, insideMat, paper]);
  back.castShadow = true; back.receiveShadow = true; card.add(back);
  const tex = await new Promise((res, rej) => new THREE.TextureLoader().load(art, res, undefined, rej));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const artMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
  const cover = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.02), [paper, paper, paper, paper, artMat, paper]);
  cover.position.set(W / 2, 0, 0.013); cover.castShadow = true; cover.receiveShadow = true;
  const hinge = new THREE.Group(); hinge.position.x = -W / 2; hinge.add(cover); card.add(hinge);
  card.position.set(0, 0.06, 0.35); scene.add(card);
  const base = { x: -0.05, y: 0.2 };

  // state ----------------------------------------------------------------
  const pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  let open = 0, openTarget = 0.1, scrollOpen = 0, hoverOpen = 0, tapOpen = 0, visible = true, running = false, raf = 0;
  const clock = new THREE.Clock();

  function size() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    camera.position.z = w / h < 0.9 ? 9.2 : 7.5;  // keep the card framed on narrow stages
  }
  function frame() {
    raf = 0;
    if (!visible || document.hidden) { running = false; return; }
    const t = clock.getElapsedTime();
    pointer.x += (target.x - pointer.x) * 0.06; pointer.y += (target.y - pointer.y) * 0.06;
    openTarget = Math.max(0.1, scrollOpen, hoverOpen, tapOpen);
    open += (openTarget - open) * 0.07;
    card.rotation.y = base.y + Math.sin(t * 0.55) * 0.045 + pointer.x * 0.22;
    card.rotation.x = base.x + Math.sin(t * 0.4 + 1) * 0.018 - pointer.y * 0.12;
    card.position.y = 0.06 + Math.sin(t * 0.7) * 0.018;
    hinge.rotation.y = -open;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function run() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }

  size();
  new ResizeObserver(size).observe(stage);
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) run(); }, { threshold: 0.05 }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) run(); });

  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    hoverOpen = 0.42;
  });
  canvas.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; hoverOpen = 0; });
  canvas.addEventListener('click', () => { tapOpen = tapOpen ? 0 : 1.75; });

  // scroll progress opens the card as the hero scrolls away
  const onScroll = p => { scrollOpen = Math.min(1, Math.max(0, p)) * 1.6; };
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({ trigger: stage, start: 'top 20%', end: 'bottom 10%', onUpdate: s => onScroll(s.progress) });
  } else {
    const h = () => { const r = stage.getBoundingClientRect(); onScroll((window.innerHeight * 0.2 - r.top) / (r.height || 1)); };
    addEventListener('scroll', h, { passive: true }); h();
  }

  renderer.render(scene, camera);
  stage.classList.add('is-3d');
  run();
}
