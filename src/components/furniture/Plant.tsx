import React from "react";

// Floor-resting potted plant. Local x,z ∈ [-0.5,0.5], y ∈ [0,1].
export default function Plant() {
  const pot = "#b07a52";
  const potRim = "#9c6844";
  const foliage = "#4f6f4a";
  const foliageLight = "#5f7f57";

  return (
    <group>
      {/* Pot */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.32, 16]} />
        <meshStandardMaterial color={pot} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.26, 0.05, 16]} />
        <meshStandardMaterial color={potRim} roughness={0.8} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 16]} />
        <meshStandardMaterial color="#4a3b2e" roughness={1} />
      </mesh>

      {/* Foliage clusters */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={foliage} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.16, 0.78, 0.08]} castShadow>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={foliageLight} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-0.15, 0.82, -0.05]} castShadow>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={foliage} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.02, 0.95, -0.02]} castShadow>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial color={foliageLight} roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
