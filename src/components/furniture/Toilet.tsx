import React from "react";

export default function Toilet() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0.2, 0.1]}>
        <boxGeometry args={[0.4, 0.4, 0.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Tank */}
      <mesh position={[0, 0.6, -0.3]}>
        <boxGeometry args={[0.5, 0.6, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
