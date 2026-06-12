export type Room = {
  id: string;
  name: string;
  position: [number, number, number];
  width: number;
  depth: number;
  wallHeight: number;
  wallThickness: number;
};

export type FurnitureType = "sofa" | "table" | "wardrobe" | "chair" | "bed" | "door" | "window";

export type FurnitureItem = {
  id: string;
  roomId?: string; // Optional for backward compatibility or global items
  type: FurnitureType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type ProjectState = {
  rooms: Room[];
  furnitureItems: FurnitureItem[];
};
