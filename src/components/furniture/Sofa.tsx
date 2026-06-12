import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting model: occupies local x,z ∈ [-0.5, 0.5], y ∈ [0, 1].
// Scaled to real metres by the parent group.
export default function Sofa() {
  const fabric = "#8d8273";
  const fabricDark = "#7a7064";
  const leg = "#3f3a34";

  return (
    <group>
      {/* Plinth / frame */}
      <RoundedBox args={[1, 0.28, 1]} radius={0.04} smoothness={3} position={[0, 0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.85} />
      </RoundedBox>

      {/* Seat cushions */}
      <RoundedBox args={[0.44, 0.18, 0.7]} radius={0.06} smoothness={4} position={[-0.23, 0.42, 0.06]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.44, 0.18, 0.7]} radius={0.06} smoothness={4} position={[0.23, 0.42, 0.06]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.9} />
      </RoundedBox>

      {/* Back cushions */}
      <RoundedBox args={[0.44, 0.4, 0.16]} radius={0.06} smoothness={4} position={[-0.23, 0.6, -0.36]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.44, 0.4, 0.16]} radius={0.06} smoothness={4} position={[0.23, 0.6, -0.36]} castShadow receiveShadow>
        <meshStandardMaterial color={fabric} roughness={0.9} />
      </RoundedBox>

      {/* Armrests */}
      <RoundedBox args={[0.12, 0.46, 0.96]} radius={0.06} smoothness={4} position={[-0.44, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.46, 0.96]} radius={0.06} smoothness={4} position={[0.44, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={fabricDark} roughness={0.85} />
      </RoundedBox>

      {/* Feet */}
      {[[-0.4, 0.4], [0.4, 0.4], [-0.4, -0.4], [0.4, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.04, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.025, 0.08, 10]} />
          <meshStandardMaterial color={leg} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
