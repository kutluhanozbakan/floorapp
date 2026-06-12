import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting front-load washing machine. Local unit cube. Front faces +Z.
export default function WashingMachine() {
  const body = "#eceef0";
  const panel = "#d8dbdf";
  const glass = "#2b3a42";
  const ring = "#b8bcc1";

  return (
    <group>
      {/* Body */}
      <RoundedBox args={[1, 1, 0.92]} radius={0.04} smoothness={3} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.45} metalness={0.2} />
      </RoundedBox>
      {/* Control panel strip */}
      <RoundedBox args={[0.9, 0.16, 0.04]} radius={0.02} smoothness={2} position={[0, 0.86, 0.46]} castShadow>
        <meshStandardMaterial color={panel} roughness={0.4} />
      </RoundedBox>
      {/* Dial */}
      <mesh position={[0.32, 0.86, 0.49]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        <meshStandardMaterial color={ring} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Door ring */}
      <mesh position={[0, 0.42, 0.46]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.28, 0.05, 14, 28]} />
        <meshStandardMaterial color={ring} roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Door glass */}
      <mesh position={[0, 0.42, 0.47]}>
        <circleGeometry args={[0.26, 28]} />
        <meshStandardMaterial color={glass} roughness={0.1} metalness={0.5} />
      </mesh>
    </group>
  );
}
