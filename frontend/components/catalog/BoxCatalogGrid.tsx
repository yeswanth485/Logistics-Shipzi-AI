"use client";

import { useState } from "react";
import BoxCard from "./BoxCard";
import { Search, Filter, Plus, Package } from "lucide-react";
import { motion } from "framer-motion";

const mockBoxes = [
  { id: 1, name: "Small Corrugated Cube", length: 6, width: 6, height: 6, max_weight: 10, type: "Corrugated" },
  { id: 2, name: "Medium Flat Mailer", length: 12, width: 9, height: 2, max_weight: 5, type: "Poly Mailer" },
  { id: 3, name: "Standard Medium Box", length: 12, width: 10, height: 8, max_weight: 20, type: "Corrugated" },
  { id: 4, name: "Large Cube", length: 16, width: 16, height: 16, max_weight: 40, type: "Corrugated" },
  { id: 5, name: "Long Poster Tube", length: 24, width: 4, height: 4, max_weight: 8, type: "Tube" },
  { id: 6, name: "Extra Large Heavy Duty", length: 24, width: 18, height: 18, max_weight: 65, type: "Corrugated Double Wall" },
];

export default function BoxCatalogGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  const types = ["All", ...Array.from(new Set(mockBoxes.map(b => b.type)))];
  
  const filteredBoxes = mockBoxes.filter(box => {
    const matchesSearch = box.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || box.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search boxes by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
            <Filter className="h-4 w-4" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent focus:outline-none appearance-none"
            >
              {types.map(t => (
                <option key={t} value={t} className="bg-packiq-dark">{t}</option>
              ))}
            </select>
          </div>
          
          <button className="flex items-center space-x-2 rounded-xl bg-packiq-blue px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600">
            <Plus className="h-4 w-4" />
            <span>Add New Box</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBoxes.map((box, i) => (
          <motion.div 
            key={box.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <BoxCard box={box} />
          </motion.div>
        ))}
      </div>
      
      {filteredBoxes.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-center">
          <Package className="mb-4 h-12 w-12 text-gray-500" />
          <h3 className="mb-1 text-lg font-medium text-white">No boxes found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
