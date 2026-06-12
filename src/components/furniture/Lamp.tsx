import React from "react";

export default function Lamp() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.3, 0.3, 16]} />
        <meshStandardMaterial color="#fef08a" />
      </mesh>
    </group>
  );
}
