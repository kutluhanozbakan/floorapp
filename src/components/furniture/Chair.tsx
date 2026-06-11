import React from "react";

export default function Chair() {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 1, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.9, 0.1]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.4, 0.25, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[0.4, 0.25, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[-0.4, 0.25, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[0.4, 0.25, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
    </group>
  );
}
