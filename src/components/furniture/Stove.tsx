import React from "react";

export default function Stove() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  );
}
