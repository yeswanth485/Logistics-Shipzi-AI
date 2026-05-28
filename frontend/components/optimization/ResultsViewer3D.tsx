"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

type Vector3Tuple = [number, number, number];

export type OptimizationBox = {
  name?: string;
  dimensions: Vector3Tuple;
};

export type Placement = {
  dimensions: Vector3Tuple;
  position: Vector3Tuple;
  color: string;
};

function BoxContainer({ dimensions }: { dimensions: Vector3Tuple }) {
  return (
    <group position={[0, dimensions[1] / 2, 0]}>
      <mesh>
        <boxGeometry args={dimensions} />
        <meshPhysicalMaterial color="#1e293b" transparent opacity={0.2} roughness={0.1} metalness={0.8} />
        <Edges linewidth={2} threshold={15} color="#475569" />
      </mesh>

      <Text position={[0, -dimensions[1] / 2 - 0.5, dimensions[2] / 2]} fontSize={0.5} color="#94a3b8">
        {dimensions[0]}&quot; L
      </Text>
      <Text position={[dimensions[0] / 2 + 0.5, -dimensions[1] / 2, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.5} color="#94a3b8">
        {dimensions[2]}&quot; W
      </Text>
      <Text position={[-dimensions[0] / 2 - 0.5, 0, dimensions[2] / 2]} rotation={[0, 0, Math.PI / 2]} fontSize={0.5} color="#94a3b8">
        {dimensions[1]}&quot; H
      </Text>
    </group>
  );
}

function ItemBox({ dimensions, position, color }: Placement) {
  return (
    <mesh position={position}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial color={color} roughness={0.4} />
      <Edges linewidth={1} threshold={15} color="#ffffff" />
    </mesh>
  );
}

function Scene({ box, placements }: { box: OptimizationBox; placements: Placement[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <BoxContainer dimensions={box.dimensions} />
      {placements.map((placement, index) => (
        <ItemBox key={`${placement.color}-${index}`} {...placement} />
      ))}
    </group>
  );
}

export default function ResultsViewer3D({
  box,
  placements,
}: {
  box: OptimizationBox;
  placements: Placement[];
}) {
  return (
    <Canvas camera={{ position: [15, 15, 15], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Scene box={box} placements={placements} />
      <OrbitControls enablePan enableZoom enableRotate autoRotate={false} />
    </Canvas>
  );
}
