import { CreditCard } from "lucide-react";

export default function BillingUsage() {
  const usage = 65; // %

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:col-span-2">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-packiq-emerald/20 text-packiq-emerald">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Billing & Usage</h3>
            <p className="text-sm text-gray-400">Your current plan and optimization limits.</p>
          </div>
        </div>
        <span className="rounded-full bg-packiq-blue/10 px-3 py-1 text-xs font-bold text-packiq-blue border border-packiq-blue/20">
          Pro Plan
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-300">API Optimizations</h4>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold text-white">6,500</span>
            <span className="text-sm text-gray-500">/ 10,000</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/40">
            <div 
              className="h-full bg-gradient-to-r from-packiq-blue to-packiq-cyan transition-all"
              style={{ width: `${usage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Resets on June 1st</p>
        </div>

        <div className="flex flex-col justify-center space-y-3 border-l border-white/10 pl-8">
          <div>
            <p className="text-sm font-medium text-gray-400">Next billing date</p>
            <p className="font-bold text-white">June 1, 2024</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Payment method</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs font-bold text-white">VISA</div>
              <span className="text-sm text-white">•••• 4242</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
