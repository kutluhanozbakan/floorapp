import React from "react";

export default function Bed() {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      
      {/* Mattress */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.2, 0.95]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pillow */}
      <mesh position={[0, 0.75, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.1, 0.25]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
    </group>
  );
}
