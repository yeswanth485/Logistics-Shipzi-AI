"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

export default function HeroBox3D() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <boxGeometry args={[3, 2.5, 3]} />
        <meshPhysicalMaterial 
          color="#050816" 
          transparent 
          opacity={0.8}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
        <Edges
          linewidth={2}
          threshold={15}
          color="#2563EB"
        />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#06B6D4" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#2563EB" intensity={2} />
    </group>
  );
}
