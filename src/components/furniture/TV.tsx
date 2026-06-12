import React from "react";

export default function TV() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
  );
}
