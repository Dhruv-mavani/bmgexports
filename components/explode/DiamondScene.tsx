"use client";

import { memo, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildBrilliant } from "./brilliantGeometry";
import { buildStudioEnv, createBrilliantMaterial } from "./BrilliantMaterial";
import { stageAt } from "./stages";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ramp = (a: number, b: number, p: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const v = new THREE.Vector3();

// Per-part layout (before the stone's overall scale).
//   y     centre of the part when assembled        lift  how far it travels when exploded
const PARTS = [
  { name: "Table", y: 0.33, lift: 1.0 },
  { name: "Crown", y: 0.19, lift: 0.5 },
  { name: "Girdle", y: 0, lift: 0 },
  { name: "Pavilion", y: -0.45, lift: -0.55 },
  { name: "Culet", y: -0.82, lift: -1.05 },
];

const BASE_GAIN = 1.2;

function Gem({
  geometry,
  envMap,
  progress,
  index,
  bounces,
}: {
  geometry: THREE.BufferGeometry;
  envMap: THREE.Texture;
  progress: RefObject<number>;
  index: number;
  bounces: number;
}) {
  // Each mesh needs its own material instance (it carries a BVH built from that mesh).
  const material = useMemo(
    () => createBrilliantMaterial(geometry, envMap, { bounces, aberration: 0.025, color: "#2a7de0", absorption: 0.32, gain: BASE_GAIN }),
    [geometry, envMap, bounces],
  );

  /* three.js uniforms are mutated per frame by design. */
  /* eslint-disable react-hooks/immutability */
  useFrame(({ camera, size, gl }) => {
    const u = material.uniforms;
    u.viewMatrixInverse.value = camera.matrixWorld;
    u.projectionMatrixInverse.value = camera.projectionMatrixInverse;
    u.resolution.value.set(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio());

    // While exploded, brighten the part being described and dim the rest.
    const p = progress.current ?? 0;
    const active = stageAt(p) - 1; // stages 1–5 describe parts 0–4
    const exploded = p > 0.1 && p < 0.9 && active >= 0 && active < PARTS.length;
    const target = !exploded ? BASE_GAIN : active === index ? BASE_GAIN * 1.3 : BASE_GAIN * 0.7;
    u.gain.value += (target - u.gain.value) * 0.12;
  });
  /* eslint-enable react-hooks/immutability */

  return <mesh geometry={geometry} material={material} />;
}

// Soft elliptical shadow the stone appears to hover over.
function useShadowTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(31,79,216,0.5)");
    g.addColorStop(1, "rgba(31,79,216,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
}

function Diamond({
  progress,
  labels,
  onReady,
  mobile,
  active,
}: {
  progress: RefObject<number>;
  labels: RefObject<(HTMLDivElement | null)[]>;
  onReady?: () => void;
  mobile: boolean;
  active: boolean;
}) {
  const { camera, size, gl, invalidate } = useThree();
  const envMap = useMemo(() => buildStudioEnv(gl), [gl]);
  const shadowMap = useShadowTexture();
  const geo = useMemo(() => buildBrilliant(), []);
  const root = useRef<THREE.Group>(null);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const spinRefs = useRef<(THREE.Group | null)[]>([]);
  const shadow = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  const frames = useRef(0);

  // Phones render on demand, so ask for a frame whenever the scene becomes visible, and only react
  // to scrolling while it is on screen.
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
    if (active) invalidate();
  }, [active, invalidate]);

  // Phones render on demand: ask for a frame on every scroll/resize while the scene is on screen.
  useEffect(() => {
    if (!mobile) return;
    const onScroll = () => {
      if (activeRef.current) invalidate();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mobile, invalidate]);

  useFrame((state) => {
    const p = progress.current ?? 0;
    const e = ramp(0.1, 0.28, p) - ramp(0.8, 0.9, p);
    // Narrow canvases (phones) can't fit a full-size stone: shrink it to the available width.
    const cam = state.camera as THREE.PerspectiveCamera;
    const widthUnits = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z * (size.width / size.height);
    // On phones the open stone shrinks slightly and slides left to leave a column for the part labels.
    const labelSpace = mobile ? 0.95 : 0;
    const fitAssembled = Math.min(1, widthUnits / 3.3);
    const fitOpen = Math.min(1, Math.max(0.3, (widthUnits - labelSpace) / 2.4));
    const fit = fitAssembled + (fitOpen - fitAssembled) * e;
    const scale = (1.5 - 0.5 * e) * fit;
    const shiftX = -(labelSpace / 2) * e;
    // Slow idle drift keeps facets glinting on desktop; phones skip it so the scene can sleep when still.
    const spinY = p * Math.PI * 5 + (mobile ? 0 : state.clock.elapsedTime * 0.12);

    if (root.current) {
      root.current.scale.setScalar(scale);
      root.current.position.x = shiftX;
    }

    PARTS.forEach((part, i) => {
      const g = partRefs.current[i];
      if (g) g.position.set(0, part.lift * e, 0);
      const spin = spinRefs.current[i];
      if (spin) {
        spin.rotation.y = spinY;
        spin.rotation.x = 0.28;
      }

      const el = labels.current?.[i];
      if (!el) return;
      // Project the part's world position to screen space so the DOM label tracks it.
      v.set(shiftX + 1.15 * scale, (part.y + part.lift * e) * scale + 0.1, 0).project(camera);
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * size.width}px, ${(-v.y * 0.5 + 0.5) * size.height}px) translateY(-50%)`;
      el.style.opacity = String(clamp01((e - 0.25 - i * 0.08) / 0.3));
    });

    if (shadow.current) shadow.current.material.opacity = 0.4 * (1 - e);

    // Report ready once a few real frames have drawn (shader compiled, stone on screen).
    if (frames.current < 3) {
      frames.current++;
      invalidate(); // on-demand mode: keep drawing until the first few frames are out
      if (frames.current === 3) onReady?.();
    }
  });

  const parts = [geo.table, geo.crown, geo.girdle, geo.pavilion, geo.culet];

  return (
    <>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} position={[0, -1.55, 0]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={shadowMap} transparent depthWrite={false} opacity={0.5} />
      </mesh>
      <group ref={root} position={[0, 0.1, 0]}>
        {parts.map((geometry, i) => (
          <group key={PARTS[i].name} ref={(g) => void (partRefs.current[i] = g)}>
            <group ref={(g) => void (spinRefs.current[i] = g)}>
              <Gem geometry={geometry} envMap={envMap} progress={progress} index={i} bounces={mobile ? 4 : 6} />
            </group>
          </group>
        ))}
      </group>
    </>
  );
}

function DiamondScene({
  progress,
  labels,
  active,
  onReady,
}: {
  progress: RefObject<number>;
  labels: RefObject<(HTMLDivElement | null)[]>;
  active: boolean;
  onReady?: () => void;
}) {
  // Decided once on the client (this component never renders on the server).
  const [mobile] = useState(() => window.matchMedia("(max-width: 767px), (pointer: coarse)").matches);
  // One fixed resolution (switching it while scrolling clears the canvas and flickers).
  const [phoneDpr] = useState(() => Math.min(window.devicePixelRatio || 1, 1.75));

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 35 }}
      dpr={mobile ? phoneDpr : [1, 1.75]}
      // Phones stay in on-demand mode permanently (switching modes later can swallow the first frame request).
      frameloop={mobile ? "demand" : active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
    >
      <Suspense fallback={null}>
        <Diamond progress={progress} labels={labels} onReady={onReady} mobile={mobile} active={active} />
      </Suspense>
    </Canvas>
  );
}

// Memoised: the parent re-renders on every stage change, which must not re-render (and reconfigure) the canvas.
export default memo(DiamondScene);
