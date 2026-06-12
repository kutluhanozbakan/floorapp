import { ProjectState } from "@/types/planner";
import { generateId } from "@/utils/ids";

// A small furnished living room used by the empty-state "Örnek plan" option.
export function buildSampleProject(): ProjectState {
  const roomId = generateId();
  return {
    rooms: [
      { id: roomId, name: "Örnek Salon", position: [0, 0, 0], width: 5, depth: 4, wallHeight: 2.8, wallThickness: 0.2 },
    ],
    furnitureItems: [
      { id: generateId(), roomId, type: "rug", name: "Halı", position: [0, 0, 0.2], rotation: [0, 0, 0], scale: [2.2, 0.02, 1.6] },
      { id: generateId(), roomId, type: "sofa", name: "Koltuk", position: [0, 0, -1.4], rotation: [0, 0, 0], scale: [2, 0.8, 0.9] },
      { id: generateId(), roomId, type: "coffee_table", name: "Sehpa", position: [0, 0, 0.1], rotation: [0, 0, 0], scale: [1.1, 0.45, 0.6] },
      { id: generateId(), roomId, type: "tv_unit", name: "TV Ünitesi", position: [0, 0, 1.7], rotation: [0, Math.PI, 0], scale: [1.8, 0.5, 0.45] },
      { id: generateId(), roomId, type: "tv", name: "TV", position: [0, 0.55, 1.78], rotation: [0, Math.PI, 0], scale: [1.2, 0.8, 0.1] },
      { id: generateId(), roomId, type: "plant", name: "Bitki", position: [-1.9, 0, -1.4], rotation: [0, 0, 0], scale: [0.4, 1.1, 0.4] },
      { id: generateId(), roomId, type: "lamp", name: "Lamba", position: [1.9, 0, -1.4], rotation: [0, 0, 0], scale: [0.3, 1.6, 0.3] },
      { id: generateId(), roomId, type: "armchair", name: "Berjer", position: [1.5, 0, 0.4], rotation: [0, -Math.PI / 2, 0], scale: [0.9, 0.85, 0.9] },
    ],
  };
}
