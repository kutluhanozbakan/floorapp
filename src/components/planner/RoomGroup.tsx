import React, { useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Room } from "@/types/planner";
import { usePlannerStore } from "@/store/plannerStore";
import Walls from "./Walls";
import FurnitureItem from "./FurnitureItem";
import RoomEditor from "./RoomEditor";
import DragGuides from "./DragGuides";

interface Props {
  room: Room;
}

export default function RoomGroup({ room }: Props) {
  const { furnitureItems, updateRoom, selectFurniture, selectedItemId, rooms, setDraggingItem, pushHistory, isDraggingItem } = usePlannerStore();
  const { camera, gl } = useThree();
  const [isHovered, setIsHovered] = useState(false);

  // Filter items belonging to this room
  // For backward compatibility, if an item has no roomId, we can assign it to the first room.
  const roomItems = furnitureItems.filter(
    (item) => item.roomId === room.id || (!item.roomId && rooms[0]?.id === room.id)
  );

  const isSelected = selectedItemId === room.id;

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  const bind = useDrag(
    ({ first, last, event, xy: [px, py], memo }) => {
      (event as { stopPropagation?: () => void })?.stopPropagation?.();

      // Locked rooms can be selected but never moved.
      if (room.isLocked) return memo;

      if (first) {
        setDraggingItem(true);
        selectFurniture(room.id);
      }

      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((px - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((py - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x: ndcX, y: ndcY } as THREE.Vector2, camera);
      if (!raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
        return memo;
      }

      if (first || !memo) {
        memo = {
          offsetX: room.position[0] - hitPoint.x,
          offsetZ: room.position[2] - hitPoint.z,
          pushed: false,
        };
      }

      let targetX = hitPoint.x + memo.offsetX;
      let targetZ = hitPoint.z + memo.offsetZ;

      // Basic Room Snapping Logic
      const snapDistance = 1.0;
      rooms.forEach((otherRoom) => {
        if (otherRoom.id === room.id) return;

        // Walls extend OUTWARD from the floor edge by their thickness. To keep the
        // two rooms' walls flush side-by-side instead of overlapping/interpenetrating,
        // we leave a gap between the floor edges equal to both wall thicknesses.
        const gap = room.wallThickness + otherRoom.wallThickness;

        // Check if dragging near other room's walls
        // Room bounds
        const r1MinX = targetX - room.width / 2;
        const r1MaxX = targetX + room.width / 2;
        const r1MinZ = targetZ - room.depth / 2;
        const r1MaxZ = targetZ + room.depth / 2;

        const r2MinX = otherRoom.position[0] - otherRoom.width / 2;
        const r2MaxX = otherRoom.position[0] + otherRoom.width / 2;
        const r2MinZ = otherRoom.position[2] - otherRoom.depth / 2;
        const r2MaxZ = otherRoom.position[2] + otherRoom.depth / 2;

        // X-axis snapping (leave room for both walls so they sit flush)
        if (Math.abs(r1MaxX - r2MinX) < snapDistance && (r1MaxZ > r2MinZ && r1MinZ < r2MaxZ)) {
          targetX = r2MinX - gap - room.width / 2;
        } else if (Math.abs(r1MinX - r2MaxX) < snapDistance && (r1MaxZ > r2MinZ && r1MinZ < r2MaxZ)) {
          targetX = r2MaxX + gap + room.width / 2;
        }

        // Z-axis snapping
        if (Math.abs(r1MaxZ - r2MinZ) < snapDistance && (r1MaxX > r2MinX && r1MinX < r2MaxX)) {
          targetZ = r2MinZ - gap - room.depth / 2;
        } else if (Math.abs(r1MinZ - r2MaxZ) < snapDistance && (r1MaxX > r2MinX && r1MinX < r2MaxX)) {
          targetZ = r2MaxZ + gap + room.depth / 2;
        }
      });

      if ((targetX !== room.position[0] || targetZ !== room.position[2]) && !memo.pushed) {
        pushHistory();
        memo.pushed = true;
      }
      updateRoom(room.id, { position: [targetX, room.position[1], targetZ] });

      if (last) {
        setDraggingItem(false);
      }

      return memo;
    },
    { filterTaps: true }
  );

  return (
    <group position={room.position as [number, number, number]}>
      {/* Interactive Floor for dragging the room */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        {...(bind() as Record<string, unknown>)}
        onClick={(e) => {
          e.stopPropagation();
          selectFurniture(room.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = room.isLocked ? "not-allowed" : "grab";
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <planeGeometry args={[room.width, room.depth]} />
        <meshStandardMaterial color={isSelected ? "#ece7dc" : isHovered ? "#f2eee5" : "#f8f5ef"} />
      </mesh>

      <Walls room={room} furnitureItems={roomItems} />

      {/* Persistent room label: name + size + area */}
      <Html position={[0, 0.05, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="pointer-events-none select-none text-center whitespace-nowrap">
          <div className="text-ink/70 text-[11px] font-semibold">{room.name}</div>
          <div className="text-ink-muted/70 text-[10px] tabular-nums">
            {room.width.toFixed(1)} × {room.depth.toFixed(1)} m · {(room.width * room.depth).toFixed(1)} m²
          </div>
        </div>
      </Html>

      {isSelected && !room.isLocked && <RoomEditor room={room} />}

      {roomItems.map((item) => (
        <FurnitureItem key={item.id} item={item} room={room} />
      ))}

      {/* Live wall-distance guides for the item being dragged */}
      {isDraggingItem &&
        (() => {
          const dragged = roomItems.find((i) => i.id === selectedItemId);
          return dragged ? <DragGuides item={dragged} room={room} /> : null;
        })()}
    </group>
  );
}
