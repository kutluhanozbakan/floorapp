import React, { useRef, useState } from "react";
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
  const { camera } = useThree();
  const { selectFurniture, selectedItemId, updateFurniture, currentMode, room } = usePlannerStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = selectedItemId === item.id;

  const bind = useDrag(({ active, event, memo }) => {
    // Basic drag logic via raycasting to a plane
    const e = event as unknown as PointerEvent;
    
    // Stop event propagation so orbit controls doesn't interfere as much
    if (active && currentMode === "2d") {
      e.stopPropagation();
    }
    
    if (!memo) {
      memo = { position: new THREE.Vector3(...item.position) };
      selectFurniture(item.id);
    }
    
    if (active) {
      const vec = new THREE.Vector3();
      const pos = new THREE.Vector3();
      vec.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vec.unproject(camera);
      vec.sub(camera.position).normalize();
      const distance = -camera.position.y / vec.y;
      pos.copy(camera.position).add(vec.multiplyScalar(distance));
      
      let targetX = pos.x;
      let targetZ = pos.z;
      let targetRotation = item.rotation;

      const snapDistance = 0.5;
      const isDoorOrWindow = item.type === "door" || item.type === "window";
      
      const minX = -room.width / 2;
      const maxX = room.width / 2;
      const minZ = -room.depth / 2;
      const maxZ = room.depth / 2;

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
        rotation: targetRotation as [number, number, number]
      });
    }

    return memo;
  });

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
