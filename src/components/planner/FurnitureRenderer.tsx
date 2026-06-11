import React from "react";
import { usePlannerStore } from "@/store/plannerStore";
import FurnitureItemComponent from "./FurnitureItem";

export default function FurnitureRenderer() {
  const { furnitureItems } = usePlannerStore();

  return (
    <group>
      {furnitureItems.map((item) => (
        <FurnitureItemComponent key={item.id} item={item} />
      ))}
    </group>
  );
}
