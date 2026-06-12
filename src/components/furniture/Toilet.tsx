import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting toilet. Tank at back (-Z). Local unit cube.
export default function Toilet() {
  const porcelain = "#f4f4f2";
  const seat = "#e9e9e6";

  return (
    <group>
      {/* Pedestal */}
      <mesh position={[0, 0.22, 0.08]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.44, 16]} />
        <meshStandardMaterial color={porcelain} roughness={0.3} />
      </mesh>
      {/* Bowl */}
      <mesh position={[0, 0.46, 0.12]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.18, 20]} />
        <meshStandardMaterial color={porcelain} roughness={0.3} />
      </mesh>
      {/* Seat ring */}
      <mesh position={[0, 0.56, 0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.2, 0.05, 12, 24]} />
        <meshStandardMaterial color={seat} roughness={0.4} />
      </mesh>
      {/* Lid / back */}
      <RoundedBox args={[0.44, 0.08, 0.28]} radius={0.03} smoothness={2} position={[0, 0.58, -0.12]} castShadow receiveShadow>
        <meshStandardMaterial color={seat} roughness={0.4} />
      </RoundedBox>
      {/* Cistern / tank */}
      <RoundedBox args={[0.5, 0.62, 0.2]} radius={0.03} smoothness={2} position={[0, 0.62, -0.36]} castShadow receiveShadow>
        <meshStandardMaterial color={porcelain} roughness={0.3} />
      </RoundedBox>
      {/* Flush button */}
      <mesh position={[0, 0.94, -0.36]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
        <meshStandardMaterial color="#c9c9c4" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}
