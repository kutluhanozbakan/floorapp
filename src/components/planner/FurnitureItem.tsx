import React, { useMemo, useRef, useState } from "react";
import { useThree, ThreeEvent } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { FurnitureItem as FurnitureItemType } from "@/types/planner";
import { usePlannerStore } from "@/store/plannerStore";

// Import geometries
import Sofa from "../furniture/Sofa";
import Table from "../furniture/Table";
import Wardrobe from "../furniture/Wardrobe";
import Chair from "../furniture/Chair";
import Bed from "../furniture/Bed";
import Door from "../furniture/Door";
import Window from "../furniture/Window";

interface Props {
  item: FurnitureItemType;
}

export default function FurnitureItem({ item }: Props) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const { selectFurniture, selectedItemId, updateFurniture, room, setDraggingItem } = usePlannerStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedItemId === item.id;

  // Reused across drag frames to avoid per-event allocations.
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  const bind = useDrag(
    ({ first, last, active, event, xy: [px, py], memo }) => {
      // Keep the gesture from reaching OrbitControls / canvas deselect.
      (event as { stopPropagation?: () => void })?.stopPropagation?.();

      // Disable orbit/pan controls while a piece of furniture is being dragged
      // so the camera doesn't fight the drag (CameraController applies the flag).
      setDraggingItem(active);

      if (first) {
        selectFurniture(item.id);
      }

      // Convert the pointer position to normalized device coordinates using the
      // canvas bounds (NOT the window) so dragging is accurate even though the
      // canvas is inset by the side panels.
      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((px - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((py - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x: ndcX, y: ndcY } as THREE.Vector2, camera);
      if (!raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
        return memo;
      }

      // On grab, remember the offset between the pointer and the item's origin so
      // the item doesn't snap its center to the finger/cursor.
      if (first || !memo) {
        memo = {
          offsetX: item.position[0] - hitPoint.x,
          offsetZ: item.position[2] - hitPoint.z,
        };
      }

      let targetX = hitPoint.x + memo.offsetX;
      let targetZ = hitPoint.z + memo.offsetZ;
      let targetRotation = item.rotation;

      const snapDistance = 0.5;
      const isDoorOrWindow = item.type === "door" || item.type === "window";

      const minX = -room.width / 2;
      const maxX = room.width / 2;
      const minZ = -room.depth / 2;
      const maxZ = room.depth / 2;

      // Keep the item inside the room footprint.
      targetX = Math.min(maxX, Math.max(minX, targetX));
      targetZ = Math.min(maxZ, Math.max(minZ, targetZ));

      if (Math.abs(targetX - minX) < snapDistance) {
        targetX = minX;
        targetRotation = [0, Math.PI / 2, 0];
      } else if (Math.abs(targetX - maxX) < snapDistance) {
        targetX = maxX;
        targetRotation = [0, -Math.PI / 2, 0];
      } else if (Math.abs(targetZ - minZ) < snapDistance) {
        targetZ = minZ;
        targetRotation = [0, 0, 0];
      } else if (Math.abs(targetZ - maxZ) < snapDistance) {
        targetZ = maxZ;
        targetRotation = [0, Math.PI, 0];
      }

      let targetY = item.position[1];
      if (isDoorOrWindow) {
        targetY = item.scale[1] / 2;
      }

      updateFurniture(item.id, {
        position: [targetX, targetY, targetZ],
        rotation: targetRotation as [number, number, number],
      });

      if (last) {
        setDraggingItem(false);
      }

      return memo;
    },
    { filterTaps: true, pointer: { touch: true } }
  );

  const renderGeometry = () => {
    switch (item.type) {
      case "sofa": return <Sofa />;
      case "table": return <Table />;
      case "wardrobe": return <Wardrobe />;
      case "chair": return <Chair />;
      case "bed": return <Bed />;
      case "door": return <Door />;
      case "window": return <Window />;
      default: return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      );
    }
  };

  return (
    <group
      ref={meshRef}
      position={item.position as [number, number, number]}
      rotation={item.rotation as [number, number, number]}
      scale={item.scale as [number, number, number]}
      {...(bind() as Record<string, unknown>)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        selectFurniture(item.id);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = "move";
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Bounding box for selection highlight */}
      {(isSelected || isHovered) && (
        <mesh>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color={isSelected ? "#3b82f6" : "#94a3b8"} wireframe />
        </mesh>
      )}
      
      {/* Actual geometry */}
      {renderGeometry()}
    </group>
  );
}
