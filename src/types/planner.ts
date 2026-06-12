export type Room = {
  id: string;
  name: string;
  position: [number, number, number];
  width: number;
  depth: number;
  wallHeight: number;
  wallThickness: number;
  isLocked?: boolean;
};

export type FurnitureType = 
  | "sofa" | "table" | "wardrobe" | "chair" | "bed" | "door" | "window"
  | "tv" | "bookshelf" | "plant" | "lamp" | "rug" | "desk" | "nightstand"
  | "toilet" | "sink" | "bathtub" | "stove" | "fridge" | "kitchen_cabinet";

export type FurnitureItem = {
  id: string;
  roomId?: string; // Optional for backward compatibility or global items
  type: FurnitureType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isLocked?: boolean;
};

export type ProjectState = {
  rooms: Room[];
  furnitureItems: FurnitureItem[];
};
