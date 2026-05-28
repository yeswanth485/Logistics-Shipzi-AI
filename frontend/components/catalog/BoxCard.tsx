"use client";

import { Hash, Package, Ruler } from "lucide-react";
import Box3DViewer from "./Box3DViewer";

export type CatalogBox = {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number;
  type: string;
};

export default function BoxCard({ box }: { box: CatalogBox }) {
  const volume = box.length * box.width * box.height;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:border-packiq-blue/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]">
      <div className="relative h-48 w-full overflow-hidden border-b border-white/10">
        <Box3DViewer length={box.length} width={box.width} height={box.height} type={box.type} />
        <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-normal text-white backdrop-blur-md">
          {box.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 font-heading text-lg font-bold tracking-normal text-white">{box.name}</h3>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center text-gray-400">
              <Ruler className="mr-2 h-4 w-4" />
              <span>Dimensions</span>
            </div>
            <span className="font-medium text-white">
              {box.length}&quot; x {box.width}&quot; x {box.height}&quot;
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center text-gray-400">
              <Package className="mr-2 h-4 w-4" />
              <span>Max Weight</span>
            </div>
            <span className="font-medium text-white">{box.max_weight} lbs</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center text-gray-400">
              <Hash className="mr-2 h-4 w-4" />
              <span>Volume</span>
            </div>
            <span className="font-medium text-packiq-cyan">{volume.toLocaleString()} cu in</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button className="flex-1 rounded-lg bg-white/10 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20">
            Edit
          </button>
          <button className="flex-1 rounded-lg bg-packiq-blue/10 py-2 text-sm font-semibold text-packiq-blue transition-colors hover:bg-packiq-blue/20">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
