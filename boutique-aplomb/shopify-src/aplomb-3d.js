/**
 * Aplomb — rendu 3D du thème Shopify (three.js, sans framework).
 * Compilé dans shopify-theme/assets/aplomb-3d.js par `npm run shopify:build`.
 *
 * PROTOTYPE PROCÉDURAL : rendu indicatif d'un support pliable en « Z ».
 * Si un modèle GLB est renseigné dans l'éditeur de thème, il remplace le prototype.
 *
 * Éléments pris en charge : <div data-aplomb-3d data-mode="hero|story" data-color="#C9CCD1" data-model-url="">
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const lerp = THREE.MathUtils.lerp;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowPower = () =>
  window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4 || (navigator.deviceMemory ?? 8) <= 4;

const BASE = { w: 2.5, h: 0.05, d: 2.2 };
const ARM_LEN = 1.75;
const HINGE_Z = 0.95;
const TRAY = { w: 2.45, d: 2.2, hingeFromBack: 0.35 };

const HERO_CAMERA = { position: [4.6, 3.1, 5.2], target: [0, 0.55, 0] };
const STORY_KEYS = [
  { fold: 0, highlight: "none", camera: { position: [4.5, 5.9, 6.2], target: [0, 0.1, 0] } },
  { fold: 1, highlight: "hinge", camera: { position: [8.7, 2.0, 0.6], target: [0, 0.6, 0] } },
  { fold: 1, highlight: "tray", camera: { position: [0.8, 9.0, 3.4], target: [0, 0.8, 0] } },
  { fold: 1, highlight: "pads", camera: { position: [-5.3, 3.1, 6.7], target: [0, 0.5, 0] } },
];

function rbox(w, h, d, r, mat) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, r), mat);
}

function buildStand(color) {
  const mats = {
    metal: new THREE.MeshPhysicalMaterial({ color, metalness: 0.92, roughness: 0.34, clearcoat: 0.25, clearcoatRoughness: 0.4 }),
    metalDark: new THREE.MeshPhysicalMaterial({ color: new THREE.Color(color).multiplyScalar(0.7), metalness: 0.9, roughness: 0.42 }),
    hinge: new THREE.MeshStandardMaterial({ color: "#1d1f22", metalness: 0.6, roughness: 0.5, emissive: "#a44a23", emissiveIntensity: 0 }),
    pad: new THREE.MeshStandardMaterial({ color: "#26282b", roughness: 0.9, metalness: 0, emissive: "#d9875f", emissiveIntensity: 0 }),
    glow: new THREE.MeshBasicMaterial({ color: "#d9875f", transparent: true, opacity: 0 }),
  };
  const root = new THREE.Group();

  const base = rbox(BASE.w, BASE.h, BASE.d, 0.02, mats.metal);
  base.position.y = BASE.h / 2;
  root.add(base);
  for (const x of [-1, 1])
    for (const z of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 20), mats.pad);
      foot.position.set(x * 1.05, -0.01, z * 0.9);
      root.add(foot);
    }

  const frontHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, BASE.w - 0.2, 24), mats.hinge);
  frontHinge.rotation.z = Math.PI / 2;
  frontHinge.position.set(0, BASE.h + 0.03, HINGE_Z);
  root.add(frontHinge);

  const arm = new THREE.Group();
  arm.position.set(0, BASE.h + 0.03, HINGE_Z);
  for (const x of [-1, 1]) {
    const bar = rbox(0.12, 0.05, ARM_LEN, 0.018, mats.metalDark);
    bar.position.set(x * 1.0, 0, -ARM_LEN / 2);
    arm.add(bar);
  }
  const cross = rbox(2.12, 0.05, 0.16, 0.018, mats.metalDark);
  cross.position.set(0, 0, -ARM_LEN + 0.08);
  arm.add(cross);
  root.add(arm);

  const tray = new THREE.Group();
  const inner = new THREE.Group();
  inner.position.z = TRAY.d / 2 - TRAY.hingeFromBack;
  tray.add(inner);
  const trayHinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, TRAY.w - 0.3, 24), mats.hinge);
  trayHinge.rotation.z = Math.PI / 2;
  trayHinge.position.set(0, -0.01, -TRAY.d / 2 + TRAY.hingeFromBack);
  inner.add(trayHinge);
  for (const x of [-1, 1]) {
    const rail = rbox(0.16, 0.045, TRAY.d, 0.018, mats.metal);
    rail.position.x = x * (TRAY.w / 2 - 0.08);
    inner.add(rail);
  }
  const slats = 7;
  const gap = TRAY.d / (slats * 2 + 1);
  for (let i = 0; i < slats; i++) {
    const slat = rbox(TRAY.w - 0.3, 0.035, gap, 0.012, mats.metal);
    slat.position.z = -TRAY.d / 2 + gap * (2 * i + 1.5);
    inner.add(slat);
  }
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(TRAY.w, TRAY.d), mats.glow);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.03;
  inner.add(glow);
  for (const x of [-1, 1]) {
    const pad = rbox(0.1, 0.02, TRAY.d - 0.5, 0.008, mats.pad);
    pad.position.set(x * 0.75, 0.032, 0.05);
    inner.add(pad);
  }
  const lip = rbox(TRAY.w, 0.16, 0.05, 0.02, mats.metal);
  lip.position.set(0, 0.06, TRAY.d / 2 - 0.025);
  inner.add(lip);
  root.add(tray);

  let fold = null;
  const g = { hinge: 0, tray: 0, pads: 0 };
  return {
    root,
    setColor(c) {
      mats.metal.color.set(c);
      mats.metalDark.color.set(c).multiplyScalar(0.7);
    },
    update(state, dt) {
      const k = 1 - Math.exp(-dt * 6);
      fold = fold === null ? state.fold : lerp(fold, state.fold, k);
      const a1 = lerp(0.035, 0.78, fold);
      const tilt = lerp(0, 0.24, fold);
      arm.rotation.x = a1;
      tray.position.set(0, BASE.h + Math.sin(a1) * ARM_LEN + 0.03, HINGE_Z - Math.cos(a1) * ARM_LEN);
      tray.rotation.x = tilt;
      g.hinge = lerp(g.hinge, state.highlight === "hinge" ? 1 : 0, k);
      g.tray = lerp(g.tray, state.highlight === "tray" ? 1 : 0, k);
      g.pads = lerp(g.pads, state.highlight === "pads" ? 1 : 0, k);
      mats.hinge.emissiveIntensity = g.hinge * 1.6;
      mats.pad.emissiveIntensity = g.pads * 1.4;
      mats.glow.opacity = g.tray * 0.35;
    },
  };
}

/** Ombre douce au sol (texture radiale, sans calcul d'ombres temps réel). */
function groundShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const grd = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, "rgba(21,23,26,0.42)");
  grd.addColorStop(1, "rgba(21,23,26,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = -0.02;
  return m;
}

function mount(el) {
  if (el.dataset.ready) return;
  el.dataset.ready = "1";
  const mode = el.dataset.mode === "story" ? "story" : "hero";
  const rm = reducedMotion();
  const lp = lowPower();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !lp, alpha: true, powerPreference: lp ? "low-power" : "high-performance" });
  } catch {
    return; // WebGL indisponible : l'illustration de remplacement reste affichée.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lp ? 1.4 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "aplomb-3d__canvas";
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2cf, 0.5);
  rim.position.set(-5, 3, -2);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  const startCam = mode === "story" ? STORY_KEYS[0].camera : HERO_CAMERA;
  camera.position.set(...startCam.position);
  const target = new THREE.Vector3(...startCam.target);
  camera.lookAt(target);

  const stage = new THREE.Group();
  scene.add(stage);
  stage.add(groundShadow());
  const state = { fold: mode === "story" ? 0 : rm ? 1 : 0, highlight: "none" };
  let stand = null;

  const modelUrl = el.dataset.modelUrl;
  if (modelUrl) {
    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        stage.add(gltf.scene);
        el.classList.add("is-ready");
      },
      undefined,
      () => el.classList.remove("is-ready"),
    );
  } else {
    stand = buildStand(el.dataset.color || "#C9CCD1");
    stage.add(stand.root);
    el.classList.add("is-ready");
  }

  let controls = null;
  if (mode === "hero") {
    controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.autoRotate = !rm;
    controls.autoRotateSpeed = 0.55;
    controls.minPolarAngle = 0.55;
    controls.maxPolarAngle = 1.42;
    controls.rotateSpeed = 0.7;
    if (!rm) setTimeout(() => (state.fold = 1), 350);
  }

  // Récit : l'étape visible pilote pliage, mise en avant et caméra.
  let camKey = startCam;
  if (mode === "story") {
    const section = el.closest("[data-story]");
    const steps = section ? section.querySelectorAll("[data-story-step]") : [];
    const dots = section ? section.querySelectorAll("[data-story-dot]") : [];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Math.min(Number(e.target.dataset.storyStep), STORY_KEYS.length - 1);
          const k = STORY_KEYS[i];
          state.fold = k.fold;
          state.highlight = k.highlight;
          camKey = k.camera;
          steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
          dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => io.observe(s));
  }

  // Couleur : pastilles de finition dans la même section.
  el.closest("[data-aplomb-viewer]")
    ?.querySelectorAll("[data-swatch]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        stand?.setColor(b.dataset.swatch);
        b.parentElement.querySelectorAll("[data-swatch]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      }),
    );

  const resize = () => {
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(el);
  resize();

  // Rendu suspendu hors écran pour économiser batterie et GPU.
  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);

  const clock = new THREE.Clock();
  let intro = rm ? 1 : 0;
  const camPos = new THREE.Vector3();
  const camTgt = new THREE.Vector3();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!visible) return;
    intro = Math.min(1, intro + dt / 1.4);
    const e = 1 - Math.pow(1 - intro, 3);
    stage.scale.setScalar(0.86 + 0.14 * e);
    const scroll = mode === "hero" && !rm ? Math.min(window.scrollY / window.innerHeight, 1) : 0;
    stage.position.y = (1 - e) * -0.4 + scroll * 0.5;
    stage.rotation.y = (1 - e) * -0.6 + scroll * 0.5;
    stand?.update(state, dt);
    if (controls) controls.update();
    else {
      const k = rm ? 1 : 1 - Math.exp(-dt * 3.5);
      camera.position.lerp(camPos.set(...camKey.position), k);
      target.lerp(camTgt.set(...camKey.target), k);
      camera.lookAt(target);
    }
    renderer.render(scene, camera);
  });
}

function init() {
  document.querySelectorAll("[data-aplomb-3d]").forEach(mount);
}
init();
document.addEventListener("shopify:section:load", init);
