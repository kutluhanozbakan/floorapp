import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting model: local x,z ∈ [-0.5, 0.5], y ∈ [0, 1].
export default function Table() {
  const top = "#b5835a";
  const topEdge = "#9c6b44";
  const leg = "#7f5539";

  const legs: [number, number][] = [
    [-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42],
  ];

  return (
    <group>
      {/* Legs */}
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.45, z]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color={leg} roughness={0.6} />
        </mesh>
      ))}

      {/* Apron */}
      <mesh position={[0, 0.84, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
        <meshStandardMaterial color={topEdge} roughness={0.6} />
      </mesh>

      {/* Top */}
      <RoundedBox args={[1, 0.07, 1]} radius={0.025} smoothness={3} position={[0, 0.93, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={top} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}
