"use client";

import { useState } from "react";
import { Trash2, Box as BoxIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ShipmentItem = {
  id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
};

type OptimizationFormProps = {
  onOptimize: (items: ShipmentItem[]) => void;
  isProcessing: boolean;
};

export default function OptimizationForm({ onOptimize, isProcessing }: OptimizationFormProps) {
  const [items, setItems] = useState<ShipmentItem[]>([
    { id: "1", length: 4, width: 4, height: 4, weight: 1, quantity: 1 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), length: 0, width: 0, height: 0, weight: 0, quantity: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Omit<ShipmentItem, "id">, value: number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-white flex items-center gap-2">
          <BoxIcon className="h-5 w-5 text-packiq-blue" />
          Shipment Items
        </h3>
        <button
          onClick={addItem}
          className="text-xs font-medium text-packiq-cyan hover:text-white transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-white/5 bg-black/40 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Item {index + 1}</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Length (in)</label>
                  <input type="number" value={item.length || ""} onChange={e => updateItem(item.id, "length", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Width (in)</label>
                  <input type="number" value={item.width || ""} onChange={e => updateItem(item.id, "width", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Height (in)</label>
                  <input type="number" value={item.height || ""} onChange={e => updateItem(item.id, "height", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Qty</label>
                  <input type="number" value={item.quantity} onChange={e => updateItem(item.id, "quantity", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => onOptimize(items)}
        disabled={isProcessing}
        className="w-full rounded-xl bg-packiq-blue py-3.5 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600 disabled:opacity-70 disabled:animate-pulse"
      >
        Run Optimization
      </button>
    </div>
  );
}
