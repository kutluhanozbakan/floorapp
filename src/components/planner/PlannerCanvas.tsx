"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import CameraController from "./CameraController";
import RoomGroup from "./RoomGroup";
import CanvasTools from "./CanvasTools";
import SelectionBar from "./SelectionBar";
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
        onPointerMissed={() => selectFurniture(null)}
        className="w-full h-full cursor-crosshair"
        style={{ touchAction: "none" }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={0.6} />
          <directionalLight
            castShadow
            position={[10, 20, 15]}
            intensity={1}
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
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
    </>
  );
}
