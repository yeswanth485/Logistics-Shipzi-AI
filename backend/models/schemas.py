from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class CompanyBase(BaseModel):
    company_name: str
    website_domain: Optional[str] = None
    location: Optional[str] = None
    logo_url: Optional[str] = None
    warehouse_type: Optional[str] = None
    shipping_regions: Optional[List[str]] = None
    packaging_preferences: Optional[Dict[str, Any]] = None
    sustainability_targets: Optional[Dict[str, float]] = None
    default_carrier: Optional[str] = None

class CompanyCreate(CompanyBase):
    user_id: UUID

class Company(CompanyBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    company_id: Optional[UUID] = None
    onboarding_complete: bool = False

class User(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BoxCatalogBase(BaseModel):
    company_id: Optional[UUID] = None
    box_name: str
    box_type: str
    length_cm: float
    width_cm: float
    height_cm: float
    max_weight_kg: float
    material_type: str
    sustainability_score: int
    cost_per_box: Optional[float] = None
    is_active: bool = True
    thumbnail_url: Optional[str] = None

class BoxCatalog(BoxCatalogBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    company_id: UUID
    product_name: str
    length_cm: Optional[float] = None
    width_cm: Optional[float] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fragility: Optional[str] = None
    quantity: int = 1
    shipping_zone: Optional[str] = None

class Product(ProductBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OptimizationRunBase(BaseModel):
    company_id: UUID
    user_id: UUID
    run_name: Optional[str] = None
    status: str = 'pending'
    total_products: int = 0
    total_shipments: int = 0
    csv_file_url: Optional[str] = None
    total_savings_usd: float = 0.0
    co2_reduction_kg: float = 0.0
    avg_space_efficiency: float = 0.0

class OptimizationRun(OptimizationRunBase):
    id: UUID
    created_at: datetime
    completed_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class OptimizedOrderBase(BaseModel):
    optimization_run_id: UUID
    company_id: UUID
    product_name: Optional[str] = None
    original_box_id: Optional[UUID] = None
    recommended_box_id: UUID
    quantity: int = 1
    space_efficiency: Optional[float] = None
    empty_space_cm3: Optional[float] = None
    original_shipping_cost: Optional[float] = None
    optimized_shipping_cost: Optional[float] = None
    savings_usd: Optional[float] = None
    dimensional_weight_kg: Optional[float] = None
    fragility_risk_score: Optional[float] = None
    sustainability_score: Optional[int] = None
    co2_reduction_kg: Optional[float] = None
    ai_recommendation_reason: Optional[str] = None
    optimization_score: Optional[float] = None

class OptimizedOrder(OptimizedOrderBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SustainabilityMetricBase(BaseModel):
    company_id: UUID
    period_start: datetime
    period_end: datetime
    total_co2_reduction_kg: float = 0.0
    packaging_waste_reduction_kg: float = 0.0
    recyclable_material_usage_pct: float = 0.0
    eco_score: int = 0
    boxes_optimized: int = 0

class SustainabilityMetric(SustainabilityMetricBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AnalyticsSnapshotBase(BaseModel):
    company_id: UUID
    snapshot_date: datetime
    total_shipments: int = 0
    optimized_shipments: int = 0
    total_savings_usd: float = 0.0
    avg_optimization_score: float = 0.0
    top_carrier: Optional[str] = None

class AnalyticsSnapshot(AnalyticsSnapshotBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
