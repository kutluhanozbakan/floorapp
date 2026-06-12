import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting shower enclosure. Local unit cube. Glass on +X / +Z corner.
export default function Shower() {
  const tray = "#e7e3da";
  const wall = "#cfcabf";
  const metal = "#c7cace";

  return (
    <group>
      {/* Tray */}
      <RoundedBox args={[1, 0.1, 1]} radius={0.03} smoothness={2} position={[0, 0.05, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={tray} roughness={0.4} />
      </RoundedBox>
      {/* Back walls (two solid tiled sides at -X and -Z) */}
      <mesh position={[-0.48, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.9, 1]} />
        <meshStandardMaterial color={wall} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, -0.48]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.9, 0.04]} />
        <meshStandardMaterial color={wall} roughness={0.5} />
      </mesh>
      {/* Glass panels (front + right) */}
      <mesh position={[0, 0.55, 0.48]}>
        <boxGeometry args={[1, 0.9, 0.03]} />
        <meshPhysicalMaterial color="#cfe8f2" transparent opacity={0.3} roughness={0.05} transmission={0.9} />
      </mesh>
      <mesh position={[0.48, 0.55, 0]}>
        <boxGeometry args={[0.03, 0.9, 1]} />
        <meshPhysicalMaterial color="#cfe8f2" transparent opacity={0.3} roughness={0.05} transmission={0.9} />
      </mesh>
      {/* Shower head */}
      <mesh position={[-0.4, 0.92, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Riser rail */}
      <mesh position={[-0.46, 0.6, -0.46]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}
