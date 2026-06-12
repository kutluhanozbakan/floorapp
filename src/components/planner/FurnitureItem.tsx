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
import TV from "../furniture/TV";
import Bookshelf from "../furniture/Bookshelf";
import Plant from "../furniture/Plant";
import Lamp from "../furniture/Lamp";
import Rug from "../furniture/Rug";
import Desk from "../furniture/Desk";
import Nightstand from "../furniture/Nightstand";
import Toilet from "../furniture/Toilet";
import Sink from "../furniture/Sink";
import Bathtub from "../furniture/Bathtub";
import Stove from "../furniture/Stove";
import Fridge from "../furniture/Fridge";
import KitchenCabinet from "../furniture/KitchenCabinet";

interface Props {
  item: FurnitureItemType;
  room: Room;
}

export default function FurnitureItem({ item, room }: Props) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const { furnitureItems, selectFurniture, selectedItemId, updateFurniture, setDraggingItem, isDraggingItem, pushHistory } = usePlannerStore();
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

      if (item.isLocked) return memo;

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
          pushed: false, // becomes true once this drag records its single undo step
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
        targetY = item.type === "window" ? 1.0 + item.scale[1] / 2 : item.scale[1] / 2;
      }

      // Flat or wall-mounted pieces can be freely placed (and don't block others):
      // a rug goes under furniture, doors/windows live in the wall.
      const PASS_THROUGH = new Set(["rug", "door", "window"]);

      // Check for overlap with other furniture items
      const isRotated = Math.abs(targetRotation[1]) === Math.PI / 2;
      const newW = isRotated ? item.scale[2] : item.scale[0];
      const newD = isRotated ? item.scale[0] : item.scale[2];
      // Slightly negative margin to allow objects to touch or slide against each other
      const margin = -0.01;
      const nMinX = targetX - newW / 2 - margin;
      const nMaxX = targetX + newW / 2 + margin;
      const nMinZ = targetZ - newD / 2 - margin;
      const nMaxZ = targetZ + newD / 2 + margin;

      let hasOverlap = false;
      if (!PASS_THROUGH.has(item.type)) {
        for (const other of furnitureItems) {
          if (other.id === item.id || other.roomId !== room.id) continue;
          if (PASS_THROUGH.has(other.type)) continue;

          const oIsRotated = Math.abs(other.rotation[1]) === Math.PI / 2;
          const oW = oIsRotated ? other.scale[2] : other.scale[0];
          const oD = oIsRotated ? other.scale[0] : other.scale[2];
          const oMinX = other.position[0] - oW / 2 - margin;
          const oMaxX = other.position[0] + oW / 2 + margin;
          const oMinZ = other.position[2] - oD / 2 - margin;
          const oMaxZ = other.position[2] + oD / 2 + margin;

          if (nMinX < oMaxX && nMaxX > oMinX && nMinZ < oMaxZ && nMaxZ > oMinZ) {
            hasOverlap = true;
            break;
          }
        }
      }

      if (!hasOverlap) {
        const moved =
          targetX !== item.position[0] ||
          targetZ !== item.position[2] ||
          targetRotation[1] !== item.rotation[1];
        // Record one undo step the first time this drag actually changes the
        // item, so a whole drag collapses into a single history entry (and a
        // tap that doesn't move leaves no entry).
        if (moved && !memo.pushed) {
          pushHistory();
          memo.pushed = true;
        }
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
      case "tv": return <TV />;
      case "bookshelf": return <Bookshelf />;
      case "plant": return <Plant />;
      case "lamp": return <Lamp />;
      case "rug": return <Rug />;
      case "desk": return <Desk />;
      case "nightstand": return <Nightstand />;
      case "toilet": return <Toilet />;
      case "sink": return <Sink />;
      case "bathtub": return <Bathtub />;
      case "stove": return <Stove />;
      case "fridge": return <Fridge />;
      case "kitchen_cabinet": return <KitchenCabinet />;
      default: return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      );
    }
  };

  const dragProps = bind() as unknown as {
    onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  } & Record<string, unknown>;

  return (
    <group
      ref={meshRef}
      position={item.position as [number, number, number]}
      rotation={item.rotation as [number, number, number]}
      scale={item.scale as [number, number, number]}
      {...dragProps}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (dragProps.onPointerDown) dragProps.onPointerDown(e);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        selectFurniture(item.id);
      }}
      onPointerEnter={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(true);
        if (!item.isLocked) document.body.style.cursor = "move";
      }}
      onPointerLeave={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
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
        <Html position={[0, item.scale[1] / 2 + 0.2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
          <div className="pointer-events-none select-none bg-slate-800/90 backdrop-blur-sm text-white px-3 py-1.5 rounded shadow-xl border border-slate-600/50 flex flex-col items-center">
            <div className="font-semibold text-xs mb-0.5 flex items-center gap-1">
              {item.isLocked && <span className="text-yellow-400">🔒</span>}
              {item.name}
            </div>
            <div className="text-[10px] text-slate-300 whitespace-nowrap">
              {item.scale[0].toFixed(2)}W × {item.scale[1].toFixed(2)}H × {item.scale[2].toFixed(2)}D (m)
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
