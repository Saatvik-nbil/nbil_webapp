"use client";

import { useEffect, useRef, useState } from "react";

const CUBE_COLOR = 0x2563eb; // brand blue

/**
 * Full-screen intro loader: an exploding instanced-cube (three.js + anime.js)
 * that fills the viewport. Fades out and calls `onDone` once the intro has played.
 */
export function NbilLoader({ onDone }: { onDone: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);

  // Build + run the three.js cube animation (client only).
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { animate, createTimer, stagger, utils } = await import("animejs");
      const { getInstances } = await import("animejs/adapters/three");

      const $container = containerRef.current;
      if (disposed || !$container) return;

      const width = $container.clientWidth || 300;
      const height = $container.clientHeight || 300;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      $container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 4.2;
      scene.add(camera);

      scene.add(new THREE.AmbientLight(0xffffff, 0.25));
      const pointLight = new THREE.PointLight(0xffffff, 8, 20, 0.4);
      pointLight.castShadow = true;
      scene.add(pointLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 2);
      dirLight.position.set(2, 3, 4);
      scene.add(dirLight);

      const gridSize = 4; // cubes per axis
      const cellSize = 2 / gridSize; // size of each cube
      const spread = ((gridSize - 1) / 2) * cellSize; // distance from center to the outer cubes
      const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
      const material = new THREE.MeshLambertMaterial({ color: CUBE_COLOR });
      const mesh = new THREE.InstancedMesh(geometry, material, gridSize * gridSize * gridSize);
      mesh.castShadow = mesh.receiveShadow = true;
      scene.add(mesh);

      const instances = getInstances(mesh);

      utils.set(instances, {
        x: stagger([-spread, spread], { grid: [gridSize, gridSize, gridSize], axis: "x" }),
        y: stagger([-spread, spread], { grid: [gridSize, gridSize, gridSize], axis: "y" }),
        z: stagger([-spread, spread], { grid: [gridSize, gridSize, gridSize], axis: "z" }),
      });

      const meshAnim = animate(mesh, {
        rotateY: { to: 360, duration: 9000 },
        rotateX: { to: 360, duration: 12000 },
        loop: true,
        ease: "inOutQuad",
      });

      const lightAnim = animate(pointLight, {
        intensity: [30, 0],
        duration: 2500,
        loop: true,
        loopDelay: 500,
        alternate: true,
        ease: "out(3)",
      });

      const explodeAnim = animate(instances, {
        // anime.js passes the animated instance as the target of each function value.
        x: (instance: any) => instance.x * 10,
        y: (instance: any) => instance.y * 10,
        z: (instance: any) => instance.z * 10,
        duration: 2000,
        delay: stagger([0, 500], { grid: true, from: "center", reversed: true, ease: "in(3)" }),
        loop: true,
        loopDelay: 500,
        alternate: true,
        ease: "inOutExpo",
      });

      const timer = createTimer({ onUpdate: () => renderer.render(scene, camera) });

      cleanup = () => {
        timer.pause();
        meshAnim.pause();
        lightAnim.pause();
        explodeAnim.pause();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === $container) {
          $container.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // Play for a beat, then fade out and hand control back to the site.
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 4200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100000] bg-[var(--color-canvas)] transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

export default NbilLoader;
