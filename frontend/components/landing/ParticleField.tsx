"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField({ count = 500 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      values[i] = (THREE.MathUtils.seededRandom(i + 1) - 0.5) * 20;
    }
    return values;
  }, [count]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 8, 8]}>
        <instancedBufferAttribute attach="attributes-position" args={[particles, 3]} />
      </sphereGeometry>
      <meshBasicMaterial color="#06B6D4" transparent opacity={0.6} />
    </instancedMesh>
  );
}
