import React from "react";
import { FurnitureType } from "@/types/planner";
import {
  Armchair, Bed, Table, Box, DoorOpen, LayoutPanelTop,
  Tv, Library, Trees, Lightbulb, Grid3X3, Laptop,
  Bath, Droplets, Flame, Refrigerator, Archive,
  Sofa, Coffee, WashingMachine, ShowerHead, Square, CookingPot,
} from "lucide-react";

export type FurnitureCategory = "Oturma" | "Masa" | "Yatak" | "Mutfak" | "Banyo" | "Yapısal" | "Dekor";

export const CATEGORIES: FurnitureCategory[] = [
  "Oturma", "Masa", "Yatak", "Mutfak", "Banyo", "Yapısal", "Dekor",
];

export interface CatalogItem {
  type: FurnitureType;
  name: string;
  category: FurnitureCategory;
  icon: React.ReactNode;
  scale: [number, number, number];
}

export const CATALOG: CatalogItem[] = [
  { type: "sofa", name: "Koltuk", category: "Oturma", icon: <Armchair className="w-5 h-5" />, scale: [2, 0.8, 0.9] },
  { type: "armchair", name: "Berjer", category: "Oturma", icon: <Sofa className="w-5 h-5 scale-90" />, scale: [0.9, 0.85, 0.9] },
  { type: "chair", name: "Sandalye", category: "Oturma", icon: <Armchair className="w-5 h-5 scale-75" />, scale: [0.5, 0.9, 0.5] },
  { type: "table", name: "Masa", category: "Masa", icon: <Table className="w-5 h-5" />, scale: [1.6, 0.75, 0.9] },
  { type: "coffee_table", name: "Sehpa", category: "Masa", icon: <Coffee className="w-5 h-5" />, scale: [1.1, 0.45, 0.6] },
  { type: "desk", name: "Çalışma Masası", category: "Masa", icon: <Laptop className="w-5 h-5" />, scale: [1.2, 0.75, 0.6] },
  { type: "bed", name: "Yatak", category: "Yatak", icon: <Bed className="w-5 h-5" />, scale: [1.6, 0.6, 2.0] },
  { type: "nightstand", name: "Komodin", category: "Yatak", icon: <Box className="w-5 h-5 scale-75" />, scale: [0.5, 0.5, 0.4] },
  { type: "dresser", name: "Şifonyer", category: "Yatak", icon: <Box className="w-5 h-5" />, scale: [1.0, 0.9, 0.5] },
  { type: "wardrobe", name: "Gardırop", category: "Yatak", icon: <Box className="w-5 h-5" />, scale: [1.2, 2.2, 0.6] },
  { type: "stove", name: "Ocak", category: "Mutfak", icon: <Flame className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
  { type: "fridge", name: "Buzdolabı", category: "Mutfak", icon: <Refrigerator className="w-5 h-5" />, scale: [0.7, 1.8, 0.7] },
  { type: "kitchen_cabinet", name: "Mutfak Dolabı", category: "Mutfak", icon: <Archive className="w-5 h-5" />, scale: [0.6, 0.9, 0.6] },
  { type: "kitchen_counter", name: "Tezgah", category: "Mutfak", icon: <CookingPot className="w-5 h-5" />, scale: [1.2, 0.9, 0.6] },
  { type: "washing_machine", name: "Çamaşır Mak.", category: "Mutfak", icon: <WashingMachine className="w-5 h-5" />, scale: [0.6, 0.85, 0.6] },
  { type: "toilet", name: "Klozet", category: "Banyo", icon: <Bath className="w-5 h-5 scale-75" />, scale: [0.4, 0.8, 0.6] },
  { type: "sink", name: "Lavabo", category: "Banyo", icon: <Droplets className="w-5 h-5" />, scale: [0.6, 0.85, 0.5] },
  { type: "bathtub", name: "Küvet", category: "Banyo", icon: <Bath className="w-5 h-5" />, scale: [1.7, 0.6, 0.8] },
  { type: "shower", name: "Duş", category: "Banyo", icon: <ShowerHead className="w-5 h-5" />, scale: [0.9, 2.1, 0.9] },
  { type: "mirror", name: "Ayna", category: "Banyo", icon: <Square className="w-5 h-5" />, scale: [0.7, 1.0, 0.05] },
  { type: "door", name: "Kapı", category: "Yapısal", icon: <DoorOpen className="w-5 h-5" />, scale: [0.9, 2.1, 0.1] },
  { type: "window", name: "Pencere", category: "Yapısal", icon: <LayoutPanelTop className="w-5 h-5" />, scale: [1.2, 1.2, 0.1] },
  { type: "tv", name: "TV", category: "Dekor", icon: <Tv className="w-5 h-5" />, scale: [1.2, 0.8, 0.1] },
  { type: "tv_unit", name: "TV Ünitesi", category: "Dekor", icon: <Tv className="w-5 h-5 scale-90" />, scale: [1.8, 0.5, 0.45] },
  { type: "bookshelf", name: "Kitaplık", category: "Dekor", icon: <Library className="w-5 h-5" />, scale: [0.8, 2.0, 0.4] },
  { type: "plant", name: "Bitki", category: "Dekor", icon: <Trees className="w-5 h-5" />, scale: [0.4, 1.0, 0.4] },
  { type: "lamp", name: "Lamba", category: "Dekor", icon: <Lightbulb className="w-5 h-5" />, scale: [0.3, 1.6, 0.3] },
  { type: "rug", name: "Halı", category: "Dekor", icon: <Grid3X3 className="w-5 h-5" />, scale: [2.0, 0.02, 1.5] },
];

export const CATALOG_BY_TYPE: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG.map((c) => [c.type, c])
);

// Default y-offset on add: windows/mirrors hang ~1m up, doors rest on the floor.
export const defaultYForAdd = (type: FurnitureType, scale: [number, number, number]): number => {
  if (type === "window" || type === "mirror") return 1.0 + scale[1] / 2;
  if (type === "door") return scale[1] / 2;
  return 0;
};
