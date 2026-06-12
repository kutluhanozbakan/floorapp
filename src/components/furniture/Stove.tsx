import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting cooker/oven. Local unit cube. Front faces +Z.
export default function Stove() {
  const body = "#3b3f45";
  const top = "#26292e";
  const burner = "#15171a";
  const glass = "#1b2733";
  const metal = "#c7cace";

  return (
    <group>
      {/* Body */}
      <RoundedBox args={[1, 0.88, 0.92]} radius={0.03} smoothness={2} position={[0, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.5} metalness={0.3} />
      </RoundedBox>
      {/* Cooktop */}
      <RoundedBox args={[1, 0.04, 0.92]} radius={0.02} smoothness={2} position={[0, 0.92, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={top} roughness={0.3} metalness={0.4} />
      </RoundedBox>
      {/* Burners */}
      {[[-0.24, -0.22], [0.24, -0.22], [-0.24, 0.24], [0.24, 0.24]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.95, z]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 20]} />
          <meshStandardMaterial color={burner} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      {/* Oven door glass */}
      <mesh position={[0, 0.42, 0.47]}>
        <planeGeometry args={[0.78, 0.5]} />
        <meshStandardMaterial color={glass} roughness={0.15} metalness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, 0.74, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Knobs */}
      {[-0.36, -0.12, 0.12, 0.36].map((x, i) => (
        <mesh key={i} position={[x, 0.84, 0.47]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
          <meshStandardMaterial color={metal} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
