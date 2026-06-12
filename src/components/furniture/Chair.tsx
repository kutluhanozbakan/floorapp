import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting model: local x,z ∈ [-0.5, 0.5], y ∈ [0, 1].
export default function Chair() {
  const wood = "#a9744f";
  const woodDark = "#8a5a3b";
  const seat = "#caa17e";

  const legs: [number, number][] = [
    [-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38],
  ];

  return (
    <group>
      {/* Legs */}
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.27, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.54, 8]} />
          <meshStandardMaterial color={woodDark} roughness={0.6} />
        </mesh>
      ))}

      {/* Seat */}
      <RoundedBox args={[0.92, 0.1, 0.92]} radius={0.04} smoothness={3} position={[0, 0.56, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={seat} roughness={0.7} />
      </RoundedBox>

      {/* Backrest posts */}
      <mesh position={[-0.38, 0.78, -0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 8]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>
      <mesh position={[0.38, 0.78, -0.42]} castShadow receiveShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 8]} />
        <meshStandardMaterial color={woodDark} roughness={0.6} />
      </mesh>

      {/* Backrest panel */}
      <RoundedBox args={[0.84, 0.34, 0.08]} radius={0.04} smoothness={3} position={[0, 0.9, -0.42]} castShadow receiveShadow>
        <meshStandardMaterial color={wood} roughness={0.65} />
      </RoundedBox>
    </group>
  );
}
