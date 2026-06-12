import React from "react";

export default function Bookshelf() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
  );
}
