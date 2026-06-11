import { create } from "zustand";
import { FurnitureItem, ProjectState, Room } from "@/types/planner";
import { loadProjectFromStorage, saveProjectToStorage } from "@/utils/storage";

type PlannerState = ProjectState & {
  currentMode: "2d" | "3d";
  selectedItemId: string | null;
  setMode: (mode: "2d" | "3d") => void;
  addFurniture: (item: FurnitureItem) => void;
  updateFurniture: (id: string, data: Partial<FurnitureItem>) => void;
  deleteFurniture: (id: string) => void;
  selectFurniture: (id: string | null) => void;
  updateRoom: (data: Partial<Room>) => void;
  saveProject: () => void;
  loadProject: () => void;
  importProject: (state: ProjectState) => void;
  resetProject: () => void;
};

const defaultRoom: Room = {
  width: 5,
  depth: 4,
  wallHeight: 2.8,
  wallThickness: 0.2,
};

const defaultState: ProjectState = {
  room: defaultRoom,
  furnitureItems: [],
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  ...defaultState,
  currentMode: "2d",
  selectedItemId: null,

  setMode: (mode) => set({ currentMode: mode }),

  addFurniture: (item) =>
    set((state) => ({
      furnitureItems: [...state.furnitureItems, item],
      selectedItemId: item.id,
    })),

  updateFurniture: (id, data) =>
    set((state) => ({
      furnitureItems: state.furnitureItems.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),

  deleteFurniture: (id) =>
    set((state) => ({
      furnitureItems: state.furnitureItems.filter((item) => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    })),

  selectFurniture: (id) => set({ selectedItemId: id }),

  updateRoom: (data) =>
    set((state) => ({
      room: { ...state.room, ...data },
    })),

  saveProject: () => {
    const { room, furnitureItems } = get();
    saveProjectToStorage({ room, furnitureItems });
  },

  loadProject: () => {
    const savedState = loadProjectFromStorage();
    if (savedState) {
      set({
        room: savedState.room,
        furnitureItems: savedState.furnitureItems,
        selectedItemId: null,
      });
    }
  },

  importProject: (state) => {
    set({
      room: state.room,
      furnitureItems: state.furnitureItems,
      selectedItemId: null,
    });
  },

  resetProject: () => {
    set({
      ...defaultState,
      selectedItemId: null,
    });
  },
}));
