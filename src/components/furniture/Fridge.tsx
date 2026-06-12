import React from "react";

export default function Fridge() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f1f5f9" />
    </mesh>
  );
}
