import React from "react";

export default function Bathtub() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.9, 0.4, 0.9]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}
