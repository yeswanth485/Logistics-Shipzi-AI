"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { user, company } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-packiq-dark/80 px-4 backdrop-blur-md lg:px-8 shadow-sm">
      <div className="flex items-center lg:hidden">
        <button className="rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-4 font-heading text-lg font-bold text-white">PackIQ</span>
      </div>
      
      <div className="hidden flex-1 items-center lg:flex">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search shipments, boxes..." 
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-packiq-blue"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        <button className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-packiq-blue opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-packiq-blue"></span>
          </span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-white">{company?.company_name || "Guest User"}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-packiq-blue to-packiq-cyan text-sm font-bold text-white ring-2 ring-packiq-dark">
            {company?.company_name ? company.company_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
          </div>
        </div>
      </div>
    </header>
  );
}
