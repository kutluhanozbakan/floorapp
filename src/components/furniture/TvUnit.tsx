import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting TV media console. Local unit cube. Front faces +Z.
export default function TvUnit() {
  const body = "#8a7866";
  const door = "#9c8a76";
  const handle = "#2c2a26";

  return (
    <group>
      {/* Carcass */}
      <RoundedBox args={[1, 0.5, 0.9]} radius={0.03} smoothness={2} position={[0, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.6} />
      </RoundedBox>
      {/* Cabinet doors */}
      {[-0.25, 0.25].map((x, i) => (
        <RoundedBox key={i} args={[0.44, 0.36, 0.04]} radius={0.02} smoothness={2} position={[x, 0.3, 0.46]} castShadow>
          <meshStandardMaterial color={door} roughness={0.55} />
        </RoundedBox>
      ))}
      {/* Handles */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0.5]} castShadow>
          <boxGeometry args={[0.03, 0.12, 0.03]} />
          <meshStandardMaterial color={handle} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      {/* Feet */}
      {[[-0.4, 0.36], [0.4, 0.36], [-0.4, -0.36], [0.4, -0.36]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.02, 0.1, 8]} />
          <meshStandardMaterial color={handle} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
