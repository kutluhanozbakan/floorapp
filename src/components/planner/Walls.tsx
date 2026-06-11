import React, { useMemo } from "react";
import { usePlannerStore } from "@/store/plannerStore";
import * as THREE from "three";
import { CSG } from "three-csg-ts";

export default function Walls() {
  const { room, furnitureItems } = usePlannerStore();
  const { width, depth, wallHeight, wallThickness } = room;

  const walls = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ color: "#f8fafc" });
    
    let backWall = new THREE.Mesh(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), material);
    backWall.position.set(0, wallHeight / 2, -depth / 2 - wallThickness / 2);
    backWall.updateMatrix();

    let frontWall = new THREE.Mesh(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), material);
    frontWall.position.set(0, wallHeight / 2, depth / 2 + wallThickness / 2);
    frontWall.updateMatrix();

    let leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth), material);
    leftWall.position.set(-width / 2 - wallThickness / 2, wallHeight / 2, 0);
    leftWall.updateMatrix();

    let rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, depth), material);
    rightWall.position.set(width / 2 + wallThickness / 2, wallHeight / 2, 0);
    rightWall.updateMatrix();

    const cutObjects = furnitureItems.filter(i => i.type === "door" || i.type === "window");

    if (cutObjects.length > 0) {
      let bCSG = CSG.fromMesh(backWall);
      let fCSG = CSG.fromMesh(frontWall);
      let lCSG = CSG.fromMesh(leftWall);
      let rCSG = CSG.fromMesh(rightWall);

      cutObjects.forEach(obj => {
        // Create a cutter that is slightly thicker than the wall to avoid z-fighting / unclean cuts
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
    
    // Ensure they cast and receive shadows
    [backWall, frontWall, leftWall, rightWall].forEach(w => {
      w.castShadow = true;
      w.receiveShadow = true;
    });

    return { backWall, frontWall, leftWall, rightWall };
  }, [width, depth, wallHeight, wallThickness, furnitureItems]);

  return (
    <group>
      <primitive object={walls.backWall} />
      <primitive object={walls.frontWall} />
      <primitive object={walls.leftWall} />
      <primitive object={walls.rightWall} />
    </group>
  );
}
