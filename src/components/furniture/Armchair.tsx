import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting single armchair. Local unit cube.
export default function Armchair() {
  const fabric = "#9a6f5a";
  const fabricDark = "#86604d";
  const leg = "#3f3a34";

  return (
    <group>
      {/* Base */}
      <RoundedBox args={[0.9, 0.3, 0.9]} radius={0.06} smoothness={4} position={[0, 0.26, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.9} />
      </RoundedBox>
      {/* Seat cushion */}
      <RoundedBox args={[0.66, 0.16, 0.66]} radius={0.07} smoothness={4} position={[0, 0.46, 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.92} />
      </RoundedBox>
      {/* Back cushion */}
      <RoundedBox args={[0.66, 0.42, 0.16]} radius={0.07} smoothness={4} position={[0, 0.62, -0.34]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.92} />
      </RoundedBox>
      {/* Arms */}
      <RoundedBox args={[0.14, 0.4, 0.86]} radius={0.06} smoothness={4} position={[-0.4, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.14, 0.4, 0.86]} radius={0.06} smoothness={4} position={[0.4, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.9} />
      </RoundedBox>
      {/* Feet */}
      {[[-0.34, 0.34], [0.34, 0.34], [-0.34, -0.34], [0.34, -0.34]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.025, 0.12, 10]} />
          <meshStandardMaterial color={leg} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
