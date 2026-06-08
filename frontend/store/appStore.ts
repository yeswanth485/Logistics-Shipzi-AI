import { create } from "zustand";
import { BoxCatalog, OptimizationRun, OptimizedOrder } from "@/types";

// Types for bulk optimization results
export interface BulkOrderResult {
  row_index: number;
  product_sku: string;
  product_name: string;
  product_dimensions: string;
  used_box_name: string;
  used_box_dimensions: string;
  used_box_price: number;
  optimized_box_id: string;
  optimized_box_name: string;
  optimized_box_dimensions: string;
  optimized_box_price: number;
  savings: number;
  space_efficiency: number;
  empty_space_cm3: number;
  fragility_score: number;
  co2_reduction: number;
  optimized_box_l: number;
  optimized_box_w: number;
  optimized_box_h: number;
  product_l: number;
  product_w: number;
  product_h: number;
}

export interface BulkSummary {
  total_products: number;
  total_savings: number;
  total_co2_reduction: number;
  avg_space_efficiency: number;
}

interface AppState {
  boxes: BoxCatalog[];
  recentRuns: OptimizationRun[];
  recentOrders: OptimizedOrder[];
  isLoading: boolean;

  // Bulk optimization results
  bulkOrders: BulkOrderResult[];
  bulkSummary: BulkSummary | null;

  setBoxes: (boxes: BoxCatalog[]) => void;
  setRecentRuns: (recentRuns: OptimizationRun[]) => void;
  setRecentOrders: (recentOrders: OptimizedOrder[]) => void;
  setLoading: (status: boolean) => void;
  setBulkResults: (orders: BulkOrderResult[], summary: BulkSummary) => void;
  clearBulkResults: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  boxes: [],
  recentRuns: [],
  recentOrders: [],
  isLoading: false,
  bulkOrders: [],
  bulkSummary: null,

  setBoxes: (boxes) => set({ boxes }),
  setRecentRuns: (recentRuns) => set({ recentRuns }),
  setRecentOrders: (recentOrders) => set({ recentOrders }),
  setLoading: (status) => set({ isLoading: status }),
  setBulkResults: (orders, summary) => set({ bulkOrders: orders, bulkSummary: summary }),
  clearBulkResults: () => set({ bulkOrders: [], bulkSummary: null }),
}));
