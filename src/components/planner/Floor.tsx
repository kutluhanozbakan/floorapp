import React from "react";
import { Grid } from "@react-three/drei";
import { usePlannerStore } from "@/store/plannerStore";

export default function Floor() {
  const { room } = usePlannerStore();
  const { width, depth } = room;

  return (
    <group>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      
      {/* Extended Grid for reference (especially useful in 2D mode) */}
      <Grid
        position={[0, -0.01, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={1}
        cellColor="#cbd5e1"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#94a3b8"
        fadeDistance={30}
        fadeStrength={1}
      />
    </group>
  );
}
