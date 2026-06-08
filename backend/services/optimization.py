from typing import List, Dict, Any


# ── Default box catalog (mirrors the DB seed data) ──────────────────────────
DEFAULT_BOX_CATALOG: List[Dict[str, Any]] = [
    {"id": "standard-s",  "name": "Standard S",        "length": 15, "width": 10, "height": 10, "max_weight": 2,   "cost": 0.40},
    {"id": "standard-m",  "name": "Standard M",        "length": 25, "width": 20, "height": 15, "max_weight": 5,   "cost": 0.70},
    {"id": "standard-l",  "name": "Standard L",        "length": 40, "width": 30, "height": 20, "max_weight": 10,  "cost": 1.20},
    {"id": "standard-xl", "name": "Standard XL",       "length": 50, "width": 40, "height": 30, "max_weight": 20,  "cost": 1.80},
    {"id": "standard-xxl","name": "Standard XXL",       "length": 60, "width": 50, "height": 40, "max_weight": 30,  "cost": 2.50},
    {"id": "hd-s",        "name": "HD Small",           "length": 20, "width": 20, "height": 20, "max_weight": 15,  "cost": 1.50},
    {"id": "hd-m",        "name": "HD Medium",          "length": 30, "width": 30, "height": 30, "max_weight": 25,  "cost": 2.20},
    {"id": "hd-l",        "name": "HD Large",           "length": 45, "width": 40, "height": 40, "max_weight": 40,  "cost": 3.50},
    {"id": "eco-s",       "name": "Eco Small",          "length": 15, "width": 15, "height": 10, "max_weight": 2,   "cost": 0.50},
    {"id": "eco-m",       "name": "Eco Medium",         "length": 25, "width": 20, "height": 15, "max_weight": 4,   "cost": 0.85},
    {"id": "eco-l",       "name": "Eco Large",          "length": 35, "width": 25, "height": 20, "max_weight": 8,   "cost": 1.40},
    {"id": "eco-ship",    "name": "Eco Shipper",        "length": 45, "width": 35, "height": 25, "max_weight": 15,  "cost": 2.10},
    {"id": "fragile-s",   "name": "Fragile S",          "length": 20, "width": 15, "height": 15, "max_weight": 2,   "cost": 2.50},
    {"id": "fragile-m",   "name": "Fragile M",          "length": 30, "width": 25, "height": 20, "max_weight": 5,   "cost": 4.00},
    {"id": "fragile-l",   "name": "Fragile L",          "length": 45, "width": 35, "height": 30, "max_weight": 10,  "cost": 6.50},
    {"id": "mailer-s",    "name": "Poly Mailer S",      "length": 25, "width": 15, "height": 2,  "max_weight": 1,   "cost": 0.15},
    {"id": "mailer-m",    "name": "Kraft Mailer M",     "length": 35, "width": 25, "height": 3,  "max_weight": 2,   "cost": 0.40},
    {"id": "flat-book",   "name": "Book Shipper",       "length": 30, "width": 25, "height": 5,  "max_weight": 3,   "cost": 0.90},
    {"id": "flat-laptop", "name": "Laptop Box",         "length": 40, "width": 30, "height": 6,  "max_weight": 4,   "cost": 1.80},
    {"id": "tube-poster", "name": "Poster Tube S",      "length": 60, "width": 5,  "height": 5,  "max_weight": 1,   "cost": 1.10},
]

# Pre-compute volumes for catalog
for _b in DEFAULT_BOX_CATALOG:
    _b["volume"] = _b["length"] * _b["width"] * _b["height"]


def _find_best_box(item_length: float, item_width: float, item_height: float,
                   item_weight: float, catalog: List[Dict[str, Any]]) -> Dict[str, Any] | None:
    """Find the smallest box from the catalog that fits the item (FFD by volume)."""
    item_dims = sorted([item_length, item_width, item_height])
    item_vol = item_length * item_width * item_height

    candidates = []
    for box in catalog:
        box_dims = sorted([box["length"], box["width"], box["height"]])
        if (item_dims[0] <= box_dims[0] and
            item_dims[1] <= box_dims[1] and
            item_dims[2] <= box_dims[2] and
            item_vol <= box["volume"] and
            item_weight <= box.get("max_weight", 999)):
            candidates.append(box)

    if not candidates:
        return None

    # Pick the smallest-volume box that fits
    candidates.sort(key=lambda b: b["volume"])
    return candidates[0]


def _fragility_score(fragility: str) -> float:
    """Map fragility text to a 0-1 score."""
    mapping = {"low": 0.2, "medium": 0.5, "high": 0.8, "extreme": 1.0}
    return mapping.get(fragility, 0.3)


# ── Single-item optimization (existing endpoint) ────────────────────────────

def optimize_packaging(items: List[Dict[str, float]], boxes: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Core AI Optimization Engine based on First Fit Decreasing (FFD) algorithm.
    This simulates placing items into available boxes to find the optimal packaging configuration.
    """
    if not items or not boxes:
        return {"error": "Items and boxes are required"}

    # Calculate item volumes and sort decreasing
    for item in items:
        item['volume'] = item['length'] * item['width'] * item['height']

    sorted_items = sorted(items, key=lambda x: x['volume'], reverse=True)

    # Sort boxes by volume ascending (to pick the smallest possible box)
    for box in boxes:
        if 'volume' not in box:
            box['volume'] = box['length'] * box['width'] * box['height']

    sorted_boxes = sorted(boxes, key=lambda x: x['volume'])

    # Basic FFD simulation
    best_box = None

    for box in sorted_boxes:
        total_item_volume = sum(item['volume'] for item in sorted_items)
        if total_item_volume > box['volume']:
            continue

        fits = True
        for item in sorted_items:
            item_dims = sorted([item['length'], item['width'], item['height']])
            box_dims = sorted([box['length'], box['width'], box['height']])

            if not (item_dims[0] <= box_dims[0] and
                    item_dims[1] <= box_dims[1] and
                    item_dims[2] <= box_dims[2]):
                fits = False
                break

        if fits:
            best_box = box
            break

    if not best_box:
        best_box = sorted_boxes[-1]

    # Generate 3D placement coordinates
    placed_items = []
    current_z = 0
    for item in sorted_items:
        placed_items.append({
            "id": item.get('id', 'item'),
            "dimensions": [item['length'], item['height'], item['width']],
            "position": [0, item['height'] / 2, current_z],
            "color": "#06B6D4"
        })
        current_z += item['width']

    # Calculate metrics
    total_volume = sum(i['volume'] for i in sorted_items)
    box_volume = best_box['volume']
    utilization = (total_volume / box_volume) * 100 if box_volume > 0 else 0
    void_space = 100 - utilization

    savings = round(max(0, (box_volume - total_volume) / 1000 * 0.5), 2)
    co2_reduction = round(savings * 0.12, 2)

    return {
        "box": {
            "id": best_box.get('id', 'custom'),
            "name": best_box.get('name', 'Optimized Box'),
            "dimensions": [best_box['length'], best_box['height'], best_box['width']]
        },
        "placements": placed_items,
        "metrics": {
            "utilization": round(utilization, 1),
            "voidSpace": round(void_space, 1),
            "savings": savings,
            "co2Reduction": co2_reduction
        }
    }


# ── Bulk optimization (CSV upload endpoint) ─────────────────────────────────

def optimize_bulk_packaging(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Process a list of product rows, each with their currently-used box data.
    For each row, find the smallest box from the catalog that fits the product.
    Savings = used_box_price - optimized_box_price.
    The optimized box must be <= the used box in volume.
    """
    catalog = sorted(DEFAULT_BOX_CATALOG, key=lambda b: b["volume"])
    results: List[Dict[str, Any]] = []
    total_savings = 0.0
    total_co2 = 0.0

    for idx, row in enumerate(rows):
        product_length = float(row.get("product_length", 0))
        product_width = float(row.get("product_width", 0))
        product_height = float(row.get("product_height", 0))
        product_weight = float(row.get("product_weight", 0))
        fragility = str(row.get("fragility", "low")).lower()

        used_box_length = float(row.get("used_box_length", 0))
        used_box_width = float(row.get("used_box_width", 0))
        used_box_height = float(row.get("used_box_height", 0))
        used_box_price = float(row.get("used_box_price", 0))
        used_box_name = str(row.get("used_box_name", "Current Box"))
        used_box_volume = used_box_length * used_box_width * used_box_height

        # Find optimized box from the catalog
        best = _find_best_box(product_length, product_width, product_height,
                              product_weight, catalog)

        if best is None:
            # Fallback: no catalog box fits – keep the used box
            best = {
                "id": "used-fallback",
                "name": used_box_name,
                "length": used_box_length,
                "width": used_box_width,
                "height": used_box_height,
                "volume": used_box_volume,
                "cost": used_box_price,
                "max_weight": 999,
            }

        opt_volume = best["volume"]
        opt_price = best.get("cost", 0)

        # Only recommend a smaller or equal box
        if opt_volume > used_box_volume:
            best = {
                "id": "used-keep",
                "name": used_box_name,
                "length": used_box_length,
                "width": used_box_width,
                "height": used_box_height,
                "volume": used_box_volume,
                "cost": used_box_price,
                "max_weight": 999,
            }
            opt_price = used_box_price

        saving = round(max(0, used_box_price - opt_price), 2)
        total_savings += saving

        product_vol = product_length * product_width * product_height
        space_eff = round((product_vol / best["volume"]) * 100, 1) if best["volume"] > 0 else 0
        empty_space = round(best["volume"] - product_vol, 1)

        co2_saved = round(saving * 0.12, 2)
        total_co2 += co2_saved

        frag_score = _fragility_score(fragility)

        results.append({
            "row_index": idx,
            "product_sku": row.get("product_sku", f"SKU-{idx + 1}"),
            "product_name": row.get("product_name", f"Product {idx + 1}"),
            "product_dimensions": f"{product_length}x{product_width}x{product_height}",
            "used_box_name": used_box_name,
            "used_box_dimensions": f"{used_box_length}x{used_box_width}x{used_box_height}",
            "used_box_price": used_box_price,
            "optimized_box_id": best.get("id", ""),
            "optimized_box_name": best.get("name", ""),
            "optimized_box_dimensions": f"{best['length']}x{best['width']}x{best['height']}",
            "optimized_box_price": opt_price,
            "savings": saving,
            "space_efficiency": space_eff,
            "empty_space_cm3": empty_space,
            "fragility_score": frag_score,
            "co2_reduction": co2_saved,
            "optimized_box_l": best["length"],
            "optimized_box_w": best["width"],
            "optimized_box_h": best["height"],
            "product_l": product_length,
            "product_w": product_width,
            "product_h": product_height,
        })

    return {
        "orders": results,
        "summary": {
            "total_products": len(results),
            "total_savings": round(total_savings, 2),
            "total_co2_reduction": round(total_co2, 2),
            "avg_space_efficiency": round(
                sum(r["space_efficiency"] for r in results) / len(results), 1
            ) if results else 0,
        }
    }
