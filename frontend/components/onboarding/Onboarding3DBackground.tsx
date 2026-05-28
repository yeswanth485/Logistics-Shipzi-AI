"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Grid } from "@react-three/drei";

export default function Onboarding3DBackground() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 60;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Store random rotation speeds and positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const random = (offset: number) => THREE.MathUtils.seededRandom(i * 8 + offset);
      const x = (random(1) - 0.5) * 40;
      const y = random(2) * 20;
      const z = (random(3) - 0.5) * 30 - 10;
      const rx = random(4) * Math.PI;
      const ry = random(5) * Math.PI;
      const rz = random(6) * Math.PI;
      const speed = 0.05 + random(7) * 0.1;
      const scale = 0.5 + random(8) * 1.5;
      temp.push({ x, y, z, rx, ry, rz, speed, scale });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        p.rx += p.speed * 0.02;
        p.ry += p.speed * 0.03;
        
        // Gentle float up and down
        const floatY = p.y + Math.sin(Date.now() * 0.001 * p.speed) * 2;
        
        dummy.position.set(p.x, floatY, p.z);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <color attach="background" args={["#050816"]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#06B6D4" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#2563EB" />
      
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.2} />
      </instancedMesh>
      
      <Grid 
        position={[0, -5, 0]} 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#2563EB" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#06B6D4" 
        fadeDistance={50} 
        fadeStrength={1} 
      />
      
      <fog attach="fog" args={["#050816", 10, 40]} />
    </>
  );
}
