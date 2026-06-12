/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { Room, FurnitureItem } from "@/types/planner";

interface Props {
  room: Room;
  furnitureItems: FurnitureItem[];
}

// Only the door/window items actually affect the wall geometry (they get cut
// out via CSG). Serializing just those lets us skip the expensive CSG work when
// any other furniture (e.g. a sofa) is being dragged.
const serializeCutters = (items: FurnitureItem[]) =>
  JSON.stringify(
    items
      .filter((i) => i.type === "door" || i.type === "window")
      .map((i) => ({ p: i.position, r: i.rotation, s: i.scale }))
  );

function Walls({ room, furnitureItems }: Props) {
  const { width, depth, wallHeight, wallThickness } = room;
  const cuttersKey = serializeCutters(furnitureItems);

  const walls = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: "#f8fafc" });
    
    let backWall: THREE.Mesh<any, any> = new THREE.Mesh(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), material);
    backWall.position.set(0, wallHeight / 2, -depth / 2 - wallThickness / 2);
    backWall.updateMatrix();

    let frontWall: THREE.Mesh<any, any> = new THREE.Mesh(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), material);
    frontWall.position.set(0, wallHeight / 2, depth / 2 + wallThickness / 2);
    frontWall.updateMatrix();

    let leftWall: THREE.Mesh<any, any> = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth), material);
    leftWall.position.set(-width / 2 - wallThickness / 2, wallHeight / 2, 0);
    leftWall.updateMatrix();

    let rightWall: THREE.Mesh<any, any> = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth), material);
    rightWall.position.set(width / 2 + wallThickness / 2, wallHeight / 2, 0);
    rightWall.updateMatrix();

    const cutObjects = furnitureItems.filter(i => i.type === "door" || i.type === "window");

    if (cutObjects.length > 0) {
      let bCSG = CSG.fromMesh(backWall);
      let fCSG = CSG.fromMesh(frontWall);
      let lCSG = CSG.fromMesh(leftWall);
      let rCSG = CSG.fromMesh(rightWall);

      cutObjects.forEach(obj => {
        const cutter = new THREE.Mesh(new THREE.BoxGeometry(obj.scale[0], obj.scale[1], wallThickness + 0.5));
        cutter.position.set(obj.position[0], obj.position[1], obj.position[2]);
        cutter.rotation.set(obj.rotation[0], obj.rotation[1], obj.rotation[2]);
        cutter.updateMatrix();

        const cutterCSG = CSG.fromMesh(cutter);

        bCSG = bCSG.subtract(cutterCSG);
        fCSG = fCSG.subtract(cutterCSG);
        lCSG = lCSG.subtract(cutterCSG);
        rCSG = rCSG.subtract(cutterCSG);
      });

      backWall = CSG.toMesh(bCSG, new THREE.Matrix4(), material);
      frontWall = CSG.toMesh(fCSG, new THREE.Matrix4(), material);
      leftWall = CSG.toMesh(lCSG, new THREE.Matrix4(), material);
      rightWall = CSG.toMesh(rCSG, new THREE.Matrix4(), material);
    }
    
    [backWall, frontWall, leftWall, rightWall].forEach(w => {
      w.castShadow = true;
      w.receiveShadow = true;
    });

    return { backWall, frontWall, leftWall, rightWall };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, depth, wallHeight, wallThickness, cuttersKey]);

  return (
    <group>
      <primitive object={walls.backWall} />
      <primitive object={walls.frontWall} />
      <primitive object={walls.leftWall} />
      <primitive object={walls.rightWall} />
    </group>
  );
}

// Skip re-rendering (and thus the CSG recompute / per-frame serialization) when
// only non-cutting furniture changed — e.g. while dragging a sofa around.
function areEqual(prev: Props, next: Props) {
  const r1 = prev.room;
  const r2 = next.room;
  if (
    r1.width !== r2.width ||
    r1.depth !== r2.depth ||
    r1.wallHeight !== r2.wallHeight ||
    r1.wallThickness !== r2.wallThickness
  ) {
    return false;
  }
  return serializeCutters(prev.furnitureItems) === serializeCutters(next.furnitureItems);
}

export default React.memo(Walls, areEqual);
