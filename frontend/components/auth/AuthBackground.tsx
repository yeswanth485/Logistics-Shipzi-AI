"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

function WireframeBox({ position, speed }: { position: [number, number, number], speed: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.002 * speed;
      mesh.current.rotation.y += 0.003 * speed;
      mesh.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.002;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="transparent" opacity={0} />
      <Edges linewidth={1} threshold={15} color="#2563EB" />
    </mesh>
  );
}

function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 200;

  const particles = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      values[i] = (THREE.MathUtils.seededRandom(i + 1) - 0.5) * 20;
    }
    return values;
  }, []);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = (state.clock.getElapsedTime() * 0.2) % 10;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]}>
        <instancedBufferAttribute attach="attributes-position" args={[particles, 3]} />
      </sphereGeometry>
      <meshBasicMaterial color="#06B6D4" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-packiq-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-packiq-blue/20 via-packiq-dark to-packiq-dark"></div>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Particles />
        <WireframeBox position={[-2, 1, -2]} speed={0.8} />
        <WireframeBox position={[2, -1, -3]} speed={1.2} />
        <WireframeBox position={[-1, -2, -1]} speed={0.5} />
        <WireframeBox position={[1.5, 1.5, -4]} speed={1.5} />
      </Canvas>
    </div>
  );
}
