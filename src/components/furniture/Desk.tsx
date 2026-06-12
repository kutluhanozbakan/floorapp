import React from "react";

export default function Desk() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Top */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.45, 0.45, -0.45]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.45, 0.45, -0.45]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-0.45, 0.45, 0.45]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.45, 0.45, 0.45]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}
