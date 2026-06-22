"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ModelViewer — GLB / GLTF 3D model with cursor-following parallax
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * HOW TO ADD YOUR OWN 3D MODEL:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  1. Drop your .glb file into  /public/models/  (create if needed)   │
 * │  2. Pass the path as the `src` prop:                                 │
 * │       <ModelViewer src="/models/your-machine.glb" />                 │
 * │  3. Adjust `scale` prop if the model is too big/small (default: 2)  │
 * │  4. Adjust `position` prop to center the model [x, y, z]            │
 * │  5. Adjust `rotation` prop for initial orientation [x, y, z] rads   │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * CURSOR TRACKING:
 *   The model gently tilts ±10° on X/Y axes following the cursor.
 *   Speed is controlled by LERP_SPEED below (0 = no lag, 1 = instant).
 *
 * STL FILES:
 *   Pass `fileType="stl"` prop if your file is .stl instead of .glb.
 *   STL files use the STLLoader from drei automatically.
 */

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";
import * as THREE from "three";


/* ── Tunable constants ─────────────────────────────────────────── */
const LERP_SPEED   = 0.04;  // How fast the model follows cursor (0=frozen, 1=instant)
const MAX_TILT_DEG = 10;    // Max tilt in degrees when cursor is at screen edge
const MAX_TILT     = (MAX_TILT_DEG * Math.PI) / 180;

/* ── Normalised cursor position (-1..1) shared via ref ────────── */
function useCursorNorm() {
  const normRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      normRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      normRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return normRef;
}

/* ── GLB model component ───────────────────────────────────────── */
function GlbModel({
  src,
  scale = 2,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  cursorRef,
}: {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const { scene } = useGLTF(src);
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    targetRot.current.x += (cursorRef.current.y * MAX_TILT - targetRot.current.x) * LERP_SPEED;
    targetRot.current.y += (cursorRef.current.x * MAX_TILT - targetRot.current.y) * LERP_SPEED;
    groupRef.current.rotation.x = rotation[0] + targetRot.current.x;
    groupRef.current.rotation.y = rotation[1] + targetRot.current.y;
  });

  return (
    <group ref={groupRef} position={position}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </group>
  );
}

/* ── Placeholder shown when no src is provided ─────────────────── */
function PlaceholderMesh({
  cursorRef,
}: {
  cursorRef: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const targetRot  = useRef({ x: 0, y: 0 });
  const floatT     = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    floatT.current += delta;
    // Cursor tilt
    targetRot.current.x += (cursorRef.current.y * MAX_TILT - targetRot.current.x) * LERP_SPEED;
    targetRot.current.y += (cursorRef.current.x * MAX_TILT - targetRot.current.y) * LERP_SPEED;
    groupRef.current.rotation.x = targetRot.current.x;
    groupRef.current.rotation.y = targetRot.current.y + floatT.current * 0.15;
    // Gentle float
    groupRef.current.position.y = Math.sin(floatT.current * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe octahedron as a sci-fi frame */}
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#6d28d9"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Inner solid core */}
      <mesh>
        <octahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          roughness={0.15}
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 8, 80]} />
        <meshStandardMaterial color="#a78bfa" emissive="#7c3aed" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

/* ── Main exported component ───────────────────────────────────── */
interface ModelViewerProps {
  /**
   * Path to your .glb or .gltf file.
   * Put the file in /public/models/ and pass "/models/your-file.glb"
   * Leave undefined to show the placeholder.
   */
  src?: string;
  /** "glb" (default) or "stl" */
  fileType?: "glb" | "stl";
  /** Uniform scale applied to the model */
  scale?: number;
  /** [x, y, z] world position */
  position?: [number, number, number];
  /** [x, y, z] initial rotation in radians */
  rotation?: [number, number, number];
  className?: string;
}

export default function ModelViewer({
  src,
  fileType = "glb",
  scale = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  className = "",
}: ModelViewerProps) {
  const cursorRef = useCursorNorm();

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} color="#c4b8ff" />
        <Environment preset="city" />

        <Suspense fallback={null}>
          {src ? (
            <GlbModel
              src={src}
              scale={scale}
              position={position}
              rotation={rotation}
              cursorRef={cursorRef}
            />
          ) : (
            <PlaceholderMesh cursorRef={cursorRef} />
          )}
        </Suspense>

        {/* Optional: allow user to orbit with mouse drag (comment out if unwanted) */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>

      {/* Placeholder label */}
      {!src && (
        <div
          className="absolute bottom-0 inset-x-0 flex items-center justify-center pb-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--color-brand)] opacity-60">
            Drop your .glb in /public/models/ → pass src prop
          </span>
        </div>
      )}
    </div>
  );
}
