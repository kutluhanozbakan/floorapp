import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { usePlannerStore } from "@/store/plannerStore";

export default function CameraController() {
  const { currentMode, isDraggingItem, viewTick } = usePlannerStore();
  const { size } = useThree();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  // Keep the latest canvas size in a ref so the "fit" command can read it
  // without `size` being an effect dependency — otherwise a resize would
  // re-fire the last view command and snap the camera back unexpectedly.
  const sizeRef = useRef(size);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Pause camera controls while a furniture item is being dragged.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.enabled = !isDraggingItem;
    // When a drag starts, kill any leftover orbit momentum from `enableDamping`.
    // Otherwise OrbitControls keeps applying its decaying spherical delta every
    // frame (update() runs even while disabled), so the camera would keep
    // gliding/rotating during the drag — read by users as the view "resetting"
    // whenever they move an object. Toggling damping off for one update() snaps
    // the residual delta to zero; we restore it immediately for normal orbiting.
    if (isDraggingItem && controls.enableDamping) {
      controls.enableDamping = false;
      controls.update();
      controls.enableDamping = true;
    }
  }, [isDraggingItem]);

  // Default camera placement per mode. We mutate controls.object (the active
  // camera) rather than the hook-returned camera so it stays lint-clean.
  const applyDefaultView = React.useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object;
    if (currentMode === "2d") {
      cam.position.set(0, 20, 0);
      controls.enableRotate = false;
      controls.maxPolarAngle = 0;
      controls.minPolarAngle = 0;
      if (cam.isOrthographicCamera) {
        cam.zoom = 40;
        cam.updateProjectionMatrix();
      }
    } else {
      cam.position.set(10, 10, 10);
      controls.enableRotate = true;
      controls.maxPolarAngle = Math.PI / 2 - 0.05;
      controls.minPolarAngle = 0;
    }
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.target.set(0, 0, 0);
    cam.lookAt(0, 0, 0);
    controls.update();
  }, [currentMode]);

  useEffect(() => {
    applyDefaultView();
  }, [applyDefaultView]);

  // Execute view-bar commands.
  useEffect(() => {
    if (viewTick === 0) return;
    const controls = controlsRef.current;
    if (!controls) return;
    const cam = controls.object;
    const { viewCmd, rooms } = usePlannerStore.getState();

    if (viewCmd === "recenter") {
      applyDefaultView();
      return;
    }

    if (viewCmd === "zoomIn" || viewCmd === "zoomOut") {
      if (currentMode === "2d" && cam.isOrthographicCamera) {
        const factor = viewCmd === "zoomIn" ? 1.25 : 0.8;
        cam.zoom = THREE.MathUtils.clamp(cam.zoom * factor, 5, 400);
        cam.updateProjectionMatrix();
      } else {
        const target = controls.target as THREE.Vector3;
        const offset = cam.position.clone().sub(target);
        offset.multiplyScalar(viewCmd === "zoomIn" ? 0.8 : 1.25);
        cam.position.copy(target).add(offset);
      }
      controls.update();
      return;
    }

    if (viewCmd === "fit") {
      // Bounding box over all rooms (with a little padding for walls).
      let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
      rooms.forEach((r) => {
        const pad = r.wallThickness + 0.3;
        minX = Math.min(minX, r.position[0] - r.width / 2 - pad);
        maxX = Math.max(maxX, r.position[0] + r.width / 2 + pad);
        minZ = Math.min(minZ, r.position[2] - r.depth / 2 - pad);
        maxZ = Math.max(maxZ, r.position[2] + r.depth / 2 + pad);
      });
      if (!isFinite(minX)) return;

      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;
      const sizeX = Math.max(0.5, maxX - minX);
      const sizeZ = Math.max(0.5, maxZ - minZ);

      controls.target.set(cx, 0, cz);
      if (currentMode === "2d" && cam.isOrthographicCamera) {
        // zoom = pixels per world unit; fit both axes, keep a margin.
        const { width: vw, height: vh } = sizeRef.current;
        const zoom = Math.min(vw / sizeX, vh / sizeZ) * 0.9;
        cam.zoom = THREE.MathUtils.clamp(zoom, 5, 400);
        cam.position.set(cx, 20, cz);
        cam.updateProjectionMatrix();
      } else {
        const dist = Math.max(sizeX, sizeZ) * 1.1;
        cam.position.set(cx + dist, dist, cz + dist);
      }
      cam.lookAt(cx, 0, cz);
      controls.update();
    }
  }, [viewTick, currentMode, applyDefaultView]);

  return (
    <>
      <Cameras mode={currentMode} />
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.12} />
    </>
  );
}

// Memoized so it only re-renders when the mode changes. Without this, any
// re-render of CameraController (e.g. selecting an object updates the store)
// would re-apply the declarative position/zoom props and snap the camera back
// to its default — i.e. clicking an item would reset the view.
const Cameras = React.memo(function Cameras({ mode }: { mode: "2d" | "3d" }) {
  return mode === "2d" ? (
    <OrthographicCamera makeDefault position={[0, 20, 0]} zoom={40} near={0.1} far={1000} />
  ) : (
    <PerspectiveCamera makeDefault position={[10, 10, 10]} fov={50} near={0.1} far={1000} />
  );
});
