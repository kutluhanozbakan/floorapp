export type Room = {
  width: number;
  depth: number;
  wallHeight: number;
  wallThickness: number;
};

export type FurnitureType = "sofa" | "table" | "wardrobe" | "chair" | "bed" | "door" | "window";

export type FurnitureItem = {
  id: string;
  type: FurnitureType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

export type ProjectState = {
  room: Room;
  furnitureItems: FurnitureItem[];
};
