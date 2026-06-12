import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting low coffee table with a lower shelf. Local unit cube.
export default function CoffeeTable() {
  const top = "#b5835a";
  const leg = "#7f5539";

  const legs: [number, number][] = [
    [-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42],
  ];

  return (
    <group>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.42, z]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
          <meshStandardMaterial color={leg} roughness={0.6} />
        </mesh>
      ))}
      {/* Lower shelf */}
      <RoundedBox args={[0.84, 0.05, 0.84]} radius={0.02} smoothness={2} position={[0, 0.22, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={leg} roughness={0.6} />
      </RoundedBox>
      {/* Top */}
      <RoundedBox args={[1, 0.07, 1]} radius={0.03} smoothness={3} position={[0, 0.86, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={top} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}
