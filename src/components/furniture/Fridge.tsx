import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting two-door fridge. Local unit cube. Front faces +Z.
export default function Fridge() {
  const body = "#e9ebee";
  const door = "#f3f5f7";
  const seam = "#cdd1d6";
  const handle = "#9aa0a6";

  return (
    <group>
      {/* Body */}
      <RoundedBox args={[1, 1, 0.94]} radius={0.04} smoothness={3} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.4} metalness={0.2} />
      </RoundedBox>
      {/* Upper door (fridge) */}
      <RoundedBox args={[0.9, 0.62, 0.04]} radius={0.03} smoothness={2} position={[0, 0.66, 0.48]} castShadow>
        <meshStandardMaterial color={door} roughness={0.35} metalness={0.25} />
      </RoundedBox>
      {/* Lower door (freezer) */}
      <RoundedBox args={[0.9, 0.3, 0.04]} radius={0.03} smoothness={2} position={[0, 0.22, 0.48]} castShadow>
        <meshStandardMaterial color={door} roughness={0.35} metalness={0.25} />
      </RoundedBox>
      {/* Seam */}
      <mesh position={[0, 0.4, 0.49]}>
        <boxGeometry args={[0.9, 0.012, 0.01]} />
        <meshStandardMaterial color={seam} roughness={0.5} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.36, 0.66, 0.52]} castShadow>
        <boxGeometry args={[0.04, 0.4, 0.05]} />
        <meshStandardMaterial color={handle} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-0.36, 0.22, 0.52]} castShadow>
        <boxGeometry args={[0.04, 0.2, 0.05]} />
        <meshStandardMaterial color={handle} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}
