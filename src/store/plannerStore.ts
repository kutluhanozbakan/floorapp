/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { FurnitureItem, ProjectState, Room } from "@/types/planner";
import { loadProjectFromStorage, saveProjectToStorage } from "@/utils/storage";
import { generateId } from "@/utils/ids";

type HistorySnapshot = { rooms: Room[]; furnitureItems: FurnitureItem[] };

type PlannerState = ProjectState & {
  currentMode: "2d" | "3d";
  selectedItemId: string | null;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isDraggingItem: boolean;
  isArModalOpen: boolean;
  // Undo/redo stacks of {rooms, furnitureItems} snapshots.
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setDraggingItem: (dragging: boolean) => void;
  setArModalOpen: (open: boolean) => void;
  setMode: (mode: "2d" | "3d") => void;
  // Capture the current state onto the undo stack BEFORE an interaction mutates
  // it. Callers invoke this once at the start of a discrete change (or once per
  // drag/edit session) so high-frequency updates collapse into a single step.
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  toggleRoomLock: (id: string) => void;
  addFurniture: (item: FurnitureItem) => void;
  updateFurniture: (id: string, data: Partial<FurnitureItem>) => void;
  deleteFurniture: (id: string) => void;
  duplicateFurniture: (id: string) => void;
  nudgeFurniture: (id: string, dx: number, dz: number) => void;
  toggleFurnitureLock: (id: string) => void;
  selectFurniture: (id: string | null) => void; // Selects either a room or a furniture item
  saveProject: () => void;
  loadProject: () => void;
  importProject: (state: ProjectState) => void;
  resetProject: () => void;
};

const HISTORY_LIMIT = 50;

// Deep-clone the undoable slice. Data is plain arrays/objects/number tuples, so
// JSON round-trip is safe and avoids shared references between snapshots.
const snapshot = (s: ProjectState): HistorySnapshot => ({
  rooms: JSON.parse(JSON.stringify(s.rooms)),
  furnitureItems: JSON.parse(JSON.stringify(s.furnitureItems)),
});

const defaultRoom: Room = {
  id: "room-1",
  name: "Oturma Odası",
  position: [0, 0, 0],
  width: 5,
  depth: 4,
  wallHeight: 2.8,
  wallThickness: 0.2,
};

const defaultState: ProjectState = {
  rooms: [defaultRoom],
  furnitureItems: [],
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  ...defaultState,
  currentMode: "2d",
  selectedItemId: null,
  isLeftPanelOpen: false,
  isRightPanelOpen: false,
  isDraggingItem: false,
  isArModalOpen: false,
  past: [],
  future: [],

  setLeftPanelOpen: (open) => set({ isLeftPanelOpen: open }),
  setRightPanelOpen: (open) => set({ isRightPanelOpen: open }),
  setDraggingItem: (dragging) => set({ isDraggingItem: dragging }),
  setArModalOpen: (open) => set({ isArModalOpen: open }),

  setMode: (mode) => set({ currentMode: mode }),

  pushHistory: () =>
    set((state) => ({
      past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
      future: [], // any new change invalidates the redo stack
    })),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return {};
      const previous = state.past[state.past.length - 1];
      return {
        past: state.past.slice(0, -1),
        future: [snapshot(state), ...state.future].slice(0, HISTORY_LIMIT),
        rooms: previous.rooms,
        furnitureItems: previous.furnitureItems,
        selectedItemId: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return {};
      const next = state.future[0];
      return {
        past: [...state.past, snapshot(state)].slice(-HISTORY_LIMIT),
        future: state.future.slice(1),
        rooms: next.rooms,
        furnitureItems: next.furnitureItems,
        selectedItemId: null,
      };
    }),

  addRoom: (room) => {
    get().pushHistory();
    set((state) => ({
      rooms: [...state.rooms, room],
      selectedItemId: room.id,
    }));
  },

  updateRoom: (id, data) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === id ? { ...room, ...data } : room
      ),
    })),

  deleteRoom: (id) => {
    get().pushHistory();
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== id),
      furnitureItems: state.furnitureItems.filter((item) => item.roomId !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },

  toggleRoomLock: (id) => {
    get().pushHistory();
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === id ? { ...room, isLocked: !room.isLocked } : room
      ),
    }));
  },

  addFurniture: (item) => {
    get().pushHistory();
    set((state) => ({
      furnitureItems: [...state.furnitureItems, item],
      selectedItemId: item.id,
    }));
  },

  updateFurniture: (id, data) =>
    set((state) => ({
      furnitureItems: state.furnitureItems.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),

  deleteFurniture: (id) => {
    get().pushHistory();
    set((state) => ({
      furnitureItems: state.furnitureItems.filter((item) => item.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },

  duplicateFurniture: (id) => {
    const original = get().furnitureItems.find((i) => i.id === id);
    if (!original) return;
    get().pushHistory();
    const copy: FurnitureItem = {
      ...original,
      id: generateId(),
      // Offset the copy slightly so it doesn't sit exactly on the original.
      position: [original.position[0] + 0.3, original.position[1], original.position[2] + 0.3],
      isLocked: false,
    };
    set((state) => ({
      furnitureItems: [...state.furnitureItems, copy],
      selectedItemId: copy.id,
    }));
  },

  nudgeFurniture: (id, dx, dz) => {
    const item = get().furnitureItems.find((i) => i.id === id);
    if (!item || item.isLocked) return;
    get().pushHistory();
    set((state) => ({
      furnitureItems: state.furnitureItems.map((i) =>
        i.id === id
          ? { ...i, position: [i.position[0] + dx, i.position[1], i.position[2] + dz] }
          : i
      ),
    }));
  },

  toggleFurnitureLock: (id) => {
    get().pushHistory();
    set((state) => ({
      furnitureItems: state.furnitureItems.map((item) =>
        item.id === id ? { ...item, isLocked: !item.isLocked } : item
      ),
    }));
  },

  selectFurniture: (id) => set({ selectedItemId: id }),

  saveProject: () => {
    const { rooms, furnitureItems } = get();
    saveProjectToStorage({ rooms, furnitureItems });
  },

  loadProject: () => {
    const savedState = loadProjectFromStorage();
    if (savedState) {
      // Backward compatibility for old single room projects
      let rooms = savedState.rooms;
      if (!rooms && (savedState as any).room) {
        const oldRoom = (savedState as any).room;
        rooms = [{
          ...oldRoom,
          id: "room-1",
          name: "Oda 1",
          position: [0, 0, 0],
        }];
      }

      set({
        rooms: rooms || defaultState.rooms,
        furnitureItems: savedState.furnitureItems || [],
        selectedItemId: null,
        // Initial load is the baseline — nothing to undo back past it.
        past: [],
        future: [],
      });
    }
  },

  importProject: (state) => {
    // Backward compatibility
    let rooms = state.rooms;
    if (!rooms && (state as any).room) {
      const oldRoom = (state as any).room;
      rooms = [{
        ...oldRoom,
        id: "room-1",
        name: "İçe Aktarılan Oda",
        position: [0, 0, 0],
      }];
    }

    // Undoable: an accidental AR/JSON import can be reverted.
    get().pushHistory();
    set({
      rooms: rooms || defaultState.rooms,
      furnitureItems: state.furnitureItems || [],
      selectedItemId: null,
    });
  },

  resetProject: () => {
    // Undoable so a misfired reset doesn't destroy work irreversibly.
    get().pushHistory();
    set({
      ...defaultState,
      selectedItemId: null,
    });
  },
}));
