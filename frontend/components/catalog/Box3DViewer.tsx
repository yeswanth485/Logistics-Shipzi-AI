"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";

function RotatingBox({ dimensions, type }: { dimensions: [number, number, number], type: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (mesh.current && !hovered) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const isCorrugated = type.toLowerCase().includes('corrugated');
  const baseColor = isCorrugated ? "#8B5A2B" : "#e2e8f0"; // Brown for corrugated, white/gray for poly

  return (
    <mesh 
      ref={mesh} 
      onPointerOver={() => setHover(true)} 
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial 
        color={baseColor} 
        roughness={isCorrugated ? 0.9 : 0.4} 
        metalness={0.1}
      />
      <Edges linewidth={1} threshold={15} color="#000000" />
    </mesh>
  );
}

export default function Box3DViewer({ 
  length, width, height, type 
}: { 
  length: number, width: number, height: number, type: string 
}) {
  // Scale down dimensions to fit in view
  const maxDim = Math.max(length, width, height);
  const scale = 3 / maxDim;
  
  const scaledDims: [number, number, number] = [
    length * scale,
    height * scale,
    width * scale
  ];

  return (
    <div className="h-full w-full bg-black/20">
      <Canvas camera={{ position: [4, 4, 4], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 5, -5]} intensity={0.3} />
        
        <RotatingBox dimensions={scaledDims} type={type} />
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
