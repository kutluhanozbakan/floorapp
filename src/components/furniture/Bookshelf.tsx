import React from "react";

// Floor-resting bookshelf with shelves and a few books. Local unit cube.
export default function Bookshelf() {
  const frame = "#8a5a3b";
  const back = "#6e4729";
  const bookColors = ["#9c6b50", "#5f7464", "#b08968", "#7d8a99", "#a0573f", "#646b56"];

  const shelfYs = [0.04, 0.27, 0.5, 0.73, 0.96];

  return (
    <group>
      {/* Back panel */}
      <mesh position={[0, 0.5, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 1, 0.04]} />
        <meshStandardMaterial color={back} roughness={0.8} />
      </mesh>
      {/* Sides */}
      <mesh position={[-0.47, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 1, 0.9]} />
        <meshStandardMaterial color={frame} roughness={0.7} />
      </mesh>
      <mesh position={[0.47, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 1, 0.9]} />
        <meshStandardMaterial color={frame} roughness={0.7} />
      </mesh>
      {/* Shelves */}
      {shelfYs.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.94, 0.04, 0.9]} />
          <meshStandardMaterial color={frame} roughness={0.7} />
        </mesh>
      ))}
      {/* A few books on some shelves */}
      {[0.16, 0.39, 0.62].map((y, row) =>
        Array.from({ length: 5 }).map((_, i) => (
          <mesh key={`${row}-${i}`} position={[-0.34 + i * 0.16, y, 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.22, 0.6]} />
            <meshStandardMaterial color={bookColors[(row * 5 + i) % bookColors.length]} roughness={0.85} />
          </mesh>
        ))
      )}
    </group>
  );
}
