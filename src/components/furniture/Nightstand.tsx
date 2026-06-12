import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting bedside table with two drawers. Local unit cube.
export default function Nightstand() {
  const body = "#a9744f";
  const drawer = "#bb8763";
  const handle = "#33302b";

  return (
    <group>
      {/* Body */}
      <RoundedBox args={[1, 0.84, 1]} radius={0.03} smoothness={2} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.65} />
      </RoundedBox>

      {/* Drawer faces */}
      <RoundedBox args={[0.84, 0.32, 0.04]} radius={0.02} smoothness={2} position={[0, 0.66, 0.49]} castShadow>
        <meshStandardMaterial color={drawer} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.84, 0.32, 0.04]} radius={0.02} smoothness={2} position={[0, 0.3, 0.49]} castShadow>
        <meshStandardMaterial color={drawer} roughness={0.6} />
      </RoundedBox>

      {/* Knobs */}
      <mesh position={[0, 0.66, 0.54]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0.54]} castShadow>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Legs */}
      {[[-0.4, 0.4], [0.4, 0.4], [-0.4, -0.4], [0.4, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.02, 0.1, 8]} />
          <meshStandardMaterial color={handle} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
