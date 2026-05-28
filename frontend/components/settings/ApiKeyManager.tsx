"use client";

import { useState } from "react";
import { Key, Copy, Check } from "lucide-react";

export default function ApiKeyManager() {
  const [copied, setCopied] = useState(false);
  const apiKey = "pk_test_8f92j3n84m298d3n20984n2";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center space-x-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-packiq-amber/20 text-packiq-amber">
          <Key className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-white">API Keys</h3>
          <p className="text-sm text-gray-400">Manage keys for integrating PackIQ with your WMS or ERP.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Test API Key</label>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              readOnly 
              value={apiKey} 
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm font-mono text-gray-300 focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              {copied ? <Check className="h-4 w-4 text-packiq-emerald" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Do not share this key. Keep it secure.</p>
        </div>

        <button className="rounded-xl border border-packiq-amber/50 bg-packiq-amber/10 px-4 py-2 text-sm font-semibold text-packiq-amber transition-colors hover:bg-packiq-amber/20">
          Roll Key
        </button>
      </div>
    </div>
  );
}
