import React from "react";

// Floor-resting flat rug. Local x,z ∈ [-0.5,0.5], y ∈ [0,1] (scaled very thin).
// A border colour + inset field reads as a patterned rug from above.
export default function Rug() {
  return (
    <group>
      {/* Border base */}
      <mesh position={[0, 0.45, 0]} receiveShadow>
        <boxGeometry args={[1, 0.9, 1]} />
        <meshStandardMaterial color="#7c6f63" roughness={1} />
      </mesh>
      {/* Inset field (sits on top) */}
      <mesh position={[0, 0.92, 0]} receiveShadow>
        <boxGeometry args={[0.84, 0.2, 0.84]} />
        <meshStandardMaterial color="#a99a86" roughness={1} />
      </mesh>
      {/* Centre motif */}
      <mesh position={[0, 0.95, 0]} receiveShadow>
        <boxGeometry args={[0.4, 0.16, 0.4]} />
        <meshStandardMaterial color="#8a7c6d" roughness={1} />
      </mesh>
    </group>
  );
}
