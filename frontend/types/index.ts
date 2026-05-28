export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_id?: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Company {
  id: string;
  company_name: string;
  website_domain?: string;
  location?: string;
  logo_url?: string;
  warehouse_type?: 'small' | 'medium' | 'large' | 'enterprise';
  shipping_regions?: string[];
  packaging_preferences?: Record<string, unknown>;
  sustainability_targets?: {
    co2_reduction_goal: number;
    waste_reduction_goal: number;
  };
  default_carrier?: string;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  product_name: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg: number;
  fragility: 'low' | 'medium' | 'high' | 'extreme';
  quantity: number;
  shipping_zone?: string;
  created_at: string;
}

export interface BoxCatalog {
  id: string;
  company_id?: string;
  box_name: string;
  box_type: 'standard' | 'heavy_duty' | 'eco' | 'fragile' | 'custom' | 'mailer' | 'tube' | 'flat';
  length_cm: number;
  width_cm: number;
  height_cm: number;
  max_weight_kg: number;
  material_type: 'cardboard' | 'corrugated' | 'recycled' | 'biodegradable' | 'plastic' | 'foam_lined';
  sustainability_score: number;
  cost_per_box?: number;
  is_active: boolean;
  thumbnail_url?: string;
  created_at: string;
}

export interface OptimizationRun {
  id: string;
  company_id: string;
  user_id: string;
  run_name?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_products: number;
  total_shipments: number;
  csv_file_url?: string;
  total_savings_usd?: number;
  co2_reduction_kg?: number;
  avg_space_efficiency?: number;
  created_at: string;
  completed_at?: string;
}

export interface OptimizedOrder {
  id: string;
  optimization_run_id: string;
  company_id: string;
  product_name: string;
  original_box_id?: string;
  recommended_box_id: string;
  quantity: number;
  space_efficiency: number;
  empty_space_cm3: number;
  original_shipping_cost?: number;
  optimized_shipping_cost: number;
  savings_usd: number;
  dimensional_weight_kg: number;
  fragility_risk_score: number;
  sustainability_score: number;
  co2_reduction_kg: number;
  ai_recommendation_reason?: string;
  optimization_score: number;
  created_at: string;
}

export interface SustainabilityMetric {
  id: string;
  company_id: string;
  period_start: string;
  period_end: string;
  total_co2_reduction_kg: number;
  packaging_waste_reduction_kg: number;
  recyclable_material_usage_pct: number;
  eco_score: number;
  boxes_optimized: number;
  created_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  company_id: string;
  snapshot_date: string;
  total_shipments: number;
  optimized_shipments: number;
  total_savings_usd: number;
  avg_optimization_score: number;
  top_carrier?: string;
  created_at: string;
}
