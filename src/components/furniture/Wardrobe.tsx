import React from "react";

export default function Wardrobe() {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      
      {/* Doors handles */}
      <mesh position={[-0.1, 1, 0.51]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.1, 1, 0.51]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Door separation line */}
      <mesh position={[0, 1, 0.505]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 1.9, 0.02]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
    </group>
  );
}
