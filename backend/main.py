import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.optimization import optimize_packaging

app = FastAPI(title="PackIQ API", version="1.0.0")

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


class OptimizationItem(BaseModel):
    id: str | None = None
    length: float = Field(gt=0)
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    weight: float = Field(default=0, ge=0)
    quantity: int = Field(default=1, ge=1)


class BoxOption(BaseModel):
    id: str | None = None
    name: str
    length: float = Field(gt=0)
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    max_weight: float = Field(default=0, ge=0)


class OptimizationRequest(BaseModel):
    items: List[OptimizationItem]
    boxes: List[BoxOption] | None = None


DEFAULT_BOXES = [
    {"id": "standard-s", "name": "Standard S", "length": 15, "width": 10, "height": 10, "max_weight": 2},
    {"id": "standard-m", "name": "Standard M", "length": 25, "width": 20, "height": 15, "max_weight": 5},
    {"id": "standard-l", "name": "Standard L", "length": 40, "width": 30, "height": 20, "max_weight": 10},
    {"id": "eco-m", "name": "Eco Medium", "length": 25, "width": 20, "height": 15, "max_weight": 4},
]


@app.get("/")
def read_root():
    return {"message": "Welcome to PackIQ API"}


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
