import React from "react";

// Floor-resting floor lamp. Local x,z ∈ [-0.5,0.5], y ∈ [0,1].
export default function Lamp() {
  const metal = "#52514c";
  const shade = "#efe6d2";

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
        <meshStandardMaterial color={metal} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.28, 0.26, 24, 1, true]} />
        <meshStandardMaterial color={shade} roughness={0.8} side={2} emissive="#f5e8c8" emissiveIntensity={0.35} />
      </mesh>
      {/* Shade top cap */}
      <mesh position={[0, 1.02, 0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshStandardMaterial color={shade} roughness={0.8} side={2} />
      </mesh>
    </group>
  );
}
