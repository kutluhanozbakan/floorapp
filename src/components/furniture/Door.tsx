import React from "react";
import { RoundedBox } from "@react-three/drei";

// CENTERED model (y ∈ [-0.5, 0.5]); placed at y = height/2 so it sits in the wall.
// Thin along Z (it fills a wall opening). Scale e.g. [0.9, 2.1, 0.1].
export default function Door() {
  const frame = "#6b5444";
  const panel = "#cdbfae";
  const panelInset = "#bcae9c";
  const handle = "#c9a24b"; // brass

  return (
    <group>
      {/* Frame: left, right, top (z thick enough to span wall) */}
      <mesh position={[-0.46, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 1, 1.2]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      <mesh position={[0.46, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 1, 1.2]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.08, 1.2]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>

      {/* Door leaf */}
      <RoundedBox args={[0.82, 0.9, 0.1]} radius={0.015} smoothness={2} position={[0, -0.04, 0.04]} castShadow receiveShadow>
        <meshStandardMaterial color={panel} roughness={0.6} />
      </RoundedBox>
      {/* Recessed panels */}
      <mesh position={[0, 0.14, 0.1]}>
        <boxGeometry args={[0.56, 0.34, 0.02]} />
        <meshStandardMaterial color={panelInset} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.28, 0.1]}>
        <boxGeometry args={[0.56, 0.34, 0.02]} />
        <meshStandardMaterial color={panelInset} roughness={0.7} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.3, -0.04, 0.12]} castShadow>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color={handle} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
