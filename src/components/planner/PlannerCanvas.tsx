"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import CameraController from "./CameraController";
import RoomGroup from "./RoomGroup";
import { usePlannerStore } from "@/store/plannerStore";

export default function PlannerCanvas() {
  const { selectFurniture, loadProject, rooms } = usePlannerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [loadProject]);

  if (!mounted) return null;

  return (
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

        {rooms.map(room => (
          <RoomGroup key={room.id} room={room} />
        ))}
      </Suspense>
    </Canvas>
  );
}
