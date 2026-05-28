from typing import List, Dict, Any

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
    placed_items = []
    
    for box in sorted_boxes:
        # Check if the box can hold all items based on volume and max dimensions
        total_item_volume = sum(item['volume'] for item in sorted_items)
        if total_item_volume > box['volume']:
            continue
            
        # Simplified check: largest item dimension must fit in largest box dimension
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
        # If no single box fits, fallback to the largest available (or return error in real app)
        best_box = sorted_boxes[-1]

    # Generate mock 3D placement coordinates for visualizer
    current_z = 0
    for item in sorted_items:
        placed_items.append({
            "id": item.get('id', 'item'),
            "dimensions": [item['length'], item['height'], item['width']],
            "position": [0, item['height']/2, current_z], # Simplified placement
            "color": "#06B6D4" # Cyan for items
        })
        current_z += item['width']

    # Calculate metrics
    total_volume = sum(i['volume'] for i in sorted_items)
    box_volume = best_box['volume']
    utilization = (total_volume / box_volume) * 100 if box_volume > 0 else 0
    void_space = 100 - utilization
    
    # Mock savings
    savings = 4.25
    co2_reduction = 0.5

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
