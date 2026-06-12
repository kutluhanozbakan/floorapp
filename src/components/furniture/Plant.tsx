import React from "react";

export default function Plant() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    </group>
  );
}
