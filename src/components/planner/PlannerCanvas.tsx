"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, SoftShadows } from "@react-three/drei";
import CameraController from "./CameraController";
import RoomGroup from "./RoomGroup";
import CanvasTools from "./CanvasTools";
import SelectionBar from "./SelectionBar";
import EmptyState from "./EmptyState";
import { usePlannerStore } from "@/store/plannerStore";

export default function PlannerCanvas() {
  const { selectFurniture, loadProject, rooms, showGrid } = usePlannerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [loadProject]);

  if (!mounted) return null;

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        onPointerMissed={() => selectFurniture(null)}
        className="w-full h-full cursor-crosshair"
        style={{ touchAction: "none" }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <color attach="background" args={["#f4f2ed"]} />
          <SoftShadows size={26} samples={12} focus={0.8} />
          <hemisphereLight args={["#fcfbf7", "#d8d2c4", 0.55]} />
          <ambientLight intensity={0.35} />
          <directionalLight
            castShadow
            position={[12, 22, 14]}
            intensity={1.15}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
          >
            <orthographicCamera attach="shadow-camera" args={[-25, 25, 25, -25, 0.1, 80]} />
          </directionalLight>

          {showGrid && (
            <Grid
              position={[0, -0.01, 0]}
              infiniteGrid
              cellSize={0.5}
              cellThickness={0.6}
              sectionSize={2}
              sectionThickness={1}
              cellColor="#cfcabf"
              sectionColor="#9aa399"
              fadeDistance={60}
              fadeStrength={1.5}
              followCamera={false}
            />
          )}

          {rooms.map(room => (
            <RoomGroup key={room.id} room={room} />
          ))}
        </Suspense>
      </Canvas>

      <CanvasTools />
      <SelectionBar />
      <EmptyState />
    </>
  );
}
