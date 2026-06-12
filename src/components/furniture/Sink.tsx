import React from "react";

export default function Sink() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  );
}
