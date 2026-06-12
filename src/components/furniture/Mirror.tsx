import React from "react";
import { RoundedBox } from "@react-three/drei";

// CENTERED model (y ∈ [-0.5, 0.5]) like Window — a wall mirror placed ~1m up.
// Thin along Z. Reuses window placement so it sits flat on the wall.
export default function Mirror() {
  const frame = "#6b5444";

  return (
    <group>
      {/* Frame */}
      <RoundedBox args={[1, 1, 0.08]} radius={0.03} smoothness={2} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={frame} roughness={0.5} />
      </RoundedBox>
      {/* Mirror glass */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[0.84, 0.84]} />
        <meshStandardMaterial color="#dfeef2" roughness={0.05} metalness={0.9} />
      </mesh>
    </group>
  );
}
