import React, { useMemo, useRef, useState } from "react";
import { useThree, ThreeEvent } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { FurnitureItem as FurnitureItemType, Room } from "@/types/planner";
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
  room: Room;
}

export default function FurnitureItem({ item, room }: Props) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const { furnitureItems, selectFurniture, selectedItemId, updateFurniture, setDraggingItem, isDraggingItem } = usePlannerStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedItemId === item.id;

  // Reused across drag frames to avoid per-event allocations.
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  const bind = useDrag(
    ({ first, last, event, xy: [px, py], memo }) => {
      // Keep the gesture from reaching OrbitControls / canvas deselect.
      (event as { stopPropagation?: () => void })?.stopPropagation?.();

      // Disable orbit/pan controls while a piece of furniture is being dragged
      // so the camera doesn't fight the drag (CameraController applies the flag).
      if (first) {
        setDraggingItem(true);
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

      const localHitPoint = hitPoint.clone().sub(new THREE.Vector3(...room.position));

      // On grab, remember the offset between the pointer and the item's origin so
      // the item doesn't snap its center to the finger/cursor.
      if (first || !memo) {
        memo = {
          offsetX: item.position[0] - localHitPoint.x,
          offsetZ: item.position[2] - localHitPoint.z,
        };
      }

      let targetX = localHitPoint.x + memo.offsetX;
      let targetZ = localHitPoint.z + memo.offsetZ;
      let targetRotation = item.rotation;

      const snapDistance = 0.5;
      const isDoorOrWindow = item.type === "door" || item.type === "window";
      const offsetDepth = isDoorOrWindow ? 0 : item.scale[2] / 2;
      const offsetWidth = isDoorOrWindow ? 0 : item.scale[0] / 2;

      const minX = -room.width / 2;
      const maxX = room.width / 2;
      const minZ = -room.depth / 2;
      const maxZ = room.depth / 2;

      if (targetX - minX < snapDistance + offsetDepth) {
        targetX = minX + offsetDepth;
        targetRotation = [0, Math.PI / 2, 0];
      } else if (maxX - targetX < snapDistance + offsetDepth) {
        targetX = maxX - offsetDepth;
        targetRotation = [0, -Math.PI / 2, 0];
      } else if (targetZ - minZ < snapDistance + offsetDepth) {
        targetZ = minZ + offsetDepth;
        targetRotation = [0, 0, 0];
      } else if (maxZ - targetZ < snapDistance + offsetDepth) {
        targetZ = maxZ - offsetDepth;
        targetRotation = [0, Math.PI, 0];
      }

      // Clamp bounds depending on orientation so it doesn't poke out of the room
      if (Math.abs(targetRotation[1]) === Math.PI / 2) {
         // Depth is along X, Width is along Z
         targetX = Math.min(maxX - offsetDepth, Math.max(minX + offsetDepth, targetX));
         targetZ = Math.min(maxZ - offsetWidth, Math.max(minZ + offsetWidth, targetZ));
      } else {
         // Depth is along Z, Width is along X
         targetX = Math.min(maxX - offsetWidth, Math.max(minX + offsetWidth, targetX));
         targetZ = Math.min(maxZ - offsetDepth, Math.max(minZ + offsetDepth, targetZ));
      }

      let targetY = item.position[1];
      if (isDoorOrWindow) {
        targetY = item.scale[1] / 2;
      }

      // Check for overlap with other furniture items
      const isRotated = Math.abs(targetRotation[1]) === Math.PI / 2;
      const newW = isRotated ? item.scale[2] : item.scale[0];
      const newD = isRotated ? item.scale[0] : item.scale[2];
      // Slightly reduce bounding box to allow sliding past tightly packed items
      const margin = 0.05; 
      const nMinX = targetX - newW / 2 + margin;
      const nMaxX = targetX + newW / 2 - margin;
      const nMinZ = targetZ - newD / 2 + margin;
      const nMaxZ = targetZ + newD / 2 - margin;

      let hasOverlap = false;
      for (const other of furnitureItems) {
        if (other.id === item.id || other.roomId !== room.id) continue;
        
        const oIsRotated = Math.abs(other.rotation[1]) === Math.PI / 2;
        const oW = oIsRotated ? other.scale[2] : other.scale[0];
        const oD = oIsRotated ? other.scale[0] : other.scale[2];
        const oMinX = other.position[0] - oW / 2 + margin;
        const oMaxX = other.position[0] + oW / 2 - margin;
        const oMinZ = other.position[2] - oD / 2 + margin;
        const oMaxZ = other.position[2] + oD / 2 - margin;
        
        if (nMinX < oMaxX && nMaxX > oMinX && nMinZ < oMaxZ && nMaxZ > oMinZ) {
           hasOverlap = true;
           break;
        }
      }

      if (!hasOverlap) {
        updateFurniture(item.id, {
          position: [targetX, targetY, targetZ],
          rotation: targetRotation as [number, number, number],
        });
      }

      if (last) {
        setDraggingItem(false);
      }

      return memo;
    },
    // Pointer Events (the default) already cover mouse, touch and pen, so we do
    // NOT force touch-only events here. filterTaps lets a plain tap select the
    // item without it being treated as a (zero-distance) drag.
    { filterTaps: true }
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

      {/* Invisible hit box to make dragging easier on mobile */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      
      {/* Actual geometry */}
      {renderGeometry()}

      {/* Hover dimensions overlay */}
      {isHovered && !isDraggingItem && (
        <Html position={[0, item.scale[1] / 2 + 0.2, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-slate-800/90 backdrop-blur-sm text-white px-3 py-1.5 rounded shadow-xl pointer-events-none border border-slate-600/50">
            <div className="font-semibold text-xs mb-0.5">{item.name}</div>
            <div className="text-[10px] text-slate-300 whitespace-nowrap">
              {item.scale[0].toFixed(2)}W × {item.scale[1].toFixed(2)}H × {item.scale[2].toFixed(2)}D (m)
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
