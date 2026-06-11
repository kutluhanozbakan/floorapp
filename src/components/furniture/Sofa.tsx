import React from "react";

export default function Sofa() {
  return (
    <group>
      {/* Base seat */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.75, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Armrests */}
      <mesh position={[-0.45, 0.5, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.45, 0.5, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}
