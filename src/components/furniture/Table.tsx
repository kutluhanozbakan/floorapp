import React from "react";

export default function Table() {
  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.4, 0.475, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.95, 0.1]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.4, 0.475, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.95, 0.1]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[-0.4, 0.475, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.95, 0.1]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0.4, 0.475, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.95, 0.1]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}
