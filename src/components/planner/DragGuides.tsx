import React from "react";
import { Line, Html } from "@react-three/drei";
import { FurnitureItem, Room } from "@/types/planner";

interface Props {
  item: FurnitureItem;
  room: Room;
}

// Live measurement guides shown while a furniture item is dragged: a line to the
// nearest wall on each axis plus the gap in metres. Rendered in room-local,
// UNSCALED space (inside RoomGroup) so distances are accurate.
export default function DragGuides({ item, room }: Props) {
  const accent = "#d97745";

  // Footprint half-extents, accounting for a 90° rotation swapping W/D.
  const rotated = Math.abs(Math.round(item.rotation[1] / (Math.PI / 2)) % 2) === 1;
  const halfX = (rotated ? item.scale[2] : item.scale[0]) / 2;
  const halfZ = (rotated ? item.scale[0] : item.scale[2]) / 2;

  const px = item.position[0];
  const pz = item.position[2];
  const minX = -room.width / 2;
  const maxX = room.width / 2;
  const minZ = -room.depth / 2;
  const maxZ = room.depth / 2;

  const leftGap = px - halfX - minX;
  const rightGap = maxX - (px + halfX);
  const backGap = pz - halfZ - minZ;
  const frontGap = maxZ - (pz + halfZ);

  // Pick the nearer wall on each axis.
  const xToLeft = leftGap <= rightGap;
  const zToBack = backGap <= frontGap;

  const xWall = xToLeft ? minX : maxX;
  const xEdge = xToLeft ? px - halfX : px + halfX;
  const xGap = Math.max(0, xToLeft ? leftGap : rightGap);

  const zWall = zToBack ? minZ : maxZ;
  const zEdge = zToBack ? pz - halfZ : pz + halfZ;
  const zGap = Math.max(0, zToBack ? backGap : frontGap);

  const y = 0.03;
  const label =
    "pointer-events-none select-none px-1.5 py-0.5 rounded bg-[#d97745] text-white text-[10px] font-medium tabular-nums whitespace-nowrap shadow";

  return (
    <group>
      {/* X-axis guide */}
      <Line points={[[xEdge, y, pz], [xWall, y, pz]]} color={accent} lineWidth={1.5} />
      <Html position={[(xEdge + xWall) / 2, y, pz]} center zIndexRange={[60, 0]} style={{ pointerEvents: "none" }}>
        <div className={label}>{xGap.toFixed(2)} m</div>
      </Html>

      {/* Z-axis guide */}
      <Line points={[[px, y, zEdge], [px, y, zWall]]} color={accent} lineWidth={1.5} />
      <Html position={[px, y, (zEdge + zWall) / 2]} center zIndexRange={[60, 0]} style={{ pointerEvents: "none" }}>
        <div className={label}>{zGap.toFixed(2)} m</div>
      </Html>
    </group>
  );
}
