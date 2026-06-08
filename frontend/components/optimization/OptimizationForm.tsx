"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X, Loader2, AlertCircle, Box as BoxIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/appStore";

export type ShipmentItem = {
  id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
};

type CsvRow = {
  product_sku: string;
  product_name: string;
  product_length: number;
  product_width: number;
  product_height: number;
  product_weight: number;
  used_box_name: string;
  used_box_length: number;
  used_box_width: number;
  used_box_height: number;
  used_box_price: number;
  fragility: string;
};

type OptimizationFormProps = {
  onOptimize: (items: ShipmentItem[]) => void;
  isProcessing: boolean;
};

function parseCsvText(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headerLine = lines[0].toLowerCase().replace(/\r/g, "");
  const headers = headerLine.split(",").map((h) => h.trim());

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].replace(/\r/g, "").split(",").map((v) => v.trim());
    if (vals.length < 2) continue;

    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = vals[idx] || "";
    });

    // Parse product dimensions (supports "LxWxH" or separate columns)
    let pL = 0, pW = 0, pH = 0;
    if (obj["product_dimensions"] || obj["product dimensions"] || obj["product l*w*h"] || obj["product_lwh"]) {
      const raw = obj["product_dimensions"] || obj["product dimensions"] || obj["product l*w*h"] || obj["product_lwh"] || "";
      const parts = raw.split(/[xX*×]/);
      pL = parseFloat(parts[0]) || 0;
      pW = parseFloat(parts[1]) || 0;
      pH = parseFloat(parts[2]) || 0;
    } else {
      pL = parseFloat(obj["product_length"] || obj["product length"] || "0");
      pW = parseFloat(obj["product_width"] || obj["product width"] || "0");
      pH = parseFloat(obj["product_height"] || obj["product height"] || "0");
    }

    // Parse used box dimensions
    let bL = 0, bW = 0, bH = 0;
    if (obj["box_dimensions"] || obj["box dimensions"] || obj["box l*w*h"] || obj["used_box_lwh"] || obj["box_lwh"]) {
      const raw = obj["box_dimensions"] || obj["box dimensions"] || obj["box l*w*h"] || obj["used_box_lwh"] || obj["box_lwh"] || "";
      const parts = raw.split(/[xX*×]/);
      bL = parseFloat(parts[0]) || 0;
      bW = parseFloat(parts[1]) || 0;
      bH = parseFloat(parts[2]) || 0;
    } else {
      bL = parseFloat(obj["used_box_length"] || obj["box_length"] || obj["box length"] || "0");
      bW = parseFloat(obj["used_box_width"] || obj["box_width"] || obj["box width"] || "0");
      bH = parseFloat(obj["used_box_height"] || obj["box_height"] || obj["box height"] || "0");
    }

    rows.push({
      product_sku: obj["product_sku"] || obj["sku"] || obj["product sku"] || "",
      product_name: obj["product_name"] || obj["name"] || obj["product name"] || "",
      product_length: pL,
      product_width: pW,
      product_height: pH,
      product_weight: parseFloat(obj["product_weight"] || obj["weight"] || obj["product weight"] || "0"),
      used_box_name: obj["used_box_name"] || obj["box_name"] || obj["box name"] || obj["used box name"] || "Current Box",
      used_box_length: bL,
      used_box_width: bW,
      used_box_height: bH,
      used_box_price: parseFloat(obj["used_box_price"] || obj["box_price"] || obj["box price"] || obj["used box price"] || "0"),
      fragility: obj["fragility"] || obj["fragility_score"] || obj["fragility score"] || "low",
    });
  }

  return rows;
}

export default function OptimizationForm({ onOptimize, isProcessing }: OptimizationFormProps) {
  const [items, setItems] = useState<ShipmentItem[]>([
    { id: "1", length: 0, width: 0, height: 0, weight: 0, quantity: 1 },
  ]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [mode, setMode] = useState<"manual" | "csv">("csv");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setBulkResults } = useAppStore();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.type === "text/csv")) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setCsvFile(file);
    setBulkError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCsvText(text);
      if (rows.length === 0) {
        setBulkError("Could not parse CSV. Please check the format.");
        setCsvFile(null);
        return;
      }
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const handleBulkOptimize = async () => {
    if (csvRows.length === 0) return;
    setBulkProcessing(true);
    setBulkError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/optimize-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: csvRows }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Optimization request failed.");
      }

      const data = await response.json();
      setBulkResults(data.orders, data.summary);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not reach the optimization API.";
      setBulkError(message);
    } finally {
      setBulkProcessing(false);
    }
  };

  const clearFile = () => {
    setCsvFile(null);
    setCsvRows([]);
    setBulkError("");
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), length: 0, width: 0, height: 0, weight: 0, quantity: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Omit<ShipmentItem, "id">, value: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      {/* Mode Tabs */}
      <div className="mb-6 flex rounded-xl border border-white/10 bg-black/40 p-1">
        <button
          onClick={() => setMode("csv")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "csv"
              ? "bg-packiq-blue text-white shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Upload className="mr-2 inline h-4 w-4" />
          CSV Upload
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
            mode === "manual"
              ? "bg-packiq-blue text-white shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <BoxIcon className="mr-2 inline h-4 w-4" />
          Manual Entry
        </button>
      </div>

      {mode === "csv" ? (
        <div className="space-y-4">
          {/* Drop Zone */}
          {!csvFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all ${
                dragActive
                  ? "border-packiq-blue bg-packiq-blue/10"
                  : "border-white/20 bg-black/20 hover:border-packiq-blue/50 hover:bg-white/5"
              }`}
            >
              <Upload className={`mb-3 h-10 w-10 ${dragActive ? "text-packiq-blue" : "text-gray-500"}`} />
              <p className="text-sm font-medium text-white">
                Drop your CSV file here or <span className="text-packiq-cyan">browse</span>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Columns: SKU, Product Name, Product L*W*H, Box Name, Box L*W*H, Box Price, Fragility
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-packiq-blue/30 bg-packiq-blue/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-packiq-cyan" />
                  <div>
                    <p className="text-sm font-medium text-white">{csvFile.name}</p>
                    <p className="text-xs text-gray-400">{csvRows.length} products parsed</p>
                  </div>
                </div>
                <button onClick={clearFile} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Preview */}
              {csvRows.length > 0 && (
                <div className="mt-4 max-h-48 overflow-auto rounded-lg border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs text-gray-400">
                    <thead className="border-b border-white/10 bg-black/60 text-[10px] uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">Product Dims</th>
                        <th className="px-3 py-2">Box</th>
                        <th className="px-3 py-2">Box Dims</th>
                        <th className="px-3 py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {csvRows.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 text-white">{row.product_sku}</td>
                          <td className="px-3 py-1.5">{row.product_name}</td>
                          <td className="px-3 py-1.5">{row.product_length}x{row.product_width}x{row.product_height}</td>
                          <td className="px-3 py-1.5">{row.used_box_name}</td>
                          <td className="px-3 py-1.5">{row.used_box_length}x{row.used_box_width}x{row.used_box_height}</td>
                          <td className="px-3 py-1.5">${row.used_box_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvRows.length > 5 && (
                    <p className="px-3 py-2 text-center text-[10px] text-gray-500">
                      ...and {csvRows.length - 5} more rows
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {bulkError && (
            <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{bulkError}</span>
            </div>
          )}

          <button
            onClick={handleBulkOptimize}
            disabled={bulkProcessing || csvRows.length === 0}
            className="w-full rounded-xl bg-packiq-blue py-3.5 font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {bulkProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Optimizing {csvRows.length} products...
              </>
            ) : (
              <>Run Bulk Optimization ({csvRows.length} products)</>
            )}
          </button>
        </div>
      ) : (
        <>
          {/* Manual Entry Mode */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BoxIcon className="h-5 w-5 text-packiq-blue" />
              Shipment Items
            </h3>
            <button onClick={addItem} className="text-xs font-medium text-packiq-cyan hover:text-white transition-colors">
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
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Item {index + 1}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-gray-500 hover:text-red-400 disabled:opacity-30 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Length (cm)</label>
                      <input
                        type="number"
                        value={item.length || ""}
                        onChange={(e) => updateItem(item.id, "length", Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Width (cm)</label>
                      <input
                        type="number"
                        value={item.width || ""}
                        onChange={(e) => updateItem(item.id, "width", Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={item.height || ""}
                        onChange={(e) => updateItem(item.id, "height", Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-white focus:border-packiq-blue focus:outline-none"
                      />
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
        </>
      )}
    </div>
  );
}
