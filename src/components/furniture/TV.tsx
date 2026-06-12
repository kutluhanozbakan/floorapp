import React from "react";
import { RoundedBox } from "@react-three/drei";

// Flat-panel TV. Floor-resting, thin along Z. Local x,z ∈ [-0.5,0.5], y ∈ [0,1].
export default function TV() {
  return (
    <group>
      {/* Stand foot */}
      <RoundedBox args={[0.5, 0.04, 0.6]} radius={0.02} smoothness={2} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2d33" roughness={0.5} />
      </RoundedBox>
      {/* Neck */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.12, 0.28, 0.08]} />
        <meshStandardMaterial color="#2a2d33" roughness={0.5} />
      </mesh>

      {/* Bezel */}
      <RoundedBox args={[1, 0.62, 0.06]} radius={0.02} smoothness={2} position={[0, 0.62, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#15171a" roughness={0.4} metalness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0.62, 0.035]}>
        <planeGeometry args={[0.92, 0.54]} />
        <meshStandardMaterial color="#1e3a4f" roughness={0.15} metalness={0.4} emissive="#16222e" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
