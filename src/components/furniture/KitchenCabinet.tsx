import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting base cabinet with countertop. Local unit cube. Doors face +Z.
export default function KitchenCabinet() {
  const carcass = "#7e7468";
  const door = "#b9b0a1";
  const counter = "#3f3a34";
  const handle = "#2c2a26";

  return (
    <group>
      {/* Carcass */}
      <RoundedBox args={[1, 0.82, 0.92]} radius={0.02} smoothness={2} position={[0, 0.41, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={carcass} roughness={0.7} />
      </RoundedBox>
      {/* Countertop */}
      <RoundedBox args={[1, 0.08, 0.98]} radius={0.02} smoothness={2} position={[0, 0.86, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={counter} roughness={0.4} metalness={0.2} />
      </RoundedBox>
      {/* Door faces */}
      <RoundedBox args={[0.46, 0.66, 0.04]} radius={0.02} smoothness={2} position={[-0.24, 0.4, 0.47]} castShadow>
        <meshStandardMaterial color={door} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.66, 0.04]} radius={0.02} smoothness={2} position={[0.24, 0.4, 0.47]} castShadow>
        <meshStandardMaterial color={door} roughness={0.6} />
      </RoundedBox>
      {/* Handles */}
      <mesh position={[-0.04, 0.4, 0.51]} castShadow>
        <boxGeometry args={[0.03, 0.18, 0.03]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0.04, 0.4, 0.51]} castShadow>
        <boxGeometry args={[0.03, 0.18, 0.03]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}
