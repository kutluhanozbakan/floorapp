import React from "react";

export default function Rug() {
  return (
    <mesh position={[0, -0.49, 0]}>
      <boxGeometry args={[1, 0.02, 1]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
}
