import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { Text } from "@react-three/drei";
import { Room } from "@/types/planner";
import { usePlannerStore } from "@/store/plannerStore";

interface Props {
  room: Room;
}

interface HandleProps {
  side: "left" | "right" | "top" | "bottom";
  pos: [number, number, number];
  rot: [number, number, number];
  room: Room;
}

function Handle({ side, pos, rot, room }: HandleProps) {
  const { updateRoom, setDraggingItem, pushHistory } = usePlannerStore();
  const { gl, camera } = useThree();
  
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const raycaster = new THREE.Raycaster();

  const bind = useDrag(
    ({ first, last, event, xy: [px, py], memo }) => {
      (event as { stopPropagation?: () => void })?.stopPropagation?.();
      
      if (first || !memo) {
        setDraggingItem(true);
        memo = {
          initialRoom: { width: room.width, depth: room.depth, x: room.position[0], z: room.position[2] },
          initialHit: null,
          pushed: false,
        };
      }

      const rect = gl.domElement.getBoundingClientRect();
      const ndcX = ((px - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((py - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera({ x: ndcX, y: ndcY } as THREE.Vector2, camera);
      const hitPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
        if (first) {
          memo.initialHit = hitPoint.clone();
        }

        if (memo.initialHit) {
          const dx = hitPoint.x - memo.initialHit.x;
          const dz = hitPoint.z - memo.initialHit.z;

          let newWidth = memo.initialRoom.width;
          let newDepth = memo.initialRoom.depth;
          let newX = memo.initialRoom.x;
          let newZ = memo.initialRoom.z;

          if (side === "right") {
            newWidth = Math.max(1, memo.initialRoom.width + dx);
            newX = memo.initialRoom.x + (newWidth - memo.initialRoom.width) / 2;
          } else if (side === "left") {
            newWidth = Math.max(1, memo.initialRoom.width - dx);
            newX = memo.initialRoom.x - (newWidth - memo.initialRoom.width) / 2;
          } else if (side === "bottom") { // Front wall (+Z)
            newDepth = Math.max(1, memo.initialRoom.depth + dz);
            newZ = memo.initialRoom.z + (newDepth - memo.initialRoom.depth) / 2;
          } else if (side === "top") { // Back wall (-Z)
            newDepth = Math.max(1, memo.initialRoom.depth - dz);
            newZ = memo.initialRoom.z - (newDepth - memo.initialRoom.depth) / 2;
          }

          newWidth = Math.round(newWidth * 10) / 10;
          newDepth = Math.round(newDepth * 10) / 10;

          if ((newWidth !== memo.initialRoom.width || newDepth !== memo.initialRoom.depth) && !memo.pushed) {
            pushHistory();
            memo.pushed = true;
          }
          updateRoom(room.id, {
            width: newWidth,
            depth: newDepth,
            position: [newX, room.position[1], newZ],
          });
        }
      }

      if (last) {
        setDraggingItem(false);
      }
      return memo;
    },
    { filterTaps: true }
  );

  return (
    <mesh
      position={pos}
      rotation={rot}
      {...(bind() as Record<string, unknown>)}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = side === "left" || side === "right" ? "ew-resize" : "ns-resize";
      }}
      onPointerOut={() => document.body.style.cursor = "default"}
    >
      <boxGeometry args={[0.4, room.wallHeight + 0.1, 0.4]} />
      <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
    </mesh>
  );
}

export default function RoomEditor({ room }: Props) {
  return (
    <group>
      {/* Handles */}
      <Handle side="left" pos={[-room.width / 2, room.wallHeight / 2, 0]} rot={[0, 0, 0]} room={room} />
      <Handle side="right" pos={[room.width / 2, room.wallHeight / 2, 0]} rot={[0, 0, 0]} room={room} />
      <Handle side="top" pos={[0, room.wallHeight / 2, -room.depth / 2]} rot={[0, Math.PI / 2, 0]} room={room} />
      <Handle side="bottom" pos={[0, room.wallHeight / 2, room.depth / 2]} rot={[0, Math.PI / 2, 0]} room={room} />

      {/* Dimensions Text */}
      <Text
        position={[0, room.wallHeight + 0.2, -room.depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
      >
        {`${room.width.toFixed(1)}m`}
      </Text>
      
      <Text
        position={[0, room.wallHeight + 0.2, room.depth / 2]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
        fontSize={0.4}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
      >
        {`${room.width.toFixed(1)}m`}
      </Text>

      <Text
        position={[-room.width / 2, room.wallHeight + 0.2, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        fontSize={0.4}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
      >
        {`${room.depth.toFixed(1)}m`}
      </Text>

      <Text
        position={[room.width / 2, room.wallHeight + 0.2, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        fontSize={0.4}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
      >
        {`${room.depth.toFixed(1)}m`}
      </Text>
    </group>
  );
}
