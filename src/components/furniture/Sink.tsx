import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting vanity sink. Local unit cube. Basin faces +Z.
export default function Sink() {
  const cabinet = "#8a8273";
  const counter = "#e7e3da";
  const basin = "#d7d3ca";
  const metal = "#b9bbbd";

  return (
    <group>
      {/* Vanity cabinet */}
      <RoundedBox args={[0.94, 0.7, 0.8]} radius={0.03} smoothness={2} position={[0, 0.37, -0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={cabinet} roughness={0.7} />
      </RoundedBox>
      {/* Countertop */}
      <RoundedBox args={[1, 0.08, 0.9]} radius={0.02} smoothness={2} position={[0, 0.76, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={counter} roughness={0.4} />
      </RoundedBox>
      {/* Basin recess */}
      <mesh position={[0, 0.78, 0.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.2, 0.1, 20]} />
        <meshStandardMaterial color={basin} roughness={0.3} />
      </mesh>
      {/* Faucet */}
      <mesh position={[0, 0.86, -0.32]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.96, -0.24]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.2, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}
