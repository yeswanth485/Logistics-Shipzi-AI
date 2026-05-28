import { create } from "zustand";
import { BoxCatalog, OptimizationRun, OptimizedOrder } from "@/types";

interface AppState {
  boxes: BoxCatalog[];
  recentRuns: OptimizationRun[];
  recentOrders: OptimizedOrder[];
  isLoading: boolean;
  
  setBoxes: (boxes: BoxCatalog[]) => void;
  setRecentRuns: (recentRuns: OptimizationRun[]) => void;
  setRecentOrders: (recentOrders: OptimizedOrder[]) => void;
  setLoading: (status: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  boxes: [],
  recentRuns: [],
  recentOrders: [],
  isLoading: false,
  
  setBoxes: (boxes) => set({ boxes }),
  setRecentRuns: (recentRuns) => set({ recentRuns }),
  setRecentOrders: (recentOrders) => set({ recentOrders }),
  setLoading: (status) => set({ isLoading: status }),
}));
