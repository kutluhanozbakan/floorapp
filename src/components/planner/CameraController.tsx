import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { usePlannerStore } from "@/store/plannerStore";


export default function CameraController() {
  const { currentMode } = usePlannerStore();
  const { camera } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (currentMode === "2d") {
        // Look from top
        camera.position.set(0, 20, 0);
        camera.lookAt(0, 0, 0);
        
        controlsRef.current.enableRotate = false;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enablePan = true;
        // Lock polar angle to 0
        controlsRef.current.maxPolarAngle = 0;
        controlsRef.current.minPolarAngle = 0;
      } else {
        // 3D mode
        camera.position.set(10, 10, 10);
        camera.lookAt(0, 0, 0);
        
        controlsRef.current.enableRotate = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enablePan = true;
        // Allow looking around but not under the floor
        controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05;
        controlsRef.current.minPolarAngle = 0;
      }
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [currentMode, camera]);

  return (
    <>
      {currentMode === "2d" ? (
        <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={40} near={0.1} far={1000} />
      ) : (
        <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} near={0.1} far={1000} />
      )}
      <OrbitControls
        ref={controlsRef}
        makeDefault
      />
    </>
  );
}
