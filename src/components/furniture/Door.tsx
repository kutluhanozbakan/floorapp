import React from "react";

export default function Door() {
  return (
    <group>
      {/* Door Frame Left */}
      <mesh position={[-0.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1, 1.05]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      {/* Door Frame Right */}
      <mesh position={[0.45, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1, 1.05]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      {/* Door Frame Top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 1.05]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      
      {/* Door Panel */}
      <mesh position={[0, -0.05, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.9, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      {/* Handle */}
      <mesh position={[0.3, 0, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.2, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}
