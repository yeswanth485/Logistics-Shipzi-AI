import os
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.optimization import optimize_packaging, optimize_bulk_packaging

app = FastAPI(title="Shipzi API", version="2.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Single-item optimization models ─────────────────────────────────────────

class OptimizationItem(BaseModel):
    id: Optional[str] = None
    length: float = Field(gt=0)
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    weight: float = Field(default=0, ge=0)
    quantity: int = Field(default=1, ge=1)


class BoxOption(BaseModel):
    id: Optional[str] = None
    name: str
    length: float = Field(gt=0)
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    max_weight: float = Field(default=0, ge=0)


class OptimizationRequest(BaseModel):
    items: List[OptimizationItem]
    boxes: Optional[List[BoxOption]] = None


# ── Bulk optimization models ────────────────────────────────────────────────

class BulkProductRow(BaseModel):
    product_sku: Optional[str] = ""
    product_name: Optional[str] = ""
    product_length: float = Field(gt=0)
    product_width: float = Field(gt=0)
    product_height: float = Field(gt=0)
    product_weight: float = Field(default=0, ge=0)
    used_box_name: Optional[str] = "Current Box"
    used_box_length: float = Field(gt=0)
    used_box_width: float = Field(gt=0)
    used_box_height: float = Field(gt=0)
    used_box_price: float = Field(default=0, ge=0)
    fragility: Optional[str] = "low"


class BulkOptimizationRequest(BaseModel):
    rows: List[BulkProductRow]


DEFAULT_BOXES = [
    {"id": "standard-s", "name": "Standard S", "length": 15, "width": 10, "height": 10, "max_weight": 2},
    {"id": "standard-m", "name": "Standard M", "length": 25, "width": 20, "height": 15, "max_weight": 5},
    {"id": "standard-l", "name": "Standard L", "length": 40, "width": 30, "height": 20, "max_weight": 10},
    {"id": "eco-m",      "name": "Eco Medium",  "length": 25, "width": 20, "height": 15, "max_weight": 4},
]


@app.get("/")
def read_root():
    return {"message": "Welcome to Shipzi API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/optimize")
def optimize(request: OptimizationRequest):
    expanded_items = []
    for item in request.items:
        for copy_index in range(item.quantity):
            expanded_items.append({
                "id": item.id or f"item-{copy_index + 1}",
                "length": item.length,
                "width": item.width,
                "height": item.height,
                "weight": item.weight,
            })

    boxes = [box.model_dump() for box in request.boxes] if request.boxes else DEFAULT_BOXES
    return optimize_packaging(expanded_items, boxes)


@app.post("/optimize-bulk")
def optimize_bulk(request: BulkOptimizationRequest):
    """Bulk optimization: accepts a list of product rows with their currently-used box data."""
    rows = [row.model_dump() for row in request.rows]
    return optimize_bulk_packaging(rows)
