"use client";

import BoxCatalogGrid from "@/components/catalog/BoxCatalogGrid";
import { Package } from "lucide-react";

export default function BoxCatalogPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
            <Package className="h-8 w-8 text-packiq-blue" />
            Box Catalog
          </h1>
          <p className="mt-2 text-gray-400">Manage your available packaging inventory and dimensions.</p>
        </div>
      </div>

      <BoxCatalogGrid />
    </div>
  );
}
