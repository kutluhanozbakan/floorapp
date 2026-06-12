import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting chest of drawers. Local unit cube. Front faces +Z.
export default function Dresser() {
  const body = "#9b8f7e";
  const drawer = "#aa9e8c";
  const handle = "#33302b";

  const rows = [0.74, 0.5, 0.26];

  return (
    <group>
      {/* Carcass */}
      <RoundedBox args={[1, 0.92, 0.9]} radius={0.03} smoothness={2} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={body} roughness={0.7} />
      </RoundedBox>
      {/* Drawer faces + handles */}
      {rows.map((y, i) => (
        <group key={i}>
          <RoundedBox args={[0.9, 0.2, 0.04]} radius={0.02} smoothness={2} position={[0, y, 0.46]} castShadow>
            <meshStandardMaterial color={drawer} roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, y, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.34, 8]} />
            <meshStandardMaterial color={handle} roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Feet */}
      {[[-0.42, 0.36], [0.42, 0.36], [-0.42, -0.36], [0.42, -0.36]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.025, z]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.06]} />
          <meshStandardMaterial color={handle} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
