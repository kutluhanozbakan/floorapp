import React from "react";
import { RoundedBox } from "@react-three/drei";

// Floor-resting kitchen counter with an inset sink. Local unit cube. Front +Z.
export default function KitchenCounter() {
  const carcass = "#7e7468";
  const door = "#b9b0a1";
  const counter = "#cfcabf";
  const basin = "#b6bbbd";
  const metal = "#c7cace";
  const handle = "#2c2a26";

  return (
    <group>
      {/* Carcass */}
      <RoundedBox args={[1, 0.82, 0.92]} radius={0.02} smoothness={2} position={[0, 0.41, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={carcass} roughness={0.7} />
      </RoundedBox>
      {/* Worktop */}
      <RoundedBox args={[1, 0.07, 0.98]} radius={0.02} smoothness={2} position={[0, 0.86, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={counter} roughness={0.35} />
      </RoundedBox>
      {/* Sink basin */}
      <RoundedBox args={[0.4, 0.12, 0.4]} radius={0.03} smoothness={3} position={[0.22, 0.84, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={basin} roughness={0.3} metalness={0.4} />
      </RoundedBox>
      {/* Faucet */}
      <mesh position={[0.22, 0.96, -0.3]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.22, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.22, 1.06, -0.22]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 10]} />
        <meshStandardMaterial color={metal} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Doors on the left half */}
      {[-0.34, -0.1].map((x, i) => (
        <RoundedBox key={i} args={[0.22, 0.66, 0.04]} radius={0.02} smoothness={2} position={[x, 0.4, 0.47]} castShadow>
          <meshStandardMaterial color={door} roughness={0.6} />
        </RoundedBox>
      ))}
      {[-0.24, 0].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.51]} castShadow>
          <boxGeometry args={[0.03, 0.16, 0.03]} />
          <meshStandardMaterial color={handle} roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
