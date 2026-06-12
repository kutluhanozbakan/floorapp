import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting desk with a drawer pedestal. Local x,z ∈ [-0.5,0.5], y ∈ [0,1].
export default function Desk() {
  const top = "#b5835a";
  const leg = "#52514c";
  const drawer = "#9c8f7e";
  const handle = "#33302b";

  return (
    <group>
      {/* Top */}
      <RoundedBox args={[1, 0.06, 0.96]} radius={0.02} smoothness={3} position={[0, 0.93, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={top} roughness={0.5} />
      </RoundedBox>

      {/* Left legs */}
      <mesh position={[-0.45, 0.45, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.9, 0.06]} />
        <meshStandardMaterial color={leg} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-0.45, 0.45, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.9, 0.06]} />
        <meshStandardMaterial color={leg} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Drawer pedestal (right) */}
      <RoundedBox args={[0.34, 0.78, 0.84]} radius={0.02} smoothness={2} position={[0.3, 0.49, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={drawer} roughness={0.7} />
      </RoundedBox>
      {[0.72, 0.49, 0.26].map((y, i) => (
        <mesh key={i} position={[0.48, y, 0]} castShadow>
          <boxGeometry args={[0.02, 0.04, 0.18]} />
          <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
