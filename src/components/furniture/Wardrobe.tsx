import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting model: local x,z ∈ [-0.5, 0.5], y ∈ [0, 1].
export default function Wardrobe() {
  const body = "#9b8f7e";
  const door = "#a89c8a";
  const handle = "#33302b";

  return (
    <group>
      {/* Body */}
      <RoundedBox args={[1, 1, 1]} radius={0.02} smoothness={2} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.7} />
      </RoundedBox>

      {/* Door faces */}
      <RoundedBox args={[0.46, 0.94, 0.04]} radius={0.02} smoothness={2} position={[-0.24, 0.5, 0.49]} castShadow receiveShadow>
        <meshStandardMaterial color={door} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.46, 0.94, 0.04]} radius={0.02} smoothness={2} position={[0.24, 0.5, 0.49]} castShadow receiveShadow>
        <meshStandardMaterial color={door} roughness={0.6} />
      </RoundedBox>

      {/* Handles */}
      <mesh position={[-0.04, 0.5, 0.53]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.04, 0.5, 0.53]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Feet */}
      {[[-0.42, 0.42], [0.42, 0.42], [-0.42, -0.42], [0.42, -0.42]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshStandardMaterial color={handle} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
