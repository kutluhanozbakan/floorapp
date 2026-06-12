import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting bathtub. Local unit cube. Scale e.g. [1.7, 0.6, 0.8].
export default function Bathtub() {
  const shell = "#f4f4f2";
  const well = "#dfe7ea";
  const metal = "#b9bbbd";

  return (
    <group>
      {/* Outer shell */}
      <RoundedBox args={[1, 0.86, 1]} radius={0.12} smoothness={4} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={shell} roughness={0.35} />
      </RoundedBox>
      {/* Inner well */}
      <RoundedBox args={[0.82, 0.6, 0.74]} radius={0.12} smoothness={4} position={[0, 0.62, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={well} roughness={0.25} />
      </RoundedBox>
      {/* Faucet at one end */}
      <mesh position={[-0.4, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.16, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.34, 0.86, 0]} rotation={[0, 0, -Math.PI / 2.5]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.16, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}
