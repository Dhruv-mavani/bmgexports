import * as THREE from "three";
import { MeshBVH, MeshBVHUniformStruct, SAH, shaderIntersectFunction, shaderStructs } from "three-mesh-bvh";

// Ray-traced gem shader. Adapted from the MeshRefractionMaterial in @react-three/drei (MIT, by N8Programs),
// with three additions:
//   • Beer–Lambert absorption: light is tinted by how far it travelled inside the stone, so blue deepens
//     where the path is long instead of being a flat colour overlay.
//   • A Fresnel reflection off the front surface (the glint you see on the table and crown).
//   • Full per-channel dispersion (separate rays for R, G and B) and a brightness gain.

const vertexShader = /* glsl */ `
  uniform mat4 viewMatrixInverse;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying mat4 vModelMatrixInverse;

  void main() {
    vModelMatrixInverse = inverse(modelMatrix);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize((viewMatrixInverse * vec4(normalMatrix * normal, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  #define ENVMAP_TYPE_CUBE_UV
  precision highp isampler2D;
  precision highp usampler2D;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying mat4 vModelMatrixInverse;

  uniform samplerCube envMap;
  uniform float bounces;
  ${shaderStructs}
  ${shaderIntersectFunction}
  uniform BVH bvh;
  uniform float ior;
  uniform vec2 resolution;
  uniform float reflection;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrixInverse;
  uniform mat4 viewMatrixInverse;
  uniform float aberrationStrength;
  uniform vec3 color;
  uniform float absorption;
  uniform float gain;

  // Follows a ray through the stone; returns the exit direction and how far it travelled inside.
  vec3 totalInternalReflection(vec3 ro, vec3 rd, vec3 normal, float n, mat4 modelMatrixInverse, out float pathLen) {
    vec3 rayDirection = refract(rd, normal, 1.0 / n);
    vec3 rayOrigin = vWorldPosition + rayDirection * 0.001;
    rayOrigin = (modelMatrixInverse * vec4(rayOrigin, 1.0)).xyz;
    rayDirection = normalize((modelMatrixInverse * vec4(rayDirection, 0.0)).xyz);
    pathLen = 0.0;

    for (float i = 0.0; i < bounces; i++) {
      uvec4 faceIndices = uvec4(0u);
      vec3 faceNormal = vec3(0.0, 0.0, 1.0);
      vec3 barycoord = vec3(0.0);
      float side = 1.0;
      float dist = 0.0;
      bvhIntersectFirstHit(bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist);
      pathLen += dist;

      vec3 hitPos = rayOrigin + rayDirection * max(dist - 0.001, 0.0);
      vec3 tempDir = refract(rayDirection, faceNormal, n);
      if (length(tempDir) != 0.0) {
        rayDirection = tempDir;
        break;
      }
      rayDirection = reflect(rayDirection, faceNormal);
      rayOrigin = hitPos + rayDirection * 0.01;
    }
    return normalize((modelMatrix * vec4(rayDirection, 0.0)).xyz);
  }

  #include <common>
  #include <cube_uv_reflection_fragment>

  vec3 sampleEnv(vec3 dir, vec3 camDir) {
    return textureGrad(envMap, dir, dFdx(camDir), dFdy(camDir)).rgb;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 camDir = (projectionMatrixInverse * vec4(uv * 2.0 - 1.0, 0.0, 1.0)).xyz;
    camDir = normalize((viewMatrixInverse * vec4(camDir, 0.0)).xyz);

    vec3 normal = vNormal;
    vec3 viewDir = normalize(vWorldPosition - cameraPosition);
    float n = max(ior, 1.0);

    float pathLen;
    vec3 dirG = totalInternalReflection(cameraPosition, viewDir, normal, n, vModelMatrixInverse, pathLen);
    // Dispersion: fan red and blue slightly either side of the traced (green) ray.
    vec3 spread = normalize(cross(dirG, normal) + 1e-4) * aberrationStrength;
    vec3 dirR = normalize(dirG + spread);
    vec3 dirB = normalize(dirG - spread);

    vec3 env = vec3(sampleEnv(dirR, camDir).r, sampleEnv(dirG, camDir).g, sampleEnv(dirB, camDir).b);
    // Colour is the transmitted tint; the longer the path, the more of everything else is absorbed.
    vec3 absorb = exp(-(vec3(1.0) - color) * absorption * pathLen);
    vec3 transmitted = env * absorb * gain;

    // Schlick Fresnel for the first-surface reflection (diamond F0 ≈ 0.17).
    float f0 = pow((n - 1.0) / (n + 1.0), 2.0);
    float cosT = clamp(dot(-viewDir, normal), 0.0, 1.0);
    float fres = f0 + (1.0 - f0) * pow(1.0 - cosT, 5.0);
    vec3 reflected = sampleEnv(reflect(viewDir, normal), camDir);

    gl_FragColor = vec4(mix(transmitted, reflected, clamp(fres * reflection, 0.0, 1.0)), 1.0);
    #include <colorspace_fragment>
  }
`;

export type BrilliantParams = {
  bounces?: number;
  ior?: number;
  aberration?: number;
  color?: THREE.ColorRepresentation;
  absorption?: number;
  gain?: number;
  reflection?: number;
};

export function createBrilliantMaterial(
  geometry: THREE.BufferGeometry,
  envMap: THREE.CubeTexture | THREE.Texture,
  p: BrilliantParams = {},
) {
  const bvh = new MeshBVHUniformStruct();
  bvh.updateFrom(new MeshBVH(geometry.clone(), { strategy: SAH }));

  // cube-uv defines required by three's cube_uv chunk (unused for a real cube map, but must compile).
  const lodMax = Math.floor(Math.log2(1024 / 4));
  const cubeSize = Math.pow(2, lodMax);
  const width = 3 * Math.max(cubeSize, 16 * 7);

  return new THREE.ShaderMaterial({
    defines: {
      CUBEUV_TEXEL_WIDTH: `${1 / width}`,
      CUBEUV_TEXEL_HEIGHT: `${1 / (4 * cubeSize)}`,
      CUBEUV_MAX_MIP: `${lodMax}.0`,
    },
    uniforms: {
      envMap: { value: envMap },
      bvh: { value: bvh },
      bounces: { value: p.bounces ?? 6 },
      ior: { value: p.ior ?? 2.42 },
      aberrationStrength: { value: p.aberration ?? 0.05 },
      color: { value: new THREE.Color(p.color ?? "#3b9bd9") },
      absorption: { value: p.absorption ?? 0.6 },
      gain: { value: p.gain ?? 1.2 },
      reflection: { value: p.reflection ?? 1 },
      resolution: { value: new THREE.Vector2(1, 1) },
      viewMatrixInverse: { value: new THREE.Matrix4() },
      projectionMatrixInverse: { value: new THREE.Matrix4() },
    },
    vertexShader,
    fragmentShader,
  });
}

// ── Studio environment ─────────────────────────────────────────────────────────
// Diamonds sparkle against contrast: a few small, very bright sources and large dark gaps between them.
export function buildStudioEnv(gl: THREE.WebGLRenderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x6f9ff0); // blue fill so the stone body reads as vivid blue, never black

  const panel = (w: number, h: number, pos: [number, number, number], intensity: number, color = "#ffffff") => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  };

  panel(9, 9, [0, 9, 1], 1.6, "#eaf3ff"); // overhead softbox
  panel(1.2, 9, [-8, 2, 4], 14); // key strips
  panel(1.2, 9, [8, 1, 3], 14, "#d6e9ff");
  panel(2, 8, [-3, 3, -8], 10); // rim strips
  panel(2, 8, [4, -1, -8], 10, "#cfe3ff");
  panel(14, 14, [0, -9, 0], 1.2, "#a8cbff"); // blue floor bounce
  // Deep royal-blue flags: give facets depth and contrast without ever going black.
  panel(7, 7, [-6, -2, -5], 0.35, "#2d5be0");
  panel(7, 7, [6, -3, 4], 0.3, "#2d5be0");
  panel(6, 6, [0, 1, -9], 0.3, "#1f4fd8");
  panel(5, 5, [-7, 4, 1], 0.4, "#2d5be0");
  // Small, hot sources — these become the sharp glints.
  const hot: [number, number, number][] = [
    [5, 5, 5],
    [-5, 4, 6],
    [2, 7, -4],
    [-6, -2, -4],
    [0, -6, 6],
    [7, 0, -3],
    [-2, 6, 5],
  ];
  hot.forEach((pos) => panel(0.6, 0.6, pos, 70));

  const target = new THREE.WebGLCubeRenderTarget(512, {
    type: THREE.HalfFloatType,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  new THREE.CubeCamera(0.1, 100, target).update(gl, scene);
  scene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  return target.texture;
}
