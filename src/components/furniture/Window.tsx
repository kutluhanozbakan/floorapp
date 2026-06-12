import React from "react";

// CENTERED model (y ∈ [-0.5, 0.5]); placed ~1m off the floor so it sits in the
// wall. Thin along Z. Scale e.g. [1.2, 1.2, 0.1].
export default function Window() {
  const frame = "#e4e0d8";
  const frameDark = "#cfcabf";

  return (
    <group>
      {/* Outer frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 0.16]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      {/* Glass */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.86, 0.86, 0.2]} />
        <meshPhysicalMaterial
          color="#cfe8f2"
          transparent
          opacity={0.45}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Mullions (cross) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 1, 0.18]} />
        <meshStandardMaterial color={frameDark} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.06, 0.18]} />
        <meshStandardMaterial color={frameDark} roughness={0.6} />
      </mesh>
      {/* Sill */}
      <mesh position={[0, -0.52, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.08, 0.06, 0.26]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
    </group>
  );
}
