/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { Room, FurnitureItem } from "@/types/planner";
import { usePlannerStore } from "@/store/plannerStore";

interface Props {
  room: Room;
  furnitureItems: FurnitureItem[];
}

export const DEFAULT_WALL_COLOR = "#f1ece3";

// Outward-facing normal of each wall, in the order they are built below
// (back -Z, front +Z, left -X, right +X). Used to decide which walls sit
// between the camera and the room interior so we can fade them out.
const WALL_NORMALS = [
  new THREE.Vector3(0, 0, -1),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(1, 0, 0),
];

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
  const wallColor = room.wallColor ?? DEFAULT_WALL_COLOR;
  const cuttersKey = serializeCutters(furnitureItems);

  const groupRef = useRef<THREE.Group>(null);
  // Scratch vectors reused every frame to avoid per-frame allocations. Refs
  // (not useMemo) so they can be mutated inside the frame loop.
  const centerRef = useRef(new THREE.Vector3());
  const camDirRef = useRef(new THREE.Vector3());

  // Geometry is keyed on dimensions + door/window cutters only — NOT on color,
  // so changing the wall colour never triggers the expensive CSG rebuild. Each
  // wall gets its OWN material so it can fade independently (Sims-style).
  const walls = useMemo(() => {
    const materials = WALL_NORMALS.map(
      () =>
        new THREE.MeshStandardMaterial({
          color: wallColor,
          roughness: 0.92,
          metalness: 0,
          transparent: true,
          opacity: 1,
        })
    );

    const make = (geo: THREE.BoxGeometry, mat: THREE.Material, pos: [number, number, number]) => {
      const m = new THREE.Mesh(geo, mat) as THREE.Mesh<any, any>;
      m.position.set(...pos);
      m.updateMatrix();
      return m;
    };

    let backWall = make(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), materials[0], [0, wallHeight / 2, -depth / 2 - wallThickness / 2]);
    let frontWall = make(new THREE.BoxGeometry(width + wallThickness * 2, wallHeight, wallThickness), materials[1], [0, wallHeight / 2, depth / 2 + wallThickness / 2]);
    let leftWall = make(new THREE.BoxGeometry(wallThickness, wallHeight, depth), materials[2], [-width / 2 - wallThickness / 2, wallHeight / 2, 0]);
    let rightWall = make(new THREE.BoxGeometry(wallThickness, wallHeight, depth), materials[3], [width / 2 + wallThickness / 2, wallHeight / 2, 0]);

    const cutObjects = furnitureItems.filter((i) => i.type === "door" || i.type === "window");

    if (cutObjects.length > 0) {
      let bCSG = CSG.fromMesh(backWall);
      let fCSG = CSG.fromMesh(frontWall);
      let lCSG = CSG.fromMesh(leftWall);
      let rCSG = CSG.fromMesh(rightWall);

      cutObjects.forEach((obj) => {
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

      backWall = CSG.toMesh(bCSG, new THREE.Matrix4(), materials[0]);
      frontWall = CSG.toMesh(fCSG, new THREE.Matrix4(), materials[1]);
      leftWall = CSG.toMesh(lCSG, new THREE.Matrix4(), materials[2]);
      rightWall = CSG.toMesh(rCSG, new THREE.Matrix4(), materials[3]);
    }

    const meshes = [backWall, frontWall, leftWall, rightWall];
    meshes.forEach((w) => {
      w.castShadow = true;
      w.receiveShadow = true;
    });

    return { meshes, materials };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, depth, wallHeight, wallThickness, cuttersKey]);

  // Mirror the built walls into a ref so the frame loop / colour effect can
  // mutate the three.js objects (idiomatic) without tripping the immutability
  // lint rule that guards values returned from useMemo.
  const wallsRef = useRef(walls);
  useEffect(() => {
    wallsRef.current = walls;
  }, [walls]);

  // Apply the wall colour without rebuilding geometry. Runs on colour change
  // (the memo above is re-run on a colour change because areEqual lets the
  // component re-render) and right after a geometry rebuild.
  useEffect(() => {
    wallsRef.current.materials.forEach((m) => m.color.set(wallColor));
  }, [wallColor, walls]);

  // Sims-style cutaway: in 3D, fade out the walls whose outward normal points
  // toward the camera (i.e. the ones standing between the viewer and the room
  // interior) so you can always see inside. In 2D (top-down) every wall stays
  // fully visible.
  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;
    const mode = usePlannerStore.getState().currentMode;
    const center = centerRef.current;
    const camDir = camDirRef.current;

    group.getWorldPosition(center);
    camDir.copy(camera.position).sub(center);
    camDir.y = 0;
    if (camDir.lengthSq() > 0.0001) camDir.normalize();

    const { meshes, materials } = wallsRef.current;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const mat = materials[i];
      // In 3D, a wall facing the camera (positive dot) fades away.
      const facing = mode === "3d" && WALL_NORMALS[i].dot(camDir) > 0.15;
      const target = facing ? 0 : 1;
      mat.opacity += (target - mat.opacity) * 0.18;
      if (mat.opacity < 0.02) mat.opacity = 0;
      // Hidden walls stop rendering entirely so they neither cast shadows nor
      // catch raycasts; opaque ones write depth normally.
      mesh.visible = mat.opacity > 0.02;
      mat.depthWrite = mat.opacity > 0.95;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={walls.meshes[0]} />
      <primitive object={walls.meshes[1]} />
      <primitive object={walls.meshes[2]} />
      <primitive object={walls.meshes[3]} />
    </group>
  );
}

// Skip re-rendering (and thus the CSG recompute / per-frame serialization) when
// only non-cutting furniture changed — e.g. while dragging a sofa around. A
// wall-colour change DOES force a re-render so the colour effect can run.
function areEqual(prev: Props, next: Props) {
  const r1 = prev.room;
  const r2 = next.room;
  if (
    r1.width !== r2.width ||
    r1.depth !== r2.depth ||
    r1.wallHeight !== r2.wallHeight ||
    r1.wallThickness !== r2.wallThickness ||
    r1.wallColor !== r2.wallColor
  ) {
    return false;
  }
  return serializeCutters(prev.furnitureItems) === serializeCutters(next.furnitureItems);
}

export default React.memo(Walls, areEqual);
